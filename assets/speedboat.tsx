import { SVGProps } from 'react';

const Speedboat = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m1 9 2.85 3.325a.5.5 0 0 0 .38.175h9.41a.5.5 0 0 0 .474-.342l.82-2.46a.2.2 0 0 0-.134-.255l-1.454-.416A9 9 0 0 0 9.6 8.771L8 9l-2.122.303a9 9 0 0 1-2.752-.032L1.5 9"
      stroke="#444"
    />
    <path
      d="m1 9 1.5-1 1.915-1.149a2 2 0 0 1 1.263-.271l6.97.82a2 2 0 0 1 1.367.786L15 9.5"
      stroke="#444"
      strokeLinecap="round"
    />
    <path
      d="M2.5 8 5 6.5l.42-2.098a.47.47 0 0 1 .489-.387c.972.058 2.91.304 3.591.985.8.8 1 1.667 1 2m-2-2.5L7 6.5"
      stroke="#444"
      strokeLinecap="round"
    />
    <circle cx={8.5} cy={10.5} r={0.5} fill="#444" />
    <circle cx={10.5} cy={10.5} r={0.5} fill="#444" />
    <circle cx={12.5} cy={10.5} r={0.5} fill="#444" />
  </svg>
);
export default Speedboat;
