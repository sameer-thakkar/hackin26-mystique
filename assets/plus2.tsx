import { SVGProps } from 'react';

const Plus2 = ({ stroke = '#444444' }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5052 4.16602V15.8327M4.67188 9.99935H16.3385"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Plus2;
