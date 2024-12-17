import { SVGProps } from 'react';

const InfoIconDefault = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)" stroke="#666">
      <path
        d="M12.833 7A5.833 5.833 0 1 0 1.167 7a5.833 5.833 0 0 0 11.666 0Z"
        strokeWidth={0.875}
      />
      <path
        d="M7.141 9.917V7c0-.275 0-.413-.085-.498s-.223-.085-.498-.085"
        strokeWidth={0.875}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.995 4.667h.006"
        strokeWidth={1.313}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default InfoIconDefault;
