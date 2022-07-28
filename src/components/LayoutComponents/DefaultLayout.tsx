import Head from "next/head";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { SidebarLeft } from "./SidebarLeft";
import { Topbar } from "./Topbar";
import Script from 'next/script'
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
        <Script
        id="flowbite-js"
        src="../path/to/flowbite/dist/flowbite.js"
      />
      </Head>
      <div>
        <main className="flex">
          <SidebarLeft />
          <div className="w-full pt-0">
            <Topbar />
            <div className="p-7">{children}</div>
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
