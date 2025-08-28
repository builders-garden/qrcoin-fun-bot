import { z } from "zod";

const envSchema = z.object({
  NEYNAR_API_KEY: z.string(),
  FARCASTER_SIGNER_UUID: z.string(),
  PONDER_RPC_URL_8453: z.string(),
  X_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
