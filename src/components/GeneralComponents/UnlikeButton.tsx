import React, { useState, ReactNode } from 'react';

type DisLikeProps = { isClicked: ReactNode; dislikes: ReactNode; handleClick: any };
const UnLikeButton = ({isClicked, dislikes, handleClick} : DisLikeProps) => {


  return (
    <button className={ `like-button ${isClicked && 'liked'} bg-gray-100 border-0 py-1 px-2 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0` } onClick={ handleClick }>
      <span className="likes-counter">{ `dislike | ${dislikes}` }</span>
    </button>
  );
};

export default UnLikeButton;


