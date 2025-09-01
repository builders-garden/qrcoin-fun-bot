import { ponder } from "ponder:registry";
import { createCast } from "./lib/farcaster";
import { Abi, createPublicClient, Hex, http } from "viem";
import { base } from "viem/chains";
import { env } from "./env";
import { createTweet } from "./lib/x";
import { BulkUsersByAddressResponse } from "@neynar/nodejs-sdk/build/api";

const createFromEvent = async ({
  address,
  amount,
  endTime,
  urlString,
  name,
  totalAmount,
  isContribution,
  contractAbi,
  contractAddress,
}: {
  address: Hex;
  amount: bigint;
  endTime: bigint;
  urlString: string;
  name: string;
  totalAmount: bigint;
  isContribution: boolean;
  contractAbi: Abi;
  contractAddress: Hex;
}): Promise<void> => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(env.PONDER_RPC_URL_8453),
  });

  const auction = await publicClient.readContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "auction",
    args: [],
  });

  const leadBid = (auction as any)[1].totalAmount;

  const res = await fetch(
    `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
    {
      headers: {
        "x-api-key": env.NEYNAR_API_KEY,
      },
    }
  );

  const result = await res.json();
  const farcasterUser = (result as BulkUsersByAddressResponse)[address];

  const farcasterUsername = farcasterUser?.[0]?.username;
  const xUsername = farcasterUser?.[0]?.verified_accounts?.find(
    (account) => account.platform === "x"
  )?.username;

  await Promise.all([
    createCast({
      name: farcasterUsername ? farcasterUsername : name ? name : address,
      amount,
      url: urlString,
      leadBid,
      endTime,
      totalBidAmount: totalAmount,
      isContribution,
    }),
    createTweet({
      name: name ? name : xUsername ? xUsername : address,
      amount,
      url: urlString,
      leadBid,
      endTime,
      totalBidAmount: totalAmount,
      isContribution,
    }),
  ]);
};

ponder.on("qrAuctionV4:AuctionBid", async ({ event, context }) => {
  const { bidder, amount, endTime, urlString, name } = event.args;

  await createFromEvent({
    address: bidder,
    amount,
    endTime,
    urlString,
    name,
    totalAmount: 0n,
    isContribution: false,
    contractAbi: context.contracts.qrAuctionV4.abi,
    contractAddress: context.contracts.qrAuctionV4.address,
  });
});

ponder.on("qrAuctionV4:BidContributionMade", async ({ event, context }) => {
  const { contributor, amount, endTime, urlString, name, totalAmount } =
    event.args;

  await createFromEvent({
    address: contributor,
    amount,
    endTime,
    urlString,
    name,
    totalAmount,
    isContribution: true,
    contractAbi: context.contracts.qrAuctionV4.abi,
    contractAddress: context.contracts.qrAuctionV4.address,
  });
});
