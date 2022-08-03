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

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { data: session } = useSession();
  const user: any = session?.user;
  return (
    <>
      <Head>
        <title>Rhidea</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <Script id="flowbite-js" src="../path/to/flowbite/dist/flowbite.js" />
      </Head>
      <div>
        <main className="flex">
          <SidebarLeft />
          <div className="w-full pt-0">
            <Topbar />
            <div className="h-20 w-full border-b border-border-dark/5 z-40 px-7">
              <div className="h-full w-fit my-auto py-3">
                <h1 className="text-2xl font-bold opacity-70 my-auto">Your Feed</h1>
                <p className="opacity-50 font-semibold text-sm">Ideas from those you follow</p>
              </div>
            </div>
            <div className="p-7 overflow-visible">{children}</div>
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
