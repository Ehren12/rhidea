import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import { title } from "process";
import LikeButton from "../LikeButton";
import PostInteractivity from "./PostInteractivityContainer";
import create from 'zustand'
import { useStore } from "../../../lib/store";


type IdeaProps = { id: ReactNode; title: ReactNode };

export const Idea = ({ id, title }: IdeaProps) => {

  const postsQuery = trpc.useQuery(["post.all"]);
  
  return (

    // <h2>
    //     Posts
    //     {postsQuery.status === 'loading' && '(loading)'}
    // </h2>
    <div className="h-80">
    <article className="shadow h-full  w-full  rounded">
      <div className="p-5 flex flex-col space-y-2">
        <p className="text-lg font-medium">{title}</p>
        <Link href={`/idea/${id}`}>
          <a>View more</a>
        </Link>
        <PostInteractivity />
      </div>
    </article>
    </div>
  );
};
