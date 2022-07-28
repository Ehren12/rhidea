
import React, { useState, ReactNode } from 'react';

type LikeProps = { isClicked: ReactNode; likes: ReactNode; handleClick: any; disable: any; };
const LikeButton = ({isClicked, likes, handleClick, disable} : LikeProps) => {
  

  return (
    <button className={ `like-button ${isClicked && 'liked'} mx-2 bg-blue-500 text-white font-medium py-1 px-2 rounded-md hover:bg-blue-600` } onClick={ handleClick } disabled={disable}>
      <span className="likes-counter">{ `Like | ${likes}` }</span>
    </button>
  );
};

export default LikeButton;