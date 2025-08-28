import { formatUnits, Hex } from "viem";
// @ts-ignore
import * as sd from "simple-duration";
import { env } from "../../env";

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
  const res = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
    {
      headers: {
        "x-api-key": env.NEYNAR_API_KEY,
      },
    }
  );

  const result = await res.json();
  const user = (result as any)[address];

  let username = address as string;
  if (user) {
    username = `@${user[0].username}`;
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

  await fetch("https://api.neynar.com/v2/farcaster/cast", {
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
  });
};
