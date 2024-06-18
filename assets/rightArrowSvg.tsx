import React from 'react';

export const RightArrowSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      {...props}
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        d="M3.5 1l5 5-5 5"
      ></path>
    </svg>
  );
};
