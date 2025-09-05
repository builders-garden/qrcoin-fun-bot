# 🤖 qrcoin-fun-bot

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
- `OPENAI_MODEL`: The model to use for OpenAI.
- `OPENAI_API_KEY`: The API key for OpenAI.

We strongly suggest retrieving the `FARCASTER_SIGNER_UUID` using this tutorial from Neynar: [Create Farcaster Bot UI](https://docs.neynar.com/docs/create-farcaster-bot-ui).

The `PONDER_RPC_URL_8453` **must** be a working RPC URL for the base chain. We suggest using a paid RPC provider such as [Alchemy](https://www.alchemy.com/).

The `X_APP_KEY` and `X_APP_SECRET` can be retrieved from the X Developer Portal, as well as the `TWITTER_ACCESS_TOKEN_KEY` and `TWITTER_ACCESS_TOKEN_SECRET`. These keys **must have** read and write permissions to the Twitter V2 API.

The `OPENAI_MODEL` is set to default to `gpt-4o-mini`, and the `OPENAI_API_KEY` can be retrieved from the OpenAI Developer Portal.

#### 🤖 Assistant Personality

The assistant personality is the personality of the assistant that will be used to rewrite the tweets. **REMEMBER TO MODIFY THE SYSTEM TEMPLATE IN THE `src/cron/system-template.ts` FILE.**

### 🚀 Running the bot

The bot leverages [Ponder](https://ponder.sh/) to listen for events and run the bot. To run the bot, run `pnpm dev`. Do not use `pnpm start` as it is reserved for DB production usage, but we don't store any of these events in a DB so we can safely ignore it, and the bot always starts listening from the latest block, so there's no need to use `pnpm start`.
