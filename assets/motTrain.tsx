import { SVGProps } from 'react';

const Train = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.233 4.2a2.6 2.6 0 0 1 2.6-2.6h4.334a2.6 2.6 0 0 1 2.6 2.6v6.067a.867.867 0 0 1-.867.866H4.1a.867.867 0 0 1-.867-.866z"
      stroke="#444"
    />
    <circle cx={5.177} cy={8.864} r={0.677} fill="#444" />
    <circle cx={10.677} cy={8.864} r={0.677} fill="#444" />
    <path
      d="M4.967 11.133 2 14m9.033-2.867L14 14m-11.2-.7h10.053"
      stroke="#444"
      strokeLinecap="round"
    />
    <path d="M5 4h6v3H5z" stroke="#444" strokeLinejoin="round" />
  </svg>
);
export default Train;
