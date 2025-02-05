import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type THotel = {
  strokeColor?: Token;
  fillColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Hotel = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  fillColor = 'colors.semantic.icon.grey.2',
  ...props
}: THotel) => {
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
        d="M1.3125 12.75H12.6875"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
      <path
        d="M7.4375 10.4314L11.8125 8.44698M7.4375 6.85944L11.1943 5.15542C11.4839 5.02404 11.8125 5.23581 11.8125 5.55385V12.75H7.4375V6.85944Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
      />
      <path
        d="M2.1875 2.6875C2.1875 2.44588 2.38338 2.25 2.625 2.25H7C7.24162 2.25 7.4375 2.44588 7.4375 2.6875V12.75H2.1875V2.6875Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
      />
      <path
        d="M4.375 8.8125C4.375 8.57088 4.57088 8.375 4.8125 8.375V8.375C5.05412 8.375 5.25 8.57088 5.25 8.8125V9.6875C5.25 9.92912 5.05412 10.125 4.8125 10.125V10.125C4.57088 10.125 4.375 9.92912 4.375 9.6875V8.8125Z"
        fill={token(fillColor)}
      />
      <path
        d="M4.375 5.75C4.375 5.50838 4.57088 5.3125 4.8125 5.3125V5.3125C5.05412 5.3125 5.25 5.50838 5.25 5.75V6.625C5.25 6.86662 5.05412 7.0625 4.8125 7.0625V7.0625C4.57088 7.0625 4.375 6.86662 4.375 6.625V5.75Z"
        fill={token(fillColor)}
      />
      <path
        d="M3.9375 11.175C3.9375 11.0784 4.01585 11 4.1125 11H5.5125C5.60915 11 5.6875 11.0784 5.6875 11.175V12.575C5.6875 12.6716 5.60915 12.75 5.5125 12.75H4.1125C4.01585 12.75 3.9375 12.6716 3.9375 12.575V11.175Z"
        fill={token(fillColor)}
      />
      <path
        d="M9.1875 5.75V3.125"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
    </svg>
  );
};
export default Hotel;
