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
      address: "0x6a0fb6dfda897dae3c69d06d5d6b5d6b251281da",
      chain: "base",
    },
  },
});
