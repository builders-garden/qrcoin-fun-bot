import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: "YOUR_NEYNAR_API_KEY",
});

export const neynar = new NeynarAPIClient(config);
