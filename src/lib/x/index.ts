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
}: {
  name: string;
  amount: bigint;
  url: string;
  endTime: bigint;
  leadBid: bigint;
  totalBidAmount?: bigint;
  isContribution?: boolean;
}) => {
  const timeRemaining = sd.stringify(
    Math.floor(Number(endTime) - Date.now() / 1000)
  );

  if (isContribution) {
    const text = `new contribution by @${name}!
        
- contribution: ${formatUnits(amount, 6)} USDC
- total bid amount: ${formatUnits(totalBidAmount, 18)} USDC
- link: [${url}]
- time remaining: ${timeRemaining}
- current lead bid: ${formatUnits(leadBid, 18)} USDC

Tag @bankr to place a bid before the time is up!`;

    await twitterClient.readWrite.v2.tweet(text);

    return;
  }

  const text = `new bid by @${name}!
      
- amount: ${formatUnits(amount, 6)} USDC
- link: [${url}]
- time remaining: ${timeRemaining}
- current lead bid: ${formatUnits(leadBid, 18)} USDC

Tag @bankr to place a bid before the time is up!`;

  await twitterClient.readWrite.v2.tweet(text);
};
