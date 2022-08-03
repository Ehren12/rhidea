import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import { title } from "process";
import LikeButton from "../LikeButton";
import PostInteractivity from "./PostInteractivityContainer";
import create from 'zustand'
import { useStore } from "../../../lib/store";
import {
  CircleWavyCheck,
  DotsThreeVertical
} from "phosphor-react";


type IdeaProps = { id: ReactNode; title: ReactNode };

export const Idea = ({ id, title }: IdeaProps) => {

  const postsQuery = trpc.useQuery(["post.all"]);
  const { data: session } = useSession();
  const user: any = session?.user;
  return (

    // <h2>
    //     Posts
    //     {postsQuery.status === 'loading' && '(loading)'}
    // </h2>
    <div className="h-fit">
    {user ? (
    <article className="shadow h-fit w-full rounded bg-[#000] text-[#fff]">
      <div className="p-5 flex flex-col h-full">
        <div className="flex flex-row">
          <div className="h-11 w-11 rounded">
              <Image
                src={`${user.image}`}
                width={100}
                height={100}
                className="rounded-full"
              />

            </div>
            <p className="my-auto text-base opacity-70 text-semibold ml-3 mr-2">@ehrennwokocha</p>
            <CircleWavyCheck size={23} color="#306BAC" weight="duotone" className="my-auto"/>
            <div className="ml-auto py-1.5 flex flex-row">
            <button className="border border-[#fff] my-auto px-2 py-0.5 rounded mr-2">Follow +</button>
            <button><DotsThreeVertical size={28} color="#fff" weight="thin" className="my-auto"/></button>      
            </div>
        </div>
        <div className="h-full w-full pr-28 pl-14 pb-10 pt-8 m-auto">
          <h1 className="text-4xl font-bold w-5/6">{title}</h1>
        </div>
        
        {/*<Link href={`/idea/${id}`}>
          <a>View more</a>
        </Link>*/}
        <PostInteractivity />
      </div>
    </article>
    ) : (<h1>hi</h1>)}
    </div>
  );
};
