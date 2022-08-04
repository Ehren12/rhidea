
import React, { useState, ReactNode } from 'react';
import {
  Heart,
  HeartStraight,
  ChatCenteredDots
} from "phosphor-react";
type LikeProps = { isClicked: boolean; likes: ReactNode; handleClick: Function;  };
const LikeButton = ({isClicked, likes, handleClick} : LikeProps) => {
  

  return (
    <button className={ `like-button ${isClicked && 'liked'} ml-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600` } onClick={ handleClick } >
      <span className="likes-counter">
      {isClicked ? <Heart size={29} color="#f71735" weight="fill" /> :<Heart size={29} color="#fff" weight="duotone" />}
      </span>
    </button>
  );
};

export default LikeButton;