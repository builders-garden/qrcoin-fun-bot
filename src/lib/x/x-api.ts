import { TwitterApi } from "twitter-api-v2";

// Instantiate with desired auth type (here's Bearer v2 auth)
export const twitterClient = new TwitterApi(process.env.X_API_KEY!);
