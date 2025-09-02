import { createRemoteJWKSet, jwtVerify } from "jose";

import * as supabaseClient from "./client";
import * as supabaseMiddleware from "./middleware";
import * as supabaseServer from "./server";

export type { UserResponse } from "@supabase/supabase-js";

const PROJECT_ID = process.env.PROJECT_ID;
const PROJECT_JWKS = createRemoteJWKSet(
  new URL(`https://${PROJECT_ID}.supabase.co/auth/v1/.well-known/jwks.json`),
);

async function verifyJWT(token: string) {
  try {
    return await jwtVerify(token, PROJECT_JWKS);
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("Invalid JWT");
  }
}

export { supabaseClient, supabaseServer, supabaseMiddleware, verifyJWT };
