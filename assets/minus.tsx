import { SVGProps } from 'react';

const Minus = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#444' } = props;

  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.166 10h11.667"
        stroke={stroke}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Minus;
