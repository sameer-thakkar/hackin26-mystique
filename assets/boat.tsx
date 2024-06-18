import { SVGProps } from 'react';

const Boat = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.913 9.243A.5.5 0 0 1 2.35 8.5h11.8a.5.5 0 0 1 .437.743l-1.516 2.728A2 2 0 0 1 11.323 13H4.294a.5.5 0 0 1-.437-.257z"
      stroke="#444"
    />
    <path
      d="M3.939 5.43A.5.5 0 0 1 4.434 5h5.809a.5.5 0 0 1 .407.21L13 8.5H3.5z"
      stroke="#444"
    />
    <path
      d="M7 5V3H5m3.5 2v3.5"
      stroke="#444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Boat;
