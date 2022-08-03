import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";
import Link from "next/link";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import autoAnimate from "@formkit/auto-animate";
import dynamic from "next/dynamic";
// import {Editor, EditorState} from 'draft-js';
// import 'draft-js/dist/Draft.css';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Idea } from "../../components/GeneralComponents/Idea/IdeaContainer";
import { Editor } from "@tinymce/tinymce-react";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const NewIdeaPage: NextPageWithLayout = () => {
  const editorRef : any = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

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

  const [visibile, setVisibility] = useState(true);
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => setVisibility(!visibile);
  const [text, setText] = useState("");

  const handleChange = (value: any | string) => {
    setText(value);
  };

  // const [editorState, setEditorState] = useState(
  //   () => EditorState.createEmpty(),
  // );

  return (
    <>
      <div className="sticky flex flex-col">
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
                text: text,
              };
              try {
                await addPost.mutateAsync(input);

                $title.value = "";
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
              {/*<textarea
              id="text"
              name="text"
              disabled={addPost.isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />*/}
              {/*<ReactQuill  id="text" value={text} onChange={handleChange}/>*/}
              <Editor
                apiKey="s9ogc5oa6vle2t2kpoe3ztk5lez6cccpez8ucakqn0nginjt"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
              <button onClick={log}>Log editor content</button>
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
    </>
  );
};

export default NewIdeaPage;

// // import { EditorState } from "draft-js";
// import { ContentState, convertToRaw, EditorState } from 'draft-js';
// import dynamic from "next/dynamic";
// import { EditorProps } from "react-draft-wysiwyg";
// import { convertToHTML, convertFromHTML } from 'draft-convert';
// import DOMPurify from 'isomorphic-dompurify';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// // install @types/draft-js @types/react-draft-wysiwyg and @types/draft-js @types/react-draft-wysiwyg for types

// const Editor = dynamic<EditorProps>(
//   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//   { ssr: false }
// );

// export default function myFunctionalComponent() {

//   return (
//     <div className="App">
//       <header className="App-header bg-[#282c34] min-h-72 flex flex-col items-center justify-center text-[#fff]">
//         Rich Text Editor Example
//       </header>
//       <Editor
//         editorState={editorState}
//         onEditorStateChange={handleEditorChange}
//         wrapperClassName="wrapper-class"
//         editorClassName="editor-class"
//         toolbarClassName="toolbar-class"
//       />
//       <div className="preview" dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
//     </div>
//   );
// }

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
