import type { SVGProps } from 'react';
import React from 'react';
import type { ColorToken } from '@headout/pixie/tokens';
import { token } from '@headout/pixie/tokens';

const CheckFilled = ({
  fill = 'core.primary.white',
  ...props
}: SVGProps<SVGSVGElement> & {
  fill?: ColorToken;
}) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
    >
      <rect width="14" height="14" rx="7" fill={token(`colors.${fill}`)} />
      <path
        d="M10.75 4.0835L5.59375 9.50016L3.25 7.03804"
        stroke="#111111"
        strokeWidth="0.666667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckFilled;
