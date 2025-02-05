import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TGuidedTour = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const GuidedTour = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TGuidedTour) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke={token(strokeColor)}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.929"
        d="M8.929 14v-.928a1.857 1.857 0 00-1.858-1.858H3.357A1.857 1.857 0 001.5 13.071v.93M5 9.714A1.857 1.857 0 105 6a1.857 1.857 0 000 3.714z"
      ></path>
      <path
        stroke={token(strokeColor)}
        strokeLinecap="round"
        strokeWidth="0.929"
        d="M9 9.5V5.321m0 0V1.282c0-.066.067-.111.129-.086l5.213 2.173a.093.093 0 01-.006.174L9 5.32z"
      ></path>
    </svg>
  );
};

export default GuidedTour;
