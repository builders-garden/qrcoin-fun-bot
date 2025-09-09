import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "../env";
import { twitterClient } from "../lib/x/x-api";
import { SYSTEM_TEMPLATE, X_USERNAME } from "../lib/constants";

const getAIXBTLatestPost = async () => {
  const aixbtAgent = await twitterClient.readOnly.v2.userByUsername(
    X_USERNAME
  );

  const posts = aixbtAgent.includes?.tweets;

  if (!posts || posts.length === 0) {
    return null;
  }

  // Calculate timestamp for 1 hour ago
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  // Filter posts from the last hour and sort by creation date (newest first)
  const recentPosts = posts
    .filter((post: any) => {
      const postDate = new Date(post.created_at);
      return postDate > oneHourAgo;
    })
    .sort((a: any, b: any) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB.getTime() - dateA.getTime(); // Sort newest first
    });

  // Log how many posts were found in the last hour
  if (recentPosts.length > 0) {
    console.log(`Found ${recentPosts.length} post(s) from the last hour, selecting the most recent`);
  }

  // Return the most recent post (first in sorted array)
  return recentPosts[0] || null;
};

export const cronJob = async () => {
  console.log("Checking for posts from @aixbt_agent in the last hour...");
  
  const latestPost = await getAIXBTLatestPost();

  if (!latestPost) {
    console.log("No posts found from the last hour");
    return;
  }

  console.log(`Found post from ${latestPost.created_at}: ${latestPost.text?.substring(0, 100)}...`);

  const { text } = await generateText({
    model: openai(env.OPENAI_MODEL),
    prompt: `${SYSTEM_TEMPLATE}\n\n${latestPost.text}`,
  });

  await Promise.allSettled([
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
};
