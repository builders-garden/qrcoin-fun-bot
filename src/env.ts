import { z } from "zod";

const envSchema = z.object({
  NEYNAR_API_KEY: z.string(),
  FARCASTER_SIGNER_UUID: z.string(),
  PONDER_RPC_URL_8453: z.string(),
  X_APP_KEY: z.string(),
  X_APP_SECRET: z.string(),
  TWITTER_ACCESS_TOKEN_KEY: z.string().optional(),
  TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
