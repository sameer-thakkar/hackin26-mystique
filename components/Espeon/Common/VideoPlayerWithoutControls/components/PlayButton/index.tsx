/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { playButtonStyles } from './styles';
import type { TPlayButton } from './types';

const PlayButton = ({ onClick }: TPlayButton) => {
  return (
    <div className={playButtonStyles()} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 20 20"
      >
        <path
          fill="#444"
          fillRule="evenodd"
          d="M3.75 4.71a1.563 1.563 0 012.316-1.368l9.616 5.289c1.08.593 1.08 2.144 0 2.738l-9.615 5.29a1.563 1.563 0 01-2.316-1.37L3.75 4.711z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  );
};

export default PlayButton;
