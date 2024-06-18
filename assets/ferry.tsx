import { SVGProps } from 'react';

const Ferry = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.537 9.679A.5.5 0 0 1 2.004 9h11.802a.5.5 0 0 1 .475.658l-1.168 3.5a.5.5 0 0 1-.474.342H3.343a.5.5 0 0 1-.466-.321z"
      stroke="#444"
    />
    <path
      d="M9 9H3.5a.5.5 0 0 1-.5-.5V6a.5.5 0 0 1 .5-.5h7.14a.5.5 0 0 1 .473.342L12 8.5"
      stroke="#444"
      strokeLinecap="round"
    />
    <path
      d="M8 3.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-1 0zm-2 4a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
      fill="#444"
    />
  </svg>
);
export default Ferry;
