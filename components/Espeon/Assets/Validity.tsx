import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TValidity = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Validity = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TValidity) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M2 3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V13.5858C18 13.851 17.8946 14.1054 17.7071 14.2929L16 16L14.2929 17.7071C14.1054 17.8946 13.851 18 13.5858 18H3C2.44772 18 2 17.5523 2 17V3Z"
        stroke={token(strokeColor)}
      />
      <path
        d="M18 14L14 18V14.5C14 14.2239 14.2239 14 14.5 14H18Z"
        fill={token(strokeColor)}
      />
      <path
        d="M3.5 5L16.5 5"
        stroke={token(strokeColor)}
        strokeLinecap="round"
      />
      <path
        d="M13.125 8.75L8.74999 12.9688L6.875 11.0938"
        stroke={token(strokeColor)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Validity;
