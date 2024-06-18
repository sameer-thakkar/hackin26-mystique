import { SVGProps } from 'react';

const Direction = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        d="m10.853 5.647-4.5-4.5a.5.5 0 0 0-.705 0l-4.5 4.5a.5.5 0 0 0 0 .708l4.5 4.497v.003a.5.5 0 0 0 .708 0l4.5-4.5a.5.5 0 0 0-.003-.708M7.001 7.25V6H5v1.5H4v-2c0-.278.222-.5.5-.5H7V3.75L8.75 5.5z"
        fill="#E5006E"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
);

export default Direction;
