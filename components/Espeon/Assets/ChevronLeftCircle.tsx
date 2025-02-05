import React from 'react';
import type { Token } from '@headout/pixie/tokens';
import { token } from '@headout/pixie/tokens';

const ChevronLeftCircle = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: {
  strokeColor?: Token;
} & React.SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle r="16" transform="matrix(-1 0 0 1 20 18)" fill="white" />
    <g clipPath="url(#chev_clip0)">
      <path
        d="M23.3333 24.6666L16.6667 17.9999L23.3333 11.3333"
        stroke={token(strokeColor)}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="chev_clip0">
        <rect
          width="16"
          height="16"
          transform="matrix(-1 0 0 1 28 10)"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);
export default ChevronLeftCircle;
