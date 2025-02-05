import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TFood = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const Food = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TFood) => {
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
        d="M5.6875 1.8125V4.875C5.6875 5.8415 4.904 6.625 3.9375 6.625H3.71875M1.75 1.8125V4.875C1.75 5.8415 2.5335 6.625 3.5 6.625H3.71875M3.71875 6.625V13.2859M3.71875 1.8125V4.875"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
      <path
        d="M9.625 6.79407V13.1875"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
      />
      <path
        d="M8.20206 2.73363C8.45356 2.17314 9.01067 1.8125 9.625 1.8125V1.8125C10.2393 1.8125 10.7964 2.17314 11.0479 2.73363L11.1499 2.96076C11.5692 3.89539 11.5468 4.96895 11.0886 5.88522V5.88522C10.9896 6.08331 10.8406 6.25212 10.6563 6.37497L10.5206 6.46543C9.97827 6.82699 9.27173 6.82699 8.72939 6.46543L8.5937 6.37497C8.40943 6.25212 8.2604 6.08331 8.16136 5.88522V5.88522C7.70323 4.96895 7.68075 3.89539 8.10014 2.96076L8.20206 2.73363Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
      />
    </svg>
  );
};

export default Food;
