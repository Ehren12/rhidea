import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";
import Link from "next/link";
import * as wtf8 from 'wtf-8'
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
import * as LZString from 'lz-string'
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
  const [bgColor, setBgColor]: any = useState("");

  const handleChange = (value: any | string) => {
    setText(value);
    console.log(value)
  };

  const handleColor = (value: string | any) =>{
    setBgColor(value.target.value)
    console.log(value.target.value)
  }

  var textContent: any = editorRef.current ? editorRef.current.getContent() : ""
  // const [editorState, setEditorState] = useState(
  //   () => EditorState.createEmpty(),
  // );
  var compressed = LZString.compress(textContent);
  textContent = LZString.decompress(compressed);
  const bytes = Buffer.byteLength(compressed, "utf8");

  return (
    <>
      <div className="sticky flex flex-col">
        <div className=" container mx-auto w-5/6 py-12">
          <form
            className=""
            onSubmit={async (e) => {
              e.preventDefault();
              /**
               * In a real app you probably don't want to use this manually
               * Checkout React Hook Form - it works great with tRPC
               * @link https://react-hook-form.com/
               */

              const $bgColor: HTMLInputElement = (e as any).target.elements.bgColor;
              const $title: HTMLInputElement = (e as any).target.elements.title;
              const input = {
                title: $title.value,
                text: wtf8.encode(compressed),
                backgroundColor: bgColor
              };
              try {
                await addPost.mutateAsync(input);
                $title.value = "";
              } catch {}
            }}
          > 
            <div className="mb-5 py-2">
            <label htmlFor="title" className="block w-4/6 text-lg mb-4">
              <span className="text-gray-700">Background Color</span>  
            </label>
              <div  className="flex flex-row space-x-4">
                <input type={'button'} name="bgColor" className="cursor-pointer rounded-full w-8 h-8 bg-black hover:shadow-md hover:shadow-black/30  text-transparent" value={'#000'} onClick={handleColor}/>
                <input type={'button'} name="bgColor" className="cursor-pointer rounded-full bg-amber-400 w-8 h-8  hover:shadow-md hover:shadow-amber-400/70  text-transparent " value={'#fbbf24'} onClick={handleColor}/>
                <input type={'button'} name="bgColor" className="cursor-pointer rounded-full bg-cyan-700 w-8 h-8  hover:shadow-md hover:shadow-cyan-700/70  text-transparent" value={'#0e7490'} onClick={handleColor}/>
                <input type={'button'} name="bgColor" className="cursor-pointer rounded-full bg-fuchsia-300 w-8 h-8 hover:shadow-md hover:shadow-fuchsia-300/70  text-transparent" value={'#f0abfc'} onClick={handleColor}/>
              </div>
            </div>
            <label htmlFor="title" className="block w-4/6 text-lg mb-3">
              <span className="text-gray-700">Title</span>  
            </label>
            <input
                id="title"
                name="title"
                type="text"
                disabled={addPost.isLoading}
                className="mt-1 mb-5 block w-full h-10 w-4/6 bg-gray-light/20 border border-gray-light focus:outline-none pl-2.5 text-lg font-medium rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />

            <label className="block w-4/6 text-lg mb-3">
              <span className="text-gray-700">Description</span>
            </label>
              {/*<textarea
              id="text"
              name="text"
              disabled={addPost.isLoading}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />*/}
              {/*<ReactQuill  id="text" value={text} onChange={handleChange}/>*/}

              <Editor
                id="text"
                onChange={handleChange}
                disabled={addPost.isLoading}
                apiKey="s9ogc5oa6vle2t2kpoe3ztk5lez6cccpez8ucakqn0nginjt"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue="<p>Describe what your idea is about</p>"
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
              
            
              <button
                type="submit"
                disabled={addPost.isLoading}
                className="my-4 capitalize bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 z-20"
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
