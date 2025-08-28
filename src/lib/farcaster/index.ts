import { neynar } from "./neynar";
import { formatUnits, Hex } from "viem";
// @ts-ignore
import * as sd from "simple-duration";

export const createCast = async ({
  address,
  amount,
  url,
  endTime,
  leadBid,
  isContribution = false,
}: {
  address: Hex;
  amount: bigint;
  url: string;
  endTime: bigint;
  leadBid: bigint;
  isContribution?: boolean;
}) => {
  const { result } = await neynar.fetchBulkUsersByEthOrSolAddress({
    addresses: [address],
  });

  let username = address as string;
  if (result && result.length > 0) {
    username = `@${result[0]?.username}`;
  }

  const timeRemaining = sd.stringify(
    Math.floor(Number(endTime) - Date.now() / 1000)
  );

  const text = `new ${isContribution ? "contribution" : "bid"} by ${username}!
  
  - amount: ${formatUnits(amount, 6)} USDC
  - link: [${url}]
  - time remaining: ${timeRemaining}
  - current lead bid: ${formatUnits(leadBid, 6)} USDC
  
  Tag @bankr to place a bid before the time is up!`;

  await neynar.publishCast({
    signerUuid: process.env.FARCASTER_SIGNER_UUID!,
    text,
  });
};
