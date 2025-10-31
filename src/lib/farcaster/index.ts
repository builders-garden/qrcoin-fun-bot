import { formatUnits } from "viem";
// @ts-ignore
import * as sd from "simple-duration";
import { env } from "../../env";

export interface DeepLinkEmbedParams {
  auctionId: number;
  joinBidUrl: string;
}

/**
 * Cleans a URL by removing protocol and trailing slashes
 * Matches the normalization used in QR-auction-web
 */
function cleanUrl(url: string): string {
  let cleaned = url.replace(/^https?:\/\//, ""); // Remove http:// or https://
  cleaned = cleaned.replace(/\/$/, ""); // Remove trailing slash
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

export const createCast = async ({
  amount,
  name,
  url,
  endTime,
  leadBid,
  totalBidAmount = 0n,
  isContribution = false,
  embedUrl,
}: {
  name: string;
  amount: bigint;
  url: string;
  endTime: bigint;
  leadBid: bigint;
  totalBidAmount?: bigint;
  isContribution?: boolean;
  embedUrl?: string;
}) => {
  const timeRemaining = sd.stringify(
    Math.floor(Number(endTime) - Date.now() / 1000)
  );

  if (isContribution) {
    const text = `new contribution by @${name}!

- contribution: $${formatUnits(amount, 6)}
- total bid amount: $${formatUnits(totalBidAmount, 6)}
- link: ${url}
- time remaining: ${timeRemaining}
- current lead bid: $${formatUnits(leadBid, 6)}

join the bid:`;

    const requestBody: any = {
      signer_uuid: env.FARCASTER_SIGNER_UUID,
      text,
    };

    // Add embeds if embedUrl is provided
    if (embedUrl) {
      requestBody.embeds = [{ url: embedUrl }];
    }

    await fetch("https://api.neynar.com/v2/farcaster/cast", {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": env.NEYNAR_API_KEY,
      },
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    return;
  }

  const text = `new bid started by @${name}!

- amount: $${formatUnits(amount, 6)}
- link: ${url}
- time remaining: ${timeRemaining}
- current lead bid: $${formatUnits(leadBid, 6)}

join bid:`;

  const requestBody: any = {
    signer_uuid: env.FARCASTER_SIGNER_UUID,
    text,
  };

  // Add embeds - for new bid, include both embedUrl and bid URL
  if (embedUrl) {
    requestBody.embeds = [{ url: embedUrl }, { url: url }];
  }

  await fetch("https://api.neynar.com/v2/farcaster/cast", {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-api-key": env.NEYNAR_API_KEY,
    },
    method: "POST",
    body: JSON.stringify(requestBody),
  });
};
