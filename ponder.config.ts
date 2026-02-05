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
      address: "0x7309779122069efa06ef71a45ae0db55a259a176",
      chain: "base",
    },
  },
});
