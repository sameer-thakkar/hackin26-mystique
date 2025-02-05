import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type THeadphone = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Headphone = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: THeadphone) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      {...props}
    >
      <path
        d="M1.75 11V7.5C1.75 6.10761 2.30312 4.77226 3.28769 3.78769C4.27226 2.80312 5.60761 2.25 7 2.25C8.39239 2.25 9.72774 2.80312 10.7123 3.78769C11.6969 4.77226 12.25 6.10761 12.25 7.5V11"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 11.5833C12.25 11.8927 12.1271 12.1895 11.9083 12.4083C11.6895 12.627 11.3928 12.75 11.0833 12.75H10.5C10.1906 12.75 9.89383 12.627 9.67504 12.4083C9.45625 12.1895 9.33333 11.8927 9.33333 11.5833V9.83329C9.33333 9.52387 9.45625 9.22713 9.67504 9.00833C9.89383 8.78954 10.1906 8.66663 10.5 8.66663H12.25V11.5833ZM1.75 11.5833C1.75 11.8927 1.87292 12.1895 2.09171 12.4083C2.3105 12.627 2.60725 12.75 2.91667 12.75H3.5C3.80942 12.75 4.10617 12.627 4.32496 12.4083C4.54375 12.1895 4.66667 11.8927 4.66667 11.5833V9.83329C4.66667 9.52387 4.54375 9.22713 4.32496 9.00833C4.10617 8.78954 3.80942 8.66663 3.5 8.66663H1.75V11.5833Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Headphone;
