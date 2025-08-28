import { TwitterApi } from "twitter-api-v2";
import { env } from "../../env";

export const twitterClient = new TwitterApi(env.X_API_KEY!);
