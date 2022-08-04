// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession as getServerSession } from "next-auth";
// import * as compression from'compression'
import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "../db/client";

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions,
) => {
  const req: any = opts?.req;
  const res: any = opts?.res;

  const session =
    req && res && (await getServerSession(req, res, nextAuthOptions));
  // const compressed = compression.filter(req, res)
  return {
    req,
    res,
    // compressed,
    session,
    prisma,
  }; 
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
