import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TTransfer = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Transfer = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TTransfer) => {
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
        d="M9.25548 10.4813H4.74414"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeMiterlimit="10"
      />
      <path
        d="M2.01703 10.4808H1.75C1.26675 10.4808 0.875 10.089 0.875 9.60576V4.35576C0.875 3.74048 1.37335 3.24213 1.98864 3.24213H11.3666C11.9819 3.24213 12.4803 3.74048 12.4803 4.35576L13.0233 9.51416C13.0776 10.0308 12.6725 10.4808 12.1531 10.4808H11.983"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeMiterlimit="10"
      />
      <path
        d="M3.38082 12.151C4.14962 12.151 4.77286 11.5277 4.77286 10.7589C4.77286 9.99012 4.14962 9.36688 3.38082 9.36688C2.61201 9.36688 1.98877 9.99012 1.98877 10.7589C1.98877 11.5277 2.61201 12.151 3.38082 12.151Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M10.6186 12.1512C11.3874 12.1512 12.0107 11.528 12.0107 10.7592C12.0107 9.99037 11.3874 9.36713 10.6186 9.36713C9.8498 9.36713 9.22656 9.99037 9.22656 10.7592C9.22656 11.528 9.8498 12.1512 10.6186 12.1512Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M0.875 7.14008H13.125"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeMiterlimit="10"
      />
      <path
        d="M8.61182 3.125L9.13944 7.13984"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default Transfer;
