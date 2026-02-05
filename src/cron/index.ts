import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "../env";
import { twitterClientReadOnly, twitterClient } from "../lib/x/x-api";
import { SYSTEM_TEMPLATE, X_USERNAMES } from "../lib/constants";

const getLatestPosts = async () => {
  // Construct search query - exclude retweets, replies, and quote tweets
  const query = X_USERNAMES.map(
    (u) => `from:${u} -is:retweet -is:reply -is:quote`
  ).join(" OR ");

  // Perform a single recent search request
  const searchResult = await twitterClientReadOnly.readOnly.v2.search(query, {
    max_results: 50,
    "tweet.fields": ["created_at", "text", "id", "author_id"],
    expansions: ["author_id"],
    "user.fields": ["username", "name", "profile_image_url"],
    sort_order: "recency", // ensure newest first
  });

  const tweets = searchResult.data.data || [];
  //const users = searchResult.data.includes?.users || [];

  console.log(`Retrieved ${tweets.length} total tweets from search`);

  if (tweets.length === 0) {
    console.log("No posts found");
    return null;
  }

  // Filter for last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentPosts = tweets
    .filter((tweet: any) => new Date(tweet.created_at) > oneHourAgo)
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  if (recentPosts.length === 0) {
    console.log("No posts found from the last hour");
    return null;
  }

  // Log posts for debugging
  recentPosts.forEach((post: any, index: number) => {
    console.log(`\n--- Post ${index + 1} ---`);
    console.log(`@${post.username} (${post.name})`);
    console.log(`Created at: ${post.created_at}`);
    console.log(`Text: ${post.text}`);
    console.log(`ID: ${post.id}`);
    console.log(`Author ID: ${post.author_id}`);
  });

  // Return array of just the post texts
  const validPost = recentPosts.map((post: any) => post.text);

  return validPost;
};

export const cronJob = async () => {
  const latestPosts = await getLatestPosts();

  if (!latestPosts || latestPosts.length === 0) {
    return;
  }

  const { text } = await generateText({
    model: openai(env.OPENAI_MODEL),
    prompt: `${SYSTEM_TEMPLATE}\n\n${latestPosts.join("\n")}`,
  });
  console.log(text, "text");

  if (text === "error_no_post") {
    console.log("The agent was unable to find any posts to rewrite");
    return;
  }

  const [twitterResult, farcasterResult] = await Promise.allSettled([
    twitterClient.readWrite.v2.tweet(text),
    fetch("https://api.neynar.com/v2/farcaster/cast", {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": env.NEYNAR_API_KEY,
      },
      method: "POST",
      body: JSON.stringify({
        signer_uuid: env.FARCASTER_SIGNER_UUID,
        text,
      }),
    }),
  ]);

  // Log results
  if (twitterResult.status === "fulfilled") {
    console.log("Twitter post success:", twitterResult.value.data?.id);
  } else {
    console.error("Twitter post failed:", twitterResult.reason);
  }

  if (farcasterResult.status === "fulfilled") {
    const fcResponse = await farcasterResult.value.json();
    console.log("Farcaster post success:", fcResponse);
  } else {
    console.error("Farcaster post failed:", farcasterResult.reason);
  }
};
