import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

const github_id: any = process.env.GITHUB_ID
const github_secret: any = process.env.GITHUB_SECRET

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: github_id,
      clientSecret: github_secret,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
