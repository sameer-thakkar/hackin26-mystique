import { SVGProps } from 'react';

const CityTours = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M1.5 14h13" stroke="#444" strokeLinecap="round" />
    <path
      d="m8.5 11.35 5-2.268m-5-1.814 4.294-1.948a.5.5 0 0 1 .706.456V14h-5zM2.5 2.5A.5.5 0 0 1 3 2h5a.5.5 0 0 1 .5.5V14h-6z"
      stroke="#444"
    />
    <path
      d="M5 9.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0zM5 6a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0zm-.5 6.2c0-.11.09-.2.2-.2h1.6c.11 0 .2.09.2.2v1.6a.2.2 0 0 1-.2.2H4.7a.2.2 0 0 1-.2-.2z"
      fill="#444"
    />
    <path d="M10.5 6V3" stroke="#444" strokeLinecap="round" />
  </svg>
);
export default CityTours;
