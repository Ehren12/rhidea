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
import create from "zustand";
import { useStore } from "../../../lib/store";
import { CircleWavyCheck, DotsThreeVertical } from "phosphor-react";

type IdeaProps = { bgColor: any; id: string; title: string; creatorId: string };

export const Idea = ({ bgColor, id, title, creatorId }: IdeaProps) => {
  const like: any = trpc.useQuery([
    "like.like",
    { postId: id, userId: creatorId },
  ]);
  const postsQuery = trpc.useQuery(["post.all"]);
  const { data: session } = useSession();
  const user: any = session?.user;
  const profileByEmail = trpc.useQuery(["profile.findByEmail", {id: creatorId}])
  const profileData = profileByEmail.data;
  const profileQuery = trpc.useQuery(["profile.user_profile", { username: profileData?.username }]);
  const data = profileQuery.data;

  return (
    // <h2>
    //     Posts
    //     {postsQuery.status === 'loading' && '(loading)'}
    // </h2>
    <div className="h-fit">
      {user ? (
        <article
          className={`shadow h-fit w-full rounded`}
          style={{
            backgroundColor: bgColor ? `${bgColor}` : `#000`,
            color: bgColor === "#fbbf24" ? "#000" : "#fff",
          }}
        >
          <div className="p-5 flex flex-col h-full">
            <div className="flex flex-row">
              <div className="h-11 w-11 rounded">
                <Image
                  src={`${!data ? "/rhidea.svg": data?.image}`}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
              <p className="my-auto text-base opacity-70 text-semibold ml-3 mr-2">
                @{data?.username}
              </p>
              <CircleWavyCheck
                size={23}
                color="#306BAC"
                weight="duotone"
                className="my-auto"
              />
              <div className="ml-auto py-1.5 flex flex-row">
                <button
                  className="border border-[#fff] my-auto px-2 py-0.5 rounded mr-2"
                  style={{
                    borderColor: bgColor === "#fbbf24" ? "#000" : "#fff",
                    color: bgColor === "#fbbf24" ? "#000" : "#fff",
                  }}
                >
                  Follow +
                </button>
                <button>
                  <DotsThreeVertical
                    size={28}
                    weight="thin"
                    className="my-auto"
                    style={{
                      color: bgColor === "#fbbf24" ? "#000" : "#fff",
                    }}
                  />
                </button>
              </div>
            </div>
            <div className="h-full w-full pr-28 pl-14 pb-10 pt-8 m-auto">
              <Link href={`/idea/${id}`}>
                <h1 className="text-4xl font-bold w-5/6">
                  <a className="cursor-pointer hover:underline">{title}</a>
                </h1>
              </Link>
            </div>

            {/*<Link href={`/idea/${id}`}>
          <a>View more</a>
        </Link>*/}
            <PostInteractivity
              id={id}
              creatorId={creatorId}
              isLiked={like.data}
              bgColor={bgColor}
            />
          </div>
        </article>
      ) : (
        <h1>hi</h1>
      )}
    </div>
  );
};
