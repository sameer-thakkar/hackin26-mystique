import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TSkip = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Skip = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TSkip) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <circle cx="13.5" cy="2.5" r="1.5" stroke="#444444" />
      <path
        d="M5 5.5L8.5 2L11 4.5"
        stroke={token(strokeColor)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 6.5V8.5H15.5"
        stroke={token(strokeColor)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8.5L10.5 12L6.5 14.5"
        stroke={token(strokeColor)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 10.5L0.5 15.5"
        stroke={token(strokeColor)}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Skip;
