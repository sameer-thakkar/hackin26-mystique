import React from 'react';

type TShieldTick = Omit<React.SVGProps<SVGSVGElement>, 'fill' | 'strokeColor'>;

const ShieldTick = ({ ...props }: TShieldTick) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="#088943"
        d="M9.612 18.57c.248.12.528.12.775 0 1.536-.75 7.113-3.774 7.113-8.246V4.555a1 1 0 00-.673-.945l-6.5-2.247a1 1 0 00-.654 0l-6.5 2.247a1 1 0 00-.673.945v5.77c0 4.47 5.577 7.496 7.112 8.244z"
      ></path>
      <path
        stroke="#F2FDEB"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.278 7L9 11.5l-2-2"
      ></path>
    </svg>
  );
};

export default ShieldTick;
