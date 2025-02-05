import React from 'react';
import { type ColorToken, token } from '@headout/pixie/tokens';

const ChevronUp = ({
  strokeColor = 'core.grey.800',
  ...props
}: React.SVGProps<SVGSVGElement> & { strokeColor?: ColorToken }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Chevron">
        <path
          id="Vector"
          d="M14.6666 11.334L7.99998 4.66732L1.33331 11.334"
          stroke={token(`colors.${strokeColor}`)}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default ChevronUp;
