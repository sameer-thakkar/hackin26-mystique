import { SVGProps } from 'react';

const Map = ({
  pathStroke = '#444444',
  ...props
}: SVGProps<SVGSVGElement> & {
  pathStroke?: string;
}) => (
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_7864_56256)">
      <path
        d="M1.33301 5.00008V18.3334L7.16634 15.0001L13.833 18.3334L19.6663 15.0001V1.66675L13.833 5.00008L7.16634 1.66675L1.33301 5.00008Z"
        stroke={pathStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.16699 1.66675V15.0001"
        stroke={pathStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.833 5V18.3333"
        stroke={pathStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_7864_56256">
        <rect width="20" height="20" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);
export default Map;
