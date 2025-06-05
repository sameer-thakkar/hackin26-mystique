import React, { SVGProps } from 'react';

const GradientSaleSvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="51"
    height="28"
    viewBox="0 0 51 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_20295_58050)">
      <g opacity="0.61" filter="url(#filter0_f_20295_58050)">
        <rect
          x="24.3467"
          y="-20.2432"
          width="7.50949"
          height="74.76"
          transform="rotate(24.8476 24.3467 -20.2432)"
          fill="#9B4FC3"
        />
      </g>
      <g opacity="0.61" filter="url(#filter1_f_20295_58050)">
        <rect
          x="42.9736"
          y="-28.3828"
          width="19.8261"
          height="86.0332"
          transform="rotate(24.8476 42.9736 -28.3828)"
          fill="#B25EDE"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_20295_58050"
        x="-10.6937"
        y="-23.8685"
        width="45.4802"
        height="78.2458"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="1.81267"
          result="effect1_foregroundBlur_20295_58050"
        />
      </filter>
      <filter
        id="filter1_f_20295_58050"
        x="2.57382"
        y="-32.6313"
        width="62.6395"
        height="94.8973"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="2.12422"
          result="effect1_foregroundBlur_20295_58050"
        />
      </filter>
      <clipPath id="clip0_20295_58050">
        <rect width="51" height="28" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default GradientSaleSvg;
