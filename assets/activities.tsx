import { SVGProps } from 'react';

const Activities = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 4.125 7.875 6M2.25 7.125l.743-1.857a.1.1 0 0 1 .022-.03l1.616-1.293a.15.15 0 0 1 .244.117v2.555a.75.75 0 0 0 .471.697l1.281.512a.3.3 0 0 1 .17.173l1.078 2.876"
      stroke="#444"
      strokeWidth={0.75}
      strokeLinecap="round"
    />
    <path d="M10.5 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0" fill="#444" />
    <path
      d="M5.813 2.063a.937.937 0 1 1-1.875 0 .937.937 0 0 1 1.874 0Z"
      stroke="#444"
      strokeWidth={0.75}
    />
    <path
      d="m5.625 9-1.5 1.875"
      stroke="#444"
      strokeWidth={0.75}
      strokeLinecap="round"
    />
  </svg>
);
export default Activities;
