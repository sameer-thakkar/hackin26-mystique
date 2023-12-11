import { SVGProps } from 'react';

const Ticket = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m11.25 10 2.91-5.09L12.63 4a2.55 2.55 0 0 1-3.48-1 2.67 2.67 0 0 1-.32-1.13v-.05L7.31 1l-2.9 5.1-2.91 5.04 1.52.86a2.78 2.78 0 0 1 1.17-.31 2.552 2.552 0 0 1 2.64 2.46l1.53.88L11.25 10ZM12 7.5 6 4"
    />
  </svg>
);
export default Ticket;
