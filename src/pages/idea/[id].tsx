import NextError from "next/error";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import * as wtf8 from 'wtf-8'
import * as LZString from 'lz-string'
const PostViewPage: NextPageWithLayout = () => {
  const [likes, setLikes] = useState(100);
  const [isClicked, setIsClicked] = useState(false);
  const id = useRouter().query.id as string;
  const postQuery = trpc.useQuery(["post.byId", { id }]);

  const handleClick = () => {
    if (isClicked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsClicked(!isClicked);
  };

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== "success") {
    return <>Loading...</>;
  }
  
  const { data } = postQuery;
  var text = wtf8.decode( data.text)
  var textStr: any = LZString.decompress(text)
  return (
    <>
      <div className="prose container mx-auto px-8">
        <h1 className="text-3xl font-medium my-5">{data.title}</h1>
        
        <div className="my-5" dangerouslySetInnerHTML={{ __html: textStr }} />
        <em>Created {data.createdAt.toLocaleDateString("en-us")}</em>
        <button className={ `like-button ${isClicked && 'liked'}` } onClick={ handleClick }>
      <span className="likes-counter">{ `Like | ${likes}` }</span>
    </button>
      </div>
    </>
  );
};

export default PostViewPage;
