/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from "./context";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  text: true,
  createdAt: true,
  updatedAt: true,
});

const getEmailOrThrow = (ctx: any) => {
  const email = ctx.session?.user?.email;
  console.log(ctx.session)
  if (!email) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return email;
};

export const postRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      title: z.string().min(1).max(150),
      text: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      const email: any = getEmailOrThrow(ctx);
      const post = await ctx.prisma.post.create({
        data: {...input, creator: {connect: {email: email}}},
        select: defaultPostSelect,
      });
      return post;
    },
  })
  // read
  .query('all', {
    async resolve({ctx}) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.post.findMany({
        select: defaultPostSelect,
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input;
      const post = await ctx.prisma.post.findUnique({
        where: { id },
        select: defaultPostSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        title: z.string().min(1).max(32).optional(),
        text: z.string().min(1).optional(),
      }),
    }),
    async resolve({ input, ctx }) {
      const { id, data } = input;
      const post = await ctx.prisma.post.update({
        where: { id },
        data,
        select: defaultPostSelect,
      });
      return post;
    },
  })
  // delete
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { id } = input;
      await ctx.prisma.post.delete({ where: { id } });
      return {
        id,
      };
    },
  });