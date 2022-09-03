
import React, { useState, ReactNode } from 'react';
import {
  Heart,
  HeartStraight,
  ChatCenteredDots
} from "phosphor-react";
type LikeProps = { isClicked: boolean; likes: ReactNode; handleClick: any};
const LikeButton = ({isClicked, likes, handleClick} : LikeProps) => {
  

  return (
    <button className={ `like-button ${isClicked && 'liked'} ml-2 ` } onClick={ handleClick } >
      <span className="likes-counter">
      {isClicked ? <Heart size={29} color="#f71735" weight="fill" /> :<Heart size={29} weight="duotone" />}
      </span>
    </button>
  );
};

export default LikeButton;