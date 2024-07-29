import { SVGProps } from 'react';

const CoachSvg = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 3.5C3 2.39543 3.89543 1.5 5 1.5H11C12.1046 1.5 13 2.39543 13 3.5V12C13 12.5523 12.5523 13 12 13H7.83356H4C3.44772 13 3 12.5523 3 12V3.5Z"
        stroke="#444444"
      />
      <path d="M3.5 9H12.5" stroke="#444444" strokeLinecap="round" />
      <path d="M3.5 4.5H12.5" stroke="#444444" strokeLinecap="round" />
      <path d="M7 3H9" stroke="#444444" strokeLinecap="round" />
      <path d="M9.5 11.25H11" stroke="#444444" strokeLinecap="round" />
      <path d="M5 11.25H6.5" stroke="#444444" strokeLinecap="round" />
      <path
        d="M13.5 4.5H14C14.2761 4.5 14.5 4.72386 14.5 5V6"
        stroke="#444444"
        strokeLinecap="round"
      />
      <path
        d="M2.5 4.5H2C1.72386 4.5 1.5 4.72386 1.5 5V6"
        stroke="#444444"
        strokeLinecap="round"
      />
      <path
        d="M11 12.75V13.7966C11 14.2385 11.3582 14.5966 11.8 14.5966V14.5966C12.2418 14.5966 12.6 14.2385 12.6 13.7966V12.75"
        stroke="#444444"
      />
      <path
        d="M3.5 12.75V13.7966C3.5 14.2385 3.85817 14.5966 4.3 14.5966V14.5966C4.74183 14.5966 5.1 14.2385 5.1 13.7966V12.75"
        stroke="#444444"
      />
    </svg>
  );
};

export default CoachSvg;
