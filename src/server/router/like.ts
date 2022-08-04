/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import Email from "next-auth/providers/email";
import { z } from "zod";
import { createRouter } from "./context";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultLikeSelect = Prisma.validator<Prisma.LikeSelect>()({
  createdAt: true,
  postId: true,
  userId: true,
});

const getEmailOrThrow = (ctx: any) => {
  const email = ctx.session?.user?.email;
  console.log(ctx.session);
  if (!email) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return email;
};

export const likeRouter = createRouter()
  // create
  .mutation("add", {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { postId } = input;
      const email: any = getEmailOrThrow(ctx);
      console.log(postId);
      const like = await ctx.prisma.like.create({
        data: {
          user: { connect: { email: email } },
          post: { connect: { id: postId } },
        },
        select: defaultLikeSelect,
      });
      return like;
    },
  })
  // read
  .query("allLikes", {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.like.findMany({
        select: defaultLikeSelect,
      });
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
        where: {id: postId},
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
        select: defaultLikeSelect,
      });
      if (like){
        return true
      } else { return false} 
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
