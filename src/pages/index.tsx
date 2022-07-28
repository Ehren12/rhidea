import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";
import Link from "next/link";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect } from "react";
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

  return (
    <div className="flex flex-col">
      <div className="sticky h-72 w-full border-b border-border-dark/5"></div>
      <div className="container mx-auto max-w-5xl my-20 px-5">
        <div className="grid mx-auto px-24 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
          {postsQuery.data?.map((item) => (
            <Idea key={item.id} id={item.id} title={item.title} />
          ))}
        </div>
      </div>
      <button
        title="Contact Sale"
        className="fixed z-90 bottom-5 right-72 border border-border-dark/80 bg-dark-blue/80 w-12 h-12 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-blue-700 hover:drop-shadow-2xl hover:animate-bounce  duration-300"
      >
        <Plus size={32} color="#333333" weight="thin" />
      </button>
      <hr />
      <div className="container mx-auto max-w-md py-12">
        <form
          className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg"
          onSubmit={async (e) => {
            e.preventDefault();
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             */

            const $text: HTMLInputElement = (e as any).target.elements.text;
            const $title: HTMLInputElement = (e as any).target.elements.title;
            const input = {
              title: $title.value,
              text: $text.value,
            };
            try {
              await addPost.mutateAsync(input);

              $title.value = "";
              $text.value = "";
            } catch {}
          }}
        >
          <label htmlFor="title" className="block">
            <span className="text-gray-700">Title</span>
            <input
              id="title"
              name="title"
              type="text"
              disabled={addPost.isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Description</span>
            <textarea
              id="text"
              name="text"
              disabled={addPost.isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
          <button
            type="submit"
            disabled={addPost.isLoading}
            className="my-4 capitalize bg-gray text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {addPost.isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-6 h-6 animate-spin mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                Creating...
              </span>
            ) : (
              <span>Create Idea</span>
            )}
          </button>
          {addPost.error && (
            <p style={{ color: "red" }}>{addPost.error.message}</p>
          )}
        </form>
      </div>
    </div>
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
