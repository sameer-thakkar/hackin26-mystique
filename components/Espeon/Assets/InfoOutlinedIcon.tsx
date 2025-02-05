import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TInfoOutlinedIcon = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'strokeColor'>;

const InfoOutlinedIcon = ({
  strokeColor = 'colors.semantic.icon.white',
  ...props
}: TInfoOutlinedIcon) => (
  <svg
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 1.5C3.23858 1.5 1 3.73858 1 6.5C1 9.26142 3.23858 11.5 6 11.5C8.76142 11.5 11 9.26142 11 6.5C11 3.73858 8.76142 1.5 6 1.5Z"
      stroke={token(strokeColor)}
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 8.5L6 6.5"
      stroke={token(strokeColor)}
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 4.5L5.995 4.5"
      stroke={token(strokeColor)}
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InfoOutlinedIcon;
