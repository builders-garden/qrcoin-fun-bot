import { TwitterApi } from "twitter-api-v2";
import { env } from "../../env";

export const twitterClient = new TwitterApi({
  appKey: env.X_APP_KEY,
  appSecret: env.X_APP_SECRET,
  accessToken: env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: env.TWITTER_ACCESS_TOKEN_SECRET,
});
