import { SVGProps } from 'react';

const CrossCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.24988 3.75L3.74988 8.25M3.74988 3.75L8.24988 8.25M11.2499 6C11.2499 8.89949 8.89937 11.25 5.99988 11.25C3.10038 11.25 0.749878 8.89949 0.749878 6C0.749878 3.10051 3.10038 0.75 5.99988 0.75C8.89937 0.75 11.2499 3.10051 11.2499 6Z"
      stroke="#444444"
      strokeWidth={0.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CrossCircle;
