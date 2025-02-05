import React from 'react';

const Play = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L9.54 5.98A.998.998 0 008 6.82z"></path>
  </svg>
);

export const ImageSvg = (props: Record<string, any>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="#444"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.667 2H3.333C2.597 2 2 2.597 2 3.333v9.334C2 13.403 2.597 14 3.333 14h9.334c.736 0 1.333-.597 1.333-1.333V3.333C14 2.597 13.403 2 12.667 2z"
    ></path>
    <path
      stroke="#444"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.667 6.667a1 1 0 100-2 1 1 0 000 2zM14 10l-3.333-3.333L3.333 14"
    ></path>
  </svg>
);

export default Play;
