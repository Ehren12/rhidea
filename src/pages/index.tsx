import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";
import Link from "next/link";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState, useRef } from "react";
import autoAnimate from '@formkit/auto-animate'
import { Idea } from "../components/GeneralComponents/Idea/IdeaContainer";
import { Bell, ChatTeardropDots, MoonStars, Plus } from "phosphor-react";


const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const postsQuery = trpc.useQuery(["post.all"]);
  const addPost = trpc.useMutation("post.add", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["post.all"]);
    },
  });

  useEffect(() => {
    for (const { id } of postsQuery.data ?? []) {
      utils.prefetchQuery(["post.byId", { id }]);
    }
  }, [postsQuery.data, utils]);

  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  

  return (
    <>
    
    <div className="sticky flex flex-col">
      
      <div className="container mx-auto max-w-5xl my-20 px-5">
        <div className="grid mx-auto px-24 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
          {postsQuery.data?.map((item) => (
            <Idea key={item.id} id={item.id} title={item.title} creatorId={item.creatorId}/>
          ))}
        </div>
      </div>
      
      
    </div>
    </>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createSSGHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.fetchQuery('post.all');
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
