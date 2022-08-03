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

  const [visibile, setVisibility] = useState(true)
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const reveal = () => setVisibility(!visibile)

  return (
    <>
    
    <div className="sticky flex flex-col">
      
      <div className="container mx-auto max-w-5xl my-20 px-5">
        <div className="grid mx-auto px-24 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
          {postsQuery.data?.map((item) => (
            <Idea key={item.id} id={item.id} title={item.title} />
          ))}
        </div>
      </div>
      <div className={`w-48 h-40 border border-border-dark/20 drop-shadow-xl bg-white fixed z-90 bottom-20 right-72 ${visibile ? "hidden" : "visible"} duration-300`}>
        <Link href="/add/new-idea">
          <a>New Idea</a>
        </Link>
      </div>

      <button
        className="fixed z-90 bottom-5 right-72   w-12 h-12 rounded-full drop-shadow-lg shadow-current flex justify-center items-center text-white text-4xl hover:bg-dark-blue/90 hover:w-14 hover:h-14 hover:drop-shadow-2xl active:bg-dark-blue/90 active:w-14 active:h-14 active:drop-shadow-2xl duration-300"
        onClick={reveal}>
        <Plus size={32} color="#333333" weight="thin" />
      </button>
      
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
