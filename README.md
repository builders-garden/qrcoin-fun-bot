# 🤖 qrcoin-fun-bot

A  bot that monitors QR auction events and write posts on both X and Farcaster.

## 🚀 Features

### 📡 Real-time Auction Event Monitoring

The bot continuously monitors the QR auction smart contract on Base chain and automatically posts updates to both X and Farcaster when:

- New bids are placed on QR auctions
- Contributions are made to existing bids

## 📦 Setup

Clone the repository and run `pnpm install` to install the dependencies.

### 🔑 Environment Variables

Create a `.env` file in the root of the repository and add the following variables:

- `NEYNAR_API_KEY`: The API key for Neynar.
- `FARCASTER_SIGNER_UUID`: The signer UUID for Farcaster.
- `PONDER_RPC_URL_8453`: The RPC URL for the base chain.
- `X_APP_KEY`: The app key for X.
- `X_APP_SECRET`: The app secret for X.
- `TWITTER_ACCESS_TOKEN_KEY`: The access token key for X.
- `TWITTER_ACCESS_TOKEN_SECRET`: The access token secret for X.

We strongly suggest retrieving the `FARCASTER_SIGNER_UUID` using this tutorial from Neynar: [Create Farcaster Bot UI](https://docs.neynar.com/docs/create-farcaster-bot-ui).

The `PONDER_RPC_URL_8453` **must** be a working RPC URL for the base chain. We suggest using a paid RPC provider such as [Alchemy](https://www.alchemy.com/).

The `X_APP_KEY` and `X_APP_SECRET` can be retrieved from the X Developer Portal, as well as the `TWITTER_ACCESS_TOKEN_KEY` and `TWITTER_ACCESS_TOKEN_SECRET`. These keys **must have** read and write permissions to the Twitter V2 API.

### 🚀 Running the Bot

The bot leverages [Ponder](https://ponder.sh/) to listen for blockchain events and run the bot.

**Start the bot:**
```bash
pnpm dev
```

**What happens when you start:**
- Starts listening for blockchain events from the QR auction contract
- Monitors contract address: `0xcb3b4678b623984158b1d1fcd4062d5a0b56bc7f`
- Automatically posts updates to both X and Farcaster when events occur

**Note:** Do not use `pnpm start` as it is reserved for DB production usage. The bot always starts listening from the latest block, so there's no need to use `pnpm start`.
