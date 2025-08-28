import { ponder } from "ponder:registry";
import { createCast } from "./lib/farcaster";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { env } from "./env";
import { createTweet } from "./lib/x";

ponder.on("qrAuctionV4:AuctionBid", async ({ event, context }) => {
  const { bidder, amount, endTime, urlString, name } = event.args;

  const publicClient = createPublicClient({
    chain: base,
    transport: http(env.PONDER_RPC_URL_8453),
  });

  const auction = await publicClient.readContract({
    abi: context.contracts.qrAuctionV4.abi,
    address: context.contracts.qrAuctionV4.address,
    functionName: "auction",
    args: [],
  });

  const leadBid = auction[1].totalAmount;

  await Promise.all([
    createCast({
      address: bidder,
      amount,
      url: urlString,
      leadBid,
      endTime,
    }),
    createTweet({
      name,
      amount,
      url: urlString,
      leadBid,
      endTime,
    }),
  ]);
});

ponder.on("qrAuctionV4:BidContributionMade", async ({ event, context }) => {
  const { contributor, amount, endTime, urlString, name } = event.args;

  const publicClient = createPublicClient({
    chain: base,
    transport: http(env.PONDER_RPC_URL_8453),
  });

  const auction = await publicClient.readContract({
    abi: context.contracts.qrAuctionV4.abi,
    address: context.contracts.qrAuctionV4.address,
    functionName: "auction",
    args: [],
  });

  const leadBid = auction[1].totalAmount;

  await Promise.all([
    createCast({
      address: contributor,
      amount,
      url: urlString,
      endTime,
      leadBid,
      isContribution: true,
    }),
    createTweet({
      name,
      amount,
      url: urlString,
      endTime,
      leadBid,
      isContribution: true,
    }),
  ]);
});
