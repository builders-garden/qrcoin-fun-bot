import { TwitterApi } from "twitter-api-v2";
import { env } from "../../env";

export const twitterClient = new TwitterApi({
  appKey: env.X_APP_KEY,
  appSecret: env.X_APP_SECRET,
  accessToken: env.TWITTER_ACCESS_TOKEN_KEY,
  accessSecret: env.TWITTER_ACCESS_TOKEN_SECRET,
});

export const twitterClientReadOnly = new TwitterApi(
  process.env.TWITTER_BEARER_TOKEN ?? ""
);

export interface DeepLinkEmbedParams {
  auctionId: number;
  joinBidUrl: string;
}

/**
 * Cleans a URL by removing protocol and trailing slashes
 * Matches the normalization used in QR-auction-web
 */
function cleanUrl(url: string): string {
  let cleaned = url.replace(/^https?:\/\//, ''); // Remove http:// or https://
  cleaned = cleaned.replace(/\/$/, ''); // Remove trailing slash
  return cleaned;
}

/**
 * Creates an embed URL for deep linking to an auction
 * @param params - The auction ID and join bid URL
 * @returns The formatted embed URL with query parameters for QR-auction-web
 *
 * This generates URLs in the format expected by QR-auction-web:
 * https://qrcoin.fun/?auction={id}&joinBid={cleanedUrl}
 */
export function createDeepLinkEmbed(params: DeepLinkEmbedParams): string {
  const { auctionId, joinBidUrl } = params;
  const baseUrl = "https://qrcoin.fun";

  // Clean the URL (remove protocol and trailing slash)
  const cleanedBidUrl = cleanUrl(joinBidUrl);

  // Create URL at root path (not /auction/{id})
  const url = new URL(baseUrl);
  url.searchParams.set("auction", auctionId.toString());
  url.searchParams.set("joinBid", cleanedBidUrl);

  return url.toString();
}

/**
 * Posts a tweet with optional deep link embed
 * Note: X/Twitter automatically unfurls URLs in tweets, so the embed URL
 * will be displayed as a card if Open Graph metadata is configured
 */
export async function postTweetWithEmbed(params: {
  text: string;
  embedUrl?: string;
}) {
  const { text, embedUrl } = params;

  // For X/Twitter, we include the URL directly in the tweet text
  // Twitter will automatically create a card preview if OG tags are set up
  const tweetText = embedUrl ? `${text}\n\n${embedUrl}` : text;

  const tweet = await twitterClient.v2.tweet({
    text: tweetText,
  });

  return tweet;
}
