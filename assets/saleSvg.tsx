import React, { SVGProps } from 'react';

const SaleSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="9"
    height="6"
    viewBox="0 0 9 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0.999886 1.14235L5.669 4.64441"
      stroke="#FFC83F"
      strokeWidth="1.75096"
      strokeLinecap="round"
    />
    <path
      d="M6.06885 1L7.23615 2.75096"
      stroke="#FFC83F"
      strokeWidth="1.75096"
      strokeLinecap="round"
    />
  </svg>
);
export default SaleSvg;
