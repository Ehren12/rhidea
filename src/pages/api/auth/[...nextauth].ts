import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { generateFromEmail, generateUsername } from "unique-username-generator";
const github_id: any = process.env.GITHUB_ID;
const github_secret: any = process.env.GITHUB_SECRET;

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
  events: {
    signIn: async ({ user, profile, isNewUser }: any) => {
      const user_profile = await prisma.profile.findUnique({
        where: {
          userId: user.id,
        },
      });
      const username = generateFromEmail(user?.email, 4);
      if (user_profile === null) {
        await prisma.profile.create({
          data: {
            user: { connect: { id: user.id } },
            username: username,
          },
        });
      }

      console.log("profile created");
    },
    signOut: async (message) => {
      console.log("CUSTOM EVENT signOut");
    },
    createUser: async ({ user }:any) => {
      const user_profile = await prisma.profile.findUnique({
        where: {
          userId: user.id,
        },
      });
      const username = generateFromEmail(user?.email, 4);
      if (user_profile === null) {
        await prisma.profile.create({
          data: {
            user: { connect: { id: user.id } },
            username: username,
          },
        });
      }
    },
  },
};

export default NextAuth(authOptions);
