import type { SVGProps } from 'react';

export const Sandclock = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 1C1 3.20914 2.79086 5 5 5C7.20914 5 9 3.20914 9 1H8C8 2.65685 6.65685 4 5 4C3.34315 4 2 2.65685 2 1H1Z"
        fill="#444444"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 9C9 6.79086 7.20914 5 5 5C2.79086 5 1 6.79086 1 9L2 9C2 7.34315 3.34315 6 5 6C6.65685 6 8 7.34315 8 9L9 9Z"
        fill="#444444"
      />
      <line y1="9.5" x2="10" y2="9.5" stroke="#444444" />
      <line y1="0.5" x2="10" y2="0.5" stroke="#444444" />
    </svg>
  );
};
