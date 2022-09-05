/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import Email from "next-auth/providers/email";
import { z } from "zod";
import { createRouter } from "../context";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultProfileSelect = Prisma.validator<Prisma.UserSelect>()({
  username: true,
});

const getEmailOrThrow = (ctx: any) => {
  const email = ctx.session?.user?.email;
  console.log(ctx.session);
  if (!email) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return email;
};

export const profileRouter = createRouter()
  .query("findByEmail", {
    input: z.object({
      id: z.any(),
      email: z.string().optional(),
    }),
    async resolve({ input, ctx }: any) {
      const { id } = input;
      console.log("ID: " + id);
      const { email } = input;
      let profileByEmail;
      console.log("EMAIL: " + email);
      if (id === undefined) {
        profileByEmail = await ctx.prisma.user.findUnique({
          where: {
            email: email,
          },
        });
      } else {
        profileByEmail = await ctx.prisma.user.findUnique({
          where: {
            id: id,
          },
        });
      }

      if (!profileByEmail) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id '${id}'`,
        });
      }
      console.log("working" + profileByEmail.username);
      return profileByEmail;
    },
  })

  .query("user_profile", {
    input: z.object({
      username: z.any(),
    }),
    async resolve({ input, ctx }: any) {
      const { username } = input;
      const post = await ctx.prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with id '${username}'`,
        });
      }
      console.log("working");
      return post;
    },
  })
