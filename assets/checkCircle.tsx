import { SVGProps } from 'react';

const CheckCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.9031 5.02067L6.27463 8.979L4.62533 7.17976M13.3337 6.99984C13.3337 10.4976 10.4981 13.3332 7.00033 13.3332C3.50252 13.3332 0.666992 10.4976 0.666992 6.99984C0.666992 3.50203 3.50252 0.666504 7.00033 0.666504C10.4981 0.666504 13.3337 3.50203 13.3337 6.99984Z"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckCircle;
