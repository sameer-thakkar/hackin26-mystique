import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TPlus = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Plus = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TPlus) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      {...props}
    >
      <path
        d="M7.00033 3.41663L7.00033 11.5833M2.91699 7.49996L11.0837 7.49996"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Plus;
