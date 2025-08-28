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
  isContribution = false,
}: {
  name: string;
  amount: bigint;
  url: string;
  endTime: bigint;
  leadBid: bigint;
  isContribution?: boolean;
}) => {
  const timeRemaining = sd.stringify(
    Math.floor(Number(endTime) - Date.now() / 1000)
  );

  const text = `new ${isContribution ? "contribution" : "bid"} by ${name}!
      
- amount: ${formatUnits(amount, 6)} USDC
- link: [${url}]
- time remaining: ${timeRemaining}
- current lead bid: ${formatUnits(leadBid, 18)} USDC

Tag bankr to place a bid before the time is up!`;

  await twitterClient.v2.tweet(text);
};
