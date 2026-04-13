import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_ENDPOINT: z.url(),
    R2_PUBLIC_URL: z.url(),
    R2_BUCKET_NAME: z.string(),
    ADMIN_SECRET: z.string(),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    ADMIN_SECRET: process.env.ADMIN_SECRET,
  },
});
