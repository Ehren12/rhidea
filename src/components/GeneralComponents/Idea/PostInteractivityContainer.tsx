import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";

import LikeButton from "../LikeButton";
import UnLikeButton from "../UnlikeButton";

const PostInteractivity = () => {
  const utils = trpc.useContext();
  const likesCount: any = trpc.useQuery(["like.allLikesCount"]);
  const allLikes: any = trpc.useQuery(["like.allLikes"]);
  const { data } = likesCount;
  let count: any;
  let postId: any;
  let userId: any;

  if (!data) {
    count = 0;
    postId = "";
    userId = "";
  } else {
    count = eval(data[0]?._count);
    postId = data[0].id;
    userId = data[0].creatorId;
  }

  const addLike = trpc.useMutation("like.add", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["like.allLikes"]);
    },
  });

  const removeLike = trpc.useMutation("like.deleteLike", {
    async onSuccess() {
      await utils.invalidateQueries(["like.allLikes"]);
    },
  });

  // get like state endpoint
  const liked_state = trpc.useQuery(["like.liked", { postId, userId }]);
  // like state states
  const [likes, setLikes] = useState(count.likes);
  const [likeIsActive, setLikeIsActive] = useState(liked_state.data);

  //dislike states
  // const [dislikes, setDisLikes] = useState(0);
  // const [dislikeIsActive, setDislikeIsActive] = useState(false);

  //like click functionality
  const handleLikeClick = async (e: any) => {
    // if (!likeIsActive) {
    //   if (dislikeIsActive) {
    //     setDislikeIsActive(!dislikeIsActive);
    //     if (dislikes === 0) {
    //       return;
    //     } else {
    //       setDisLikes(dislikes - 1);
    //     }
    //   }
    // }
    if (likeIsActive) {
      
        setLikes(likes - 1);
        e.preventDefault();
        const input = {
          postId: postId,
          userId: userId,
        };
        try {
          await removeLike.mutateAsync(input);
        } catch {}
      
    } else {
      if (!likeIsActive) {
        setLikes(likes + 1);
        e.preventDefault();
        const input = {
          postId: postId,
        };
        try {
          await addLike.mutateAsync(input);
        } catch {}
      }
      
    }
    setLikeIsActive(!likeIsActive);
  };
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
  return (
    <div>
      <LikeButton
        isClicked={likeIsActive}
        likes={likes}
        handleClick={handleLikeClick}
        disable={addLike.isLoading || removeLike.isLoading}
      />
      {/*<UnLikeButton*/}
      {/*  isClicked={dislikeIsActive}*/}
      {/*  dislikes={dislikes}*/}
      {/*  handleClick={handleDisLikeClick}*/}
      {/*/>*/}
    </div>
  );
};

export default PostInteractivity;
