import React from 'react';
import type { ColorToken } from '@headout/pixie/tokens';
import { token } from '@headout/pixie/tokens';

type TCancel = {
  strokeColor?: ColorToken;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const ChevronRight = ({
  strokeColor = 'semantic.icon.grey.2',
  strokeWidth = '1.5',
  ...props
}: TCancel) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <path
        d="M3.5 10.9999L8.5 5.99988L3.5 0.999878"
        stroke={token(`colors.${strokeColor}`)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronRight;
