import { cloneElement, SVGProps } from 'react';

const InfoIconWrapped = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_849_18252)">
      <path
        d="M6 1C3.23858 0.999999 1 3.23858 0.999999 6C0.999999 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z"
        stroke="#666666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8L6 6"
        stroke="#666666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 4L5.995 4"
        stroke="#666666"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_849_18252">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const InfoIconWrapperComponent = (props: SVGProps<SVGSVGElement>) =>
  cloneElement(InfoIconWrapped, props);
export default InfoIconWrapped;
