import { SVGProps } from 'react';

const Stop = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      clipPath="url(#a)"
      stroke="#444"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.003 8.27a4.248 4.248 0 1 0 5.99-6.025 4.248 4.248 0 0 0-5.99 6.025M8.03 15V9.5" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default Stop;
