import type { SVGProps } from 'react';
import React from 'react';
import { type ColorToken, token } from '@headout/pixie/tokens';

const LeftArrow = ({
  strokeColor = 'core.grey.800',
  strokeWidth = '1.2',
  ...props
}: SVGProps<SVGSVGElement> & {
  strokeColor?: ColorToken;
}) => {
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
        stroke={token(`colors.${strokeColor}`)}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M8.5 11l-5-5 5-5"
      ></path>
    </svg>
  );
};

export default LeftArrow;
