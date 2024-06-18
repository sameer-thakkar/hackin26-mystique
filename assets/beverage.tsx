import { SVGProps } from 'react';

const Beverage = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.747 1.154a.03.03 0 0 1 .032-.029H8.22q.027.002.032.029L8.65 4.52a2.668 2.668 0 1 1-5.299 0z"
      stroke="#444"
      strokeWidth={0.75}
    />
    <path
      d="M6 7.5v3m-1.5.375h3"
      stroke="#444"
      strokeWidth={0.75}
      strokeLinecap="round"
    />
    <path
      d="m8.25 4.65-.473.216a1.5 1.5 0 0 1-1.56-.193L6 4.5l-.418-.313c-.588-.441-2.207-.812-2.207.688"
      stroke="#444"
      strokeWidth={0.75}
      strokeLinecap="square"
    />
  </svg>
);
export default Beverage;
