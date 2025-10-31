import { formatUnits } from "viem";
// @ts-ignore
import * as sd from "simple-duration";
import { twitterClient } from "./x-api";

export const createTweet = async ({
  name,
  amount,
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
    let text = `new contribution by @${name}!

- contribution: $${formatUnits(amount, 6)}
- total bid amount: $${formatUnits(totalBidAmount, 6)}
- link: ${url}
- time remaining: ${timeRemaining}
- current lead bid: $${formatUnits(leadBid, 6)}

join the bid:`;

    // Append embedUrl if provided (Twitter will unfurl as card)
    if (embedUrl) {
      text = `${text}\n\n${embedUrl}`;
    }

    await twitterClient.readWrite.v2.tweet(text);

    return;
  }

  let text = `new bid started by @${name}!

- amount: $${formatUnits(amount, 6)}
- link: ${url}
- time remaining: ${timeRemaining}
- current lead bid: $${formatUnits(leadBid, 6)}

bid now:`;

  // Append embedUrl if provided (Twitter will unfurl as card)
  if (embedUrl) {
    text = `${text}\n\n${embedUrl}`;
  }

  await twitterClient.readWrite.v2.tweet(text);
};
