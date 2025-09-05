import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { env } from "../env";
import { twitterClient } from "../lib/x/x-api";

const SYSTEM_TEMPLATE = `Write the assistant personality here.\n\nRewrite the following tweet:\n\n`;

const getAIXBTLatestPost = async () => {
  const aixbtAgent = await twitterClient.readOnly.v2.userByUsername(
    "aixbt_agent"
  );

  const posts = aixbtAgent.includes?.tweets;

  return posts?.[0];
};

export const cronJob = async () => {
  const latestPost = await getAIXBTLatestPost();

  if (!latestPost) {
    return;
  }

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
