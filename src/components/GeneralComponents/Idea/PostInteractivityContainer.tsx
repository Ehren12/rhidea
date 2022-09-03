import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import {
  Heart,
  HeartStraight,
  ChatCenteredDots,
  Sparkle,
  Share,
} from "phosphor-react";
import LikeButton from "../LikeButton";
import UnLikeButton from "../UnlikeButton";
import { useCookies } from "react-cookie";
import { InfiniteQueryObserver } from "react-query";

const PostInteractivity = ({ id, creatorId, isLiked, bgColor }: any) => {
  // const likesCount: any = trpc.useQuery(["like.allLikesCount", { postId, userId }]);
  // const allLikes: any = trpc.useQuery(["like.allLikes"]);
  // const { data } = likesCount;
  // const utils = trpc.useContext();
  // let count: any;
  // let postId: any;
  // let userId: any;

  // if (!data) {
  //   count = 0;
  //   postId = "";
  //   userId = "";
  // } else {
  //   count = eval(data[0]?._count);
  //   postId = data[0].id;
  //   userId = data[0].creatorId;
  // }

  // const addLike = trpc.useMutation("like.add", {
  //   async onSuccess() {
  //     // refetches posts after a post is added
  //     await utils.invalidateQueries(["like.allLikes"]);
  //   },
  // });

  // const removeLike = trpc.useMutation("like.deleteLike", {
  //   async onSuccess() {
  //     await utils.invalidateQueries(["like.allLikes"]);
  //   },
  // });

  // // get like state endpoint
  // const liked_state = trpc.useQuery(["like.liked", { postId, userId }]);
  // // like state states
  // const [likes, setLikes] = useState(count.likes);
  // const [likeIsActive, setLikeIsActive] = useState(liked_state.data);

  // //dislike states
  // // const [dislikes, setDisLikes] = useState(0);
  // // const [dislikeIsActive, setDislikeIsActive] = useState(false);

  // //like click functionality
  // const handleLikeClick = async (e: any) => {
  //   // if (!likeIsActive) {
  //   //   if (dislikeIsActive) {
  //   //     setDislikeIsActive(!dislikeIsActive);
  //   //     if (dislikes === 0) {
  //   //       return;
  //   //     } else {
  //   //       setDisLikes(dislikes - 1);
  //   //     }
  //   //   }
  //   // }
  //   if (likeIsActive === true) {

  //       setLikes(likes - 1);
  //       e.preventDefault();
  //       const input = {
  //         postId: postId,
  //         userId: userId,
  //       };
  //       try {
  //         await removeLike.mutateAsync(input);
  //       } catch {}

  //   } else {
  //     if (likeIsActive === false) {
  //       setLikes(likes + 1);
  //       e.preventDefault();
  //       const input = {
  //         postId: postId,
  //       };
  //       try {
  //         await addLike.mutateAsync(input);
  //       } catch {}
  //     }

  //   }
  //   setLikeIsActive(!likeIsActive);
  // };
  //dislike functionality
  // const handleDisLikeClick = () => {
  //   if (!dislikeIsActive) {
  //     if (likeIsActive) {
  //       setLikeIsActive(!likeIsActive);
  //       if (likes === 0) {
  //         return;
  //       } else {
  //         setLikes(likes - 1);
  //       }
  //     }
  //   }
  //   if (dislikeIsActive) {
  //     setDisLikes(dislikes - 1);
  //   } else {
  //     setDisLikes(dislikes + 1);
  //   }
  //   setDislikeIsActive(!dislikeIsActive);
  // };
  function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie += cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  function getCookie(cname: any) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c: any = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  const utils = trpc.useContext();
  const addLike = trpc.useMutation("like.add", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["like.allLikes"]);
    },
  });
  const userId = useSession().data?.user?.email;
  const entry = {
    user: userId,
    post: id,
  };
  var info: any = localStorage.getItem("allEntries");
  var allEntries = JSON.parse(info) || [];
  allEntries.push(entry);

  var unlikeinfo: any = localStorage.getItem("unlikeEntries");
  var unlikeEntries = JSON.parse(unlikeinfo) || [];
  unlikeEntries.push(entry);

  var names = new Array();
  // const [cookies, setCookie, removeCookie] = useCookies(["like"]);
  const removeLike = trpc.useMutation("like.deleteLike");
  const [hasLiked, setHasLiked] = useState(isLiked);
  const addLikeFunc = async (e: Event) => {
    e.preventDefault();
    if (!hasLiked) {
      localStorage.setItem("latest_entry", JSON.stringify(entry));

      localStorage.setItem("allEntries", JSON.stringify(allEntries));
      setTimeout(function () {
        allEntries?.map(async (item: any) => {
          var filtered = allEntries?.filter((el: any) => {
            return el?.post !== item?.post;
          });
          const input = {
            postId: item?.post,
          };
          try {
            await addLike.mutateAsync(input);
            localStorage.setItem("allEntries", JSON.stringify(filtered));
          } catch {}
        });
      }, 15000);
    }

    if (hasLiked) {
      localStorage.setItem("latest_unlike_entry", JSON.stringify(entry));
      localStorage.setItem("unlikeEntries", JSON.stringify(unlikeEntries));
      setTimeout(function () {
        unlikeEntries.map(async (item: any) => {
          var filtered = unlikeEntries.filter((el: any) => {
            return el.post != item.post;
          });
          console.log(item.post);
          const input = {
            postId: item.post,
            userId: creatorId,
          };
          try {
            await removeLike.mutateAsync(input);
            localStorage.setItem("unlikeEntries", JSON.stringify(filtered));
          } catch {}
        });
      }, 15000);
    }

    setHasLiked(!hasLiked);
  };
  return (
    <div className="py-2 flex flex-row"                   style={{
                    color: bgColor === "#fbbf24" ? "#000" : "#fff",
                  }}>
      <div className="flex flex-row space-x-4 w-fit">
        <LikeButton isClicked={hasLiked} likes={2} handleClick={addLikeFunc} />
        <ChatCenteredDots
          size={28}
          weight="light"
          className="my-auto mr-2"
        />
        <Share size={28} weight="light" className="my-auto ml-1" />
        {/*<UnLikeButton*/}
        {/*  isClicked={dislikeIsActive}*/}
        {/*  dislikes={dislikes}*/}
        {/*  handleClick={handleDisLikeClick}*/}
        {/*/>*/}
      </div>
      <div className="ml-auto px-2">
        <Sparkle size={28} weight="light" className="my-auto" />
      </div>
    </div>
  );
};

export default PostInteractivity;
