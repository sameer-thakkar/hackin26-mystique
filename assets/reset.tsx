import * as React from 'react';
import { SVGProps } from 'react';

const Reset = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.333 2.667v4h-4"
      stroke="#444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.66 10a6 6 0 1 1-1.413-6.24l3.087 2.907"
      stroke="#444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default Reset;
