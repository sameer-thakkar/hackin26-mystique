import React from 'react';

interface PlayVideoIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const PlayVideoIcon: React.FC<PlayVideoIconProps> = ({
  width = 52,
  height = 52,
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.9958 2.7168C13.1321 2.7168 2.7041 13.1448 2.7041 26.0085C2.7041 38.8722 13.1321 49.3001 25.9958 49.3001C38.8595 49.3001 49.2874 38.8722 49.2874 26.0085C49.2874 13.1448 38.8595 2.7168 25.9958 2.7168ZM28.9682 31.8279C33.1046 29.6346 35.1727 28.538 35.6104 26.9861C35.7908 26.3454 35.7908 25.6715 35.6104 25.0309C35.1727 23.4789 33.1046 22.3823 28.9682 20.189C24.9694 18.0687 22.97 17.0086 21.3589 17.4347C20.6928 17.6109 20.0858 17.9455 19.5963 18.4064C18.4124 19.5213 18.4124 21.6836 18.4124 26.0085C18.4124 30.3333 18.4124 32.4957 19.5963 33.6104C20.0858 34.0715 20.6928 34.406 21.3589 34.5822C22.97 35.0084 24.9694 33.9482 28.9682 31.8279Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default PlayVideoIcon;
