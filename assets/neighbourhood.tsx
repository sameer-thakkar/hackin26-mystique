import { SVGProps } from 'react';

const Neighborhood = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M1.5 14.5h13" stroke="#444" strokeLinecap="round" />
    <path
      d="M2.5 2.5A.5.5 0 0 1 3 2h5.5a.5.5 0 0 1 .5.5v12H2.5z"
      stroke="#444"
    />
    <path
      d="M5.25 8.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0zm0-3.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0z"
      fill="#444"
    />
    <path
      d="M6.75 14.5v-2.3a.2.2 0 0 0-.2-.2h-1.6a.2.2 0 0 0-.2.2v2.3"
      stroke="#444"
    />
    <path d="M12.5 9v5.5" stroke="#444" strokeLinecap="round" />
    <path
      d="M10.864 6.494a1.643 1.643 0 0 1 3.272 0l.183 2.014a1.826 1.826 0 1 1-3.638 0z"
      stroke="#444"
      strokeLinejoin="round"
    />
  </svg>
);
export default Neighborhood;
