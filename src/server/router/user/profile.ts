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
  // create
  .mutation("update_bio", {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }: any) {
      const { postId } = input;
      const email: any = getEmailOrThrow(ctx);
      console.log(postId);
      const like = await ctx.prisma.like.create({
        data: {
          user: { connect: { email: email } },
          post: { connect: { id: postId } },
        },
        select: defaultProfileSelect,
      });
      return like;
    },
  })
  // read
  // .query("user_profile", {
  //   input: z.object({
  //     username: z.string(),
  //     // userId: z.any(),
  //   }),
  //   async resolve({ input, ctx }: any) {
  //     /**
  //      * For pagination you can have a look at this docs site
  //      * @link https://trpc.io/docs/useInfiniteQuery
  //      */
  //     const { username } = input;
  //     // const user = await ctx.prisma.user.findUnique({
  //     //   where: {
  //     //     email: email
  //     //   }
  //     // })
  //     console.log("BEFORE PROFILE");
  //     const profile = await ctx.prisma.profile.findUnique({
  //       where: {
  //         username: username,
  //       },
  //     });
  //     console.log("WORKING");
  //     console.log("profile des " + profile.username);
  //     return profile;
  //   },
  // })

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
  .query("allLikesCount", {
    input: z.object({
      postId: z.any(),
      userId: z.any(),
    }),
    async resolve({ input, ctx }) {
      const { postId } = input;
      return ctx.prisma.post.findUnique({
        where: { id: postId },
        include: {
          _count: {
            select: { likes: true },
          },
        },
      });
    },
  })
  .query("like", {
    input: z.object({
      postId: z.any(),
      userId: z.any(),
    }),
    async resolve({ input, ctx }) {
      const { postId } = input;
      const { userId } = input;
      const like = await ctx.prisma.like.findUnique({
        where: { postId_userId: { postId: postId, userId: userId } },
        select: defaultProfileSelect,
      });
      if (like) {
        return true;
      } else {
        return false;
      }
    },
  })
  // update
  // .mutation('edit', {
  //   input: z.object({
  //     id: z.string().uuid(),
  //     data: z.object({
  //       title: z.string().min(1).max(32).optional(),
  //       text: z.string().min(1).optional(),
  //     }),
  //   }),
  //   async resolve({ input, ctx }) {
  //     const { id, data } = input;
  //     const post = await ctx.prisma.post.update({
  //       where: { id },
  //       data,
  //       select: defaultPostSelect,
  //     });
  //     return post;
  //   },
  // })
  // delete
  .mutation("deleteLike", {
    input: z.object({
      postId: z.string(),
      userId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { postId } = input;
      const { userId } = input;
      await ctx.prisma.like.delete({
        where: { postId_userId: { postId: postId, userId: userId } },
      });
    },
  });
