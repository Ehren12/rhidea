import Head from "next/head";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Bell, ChatTeardropDots, MoonStars } from "phosphor-react";
export const Topbar = () => {
  const { data: session } = useSession();
  const user: any = session?.user;
  return (
    <>
      <div>
        <header className="text-gray-600 body-font h-14 border-b border-gray-400/5">
          <div className="container m-auto flex flex-wrap px-7  flex-col md:flex-row items-center">
            <nav className="md:ml-auto flex flex-wrap items-left justify-center mx-auto my-2 w-full">
              {user ? (
                <>
                <div className="flex items-left space-x-5 mr-auto w-5/12">
                  <form className="w-full">
                    <label className="sr-only">Search</label>
                    <input
                      type="text"
                      id="voice-search"
                      className="p-1.5 focus:outline outline-offset-2 focus:outline-1 outline-gray/100 border border-border-dark/10 border-1 rounded w-full"
                      required
                      placeholder={`🔍 Search`}
                    />
                  </form>
                </div>
                <div className="ml-auto w-2/12 my-auto flex space-x-4">
                    <Bell size={24} color="#333333" weight="thin" />
                    <ChatTeardropDots size={24} color="#333333" weight="thin" />
                    <MoonStars size={24} color="#333333" weight="thin" />
                </div>
                </>
              ) : (
                <button onClick={() => signIn()}>
                  <a className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                    Login
                  </a>
                </button>
              )}
            </nav>
          </div>
        </header>
        {/* {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}*/}
      </div>
    </>
  );
};
