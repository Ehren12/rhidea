import Head from "next/head";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { SidebarLeft } from "./SidebarLeft";
import { Topbar } from "./Topbar";
import Script from "next/script";
import { SidebarRight } from "./SidebarRight";
import { useState } from "react";
import { Bell, ChatTeardropDots, MoonStars, Plus } from "phosphor-react";
type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { data: session } = useSession();
  const [visibile, setVisibility] = useState(true);
  const reveal = () => setVisibility(!visibile);
  const user: any = session?.user;
  return (
    <>
      <Head>
        <title>Rhidea</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
<link href="https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Manrope&family=Montserrat&family=Noto+Sans&family=Open+Sans&family=Poppins&display=swap" rel="stylesheet"/>
      </Head>
      <div>
        <main className="flex font-['Open_Sans']">
          <SidebarLeft />
          <div className="w-full pt-0">
            <Topbar />
            <div className="h-20 w-full border-b border-gray-400/5 z-40 px-7">
              <div className="h-full w-fit my-auto py-3">
                <h1 className="text-2xl font-bold opacity-70 my-auto">
                  Your Feed
                </h1>
                <p className="opacity-50 font-semibold text-sm">
                  {/*Ideas from those you follow*/}
                  *This is a development or test version of the website so many features do not work!
                </p>
              </div>
            </div>
            <div className="p-7 overflow-visible">
              {children}
{/*              <div
                className={`w-48 h-40 border border-border-dark/20 drop-shadow-xl bg-white fixed z-90 bottom-20 right-72 ${
                  visibile ? "hidden" : "visible"
                } duration-300`}

              >
                <Link href="/add/new-idea">
                  <a>New Idea</a>
                </Link>
              </div>

              <button
                className="fixed z-90 bottom-5 right-72   w-12 h-12 rounded-full drop-shadow-lg shadow-current flex justify-center items-center text-white text-4xl hover:bg-dark-blue/90 hover:w-14 hover:h-14 hover:drop-shadow-2xl active:bg-dark-blue/90 active:w-14 active:h-14 active:drop-shadow-2xl duration-300"
                onClick={reveal}
              >
                <Plus size={32} color="#333333" weight="thin" />
              </button>*/}
              <div className="fixed z-90 bottom-5 right-72 bg-indigo-500  w-12 h-12 rounded-full drop-shadow-lg shadow-current flex justify-center items-center text-white text-4xl hover:bg-dark-blue/90 hover:w-14 hover:h-14 hover:drop-shadow-2xl active:bg-dark-blue/90 active:w-14 active:h-14 active:drop-shadow-2xl duration-300">
              <Link href="/add/new-idea">
                  <a><Plus size={32} color="#333333" weight="thin" /></a>
              </Link>
              </div>
            </div>
          </div>
          <SidebarRight />
        </main>

        {/* {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}*/}
      </div>
    </>
  );
};
