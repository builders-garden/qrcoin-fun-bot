import { createConfig } from "ponder";

import { qrAuctionV4Abi } from "./abis/qr-auction-v4";
import { env } from "./src/env";

export default createConfig({
  chains: {
    base: { id: 8453, rpc: env.PONDER_RPC_URL_8453 },
  },
  contracts: {
    qrAuctionV4: {
      startBlock: "latest",
      abi: qrAuctionV4Abi,
      address: "0xcb3b4678b623984158b1d1fcd4062d5a0b56bc7f",
      chain: "base",
    },
  },
});
