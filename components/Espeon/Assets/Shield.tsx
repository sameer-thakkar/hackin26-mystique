import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TCancel = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Cancel = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TCancel) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      {...props}
    >
      <path
        d="M6.99967 12.8333C6.99967 12.8333 11.6663 10.5 11.6663 6.99996V2.91663L6.99967 1.16663L2.33301 2.91663V6.99996C2.33301 10.5 6.99967 12.8333 6.99967 12.8333Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Cancel;
