import { SVGProps } from 'react';

export const DiscountTagOpener = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#088943"
      d="M5.806 1.706A4 4 0 0 1 9.083 0H10v20h-.917a4 4 0 0 1-3.277-1.706l-4.2-6a4 4 0 0 1 0-4.588l4.2-6Z"
    />
  </svg>
);
