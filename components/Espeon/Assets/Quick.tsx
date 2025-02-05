import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TQuick = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Quick = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TQuick) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <circle cx="10" cy="10" r="8.25" stroke={token(strokeColor)} />
      <path
        d="M14.0972 7.5L8.75 13.125L6.25 10.625"
        stroke={token(strokeColor)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default Quick;
