import React from 'react';
import { type Token, token } from '@headout/pixie/tokens';

type TClock = {
  strokeColor?: Token;
} & Omit<React.SVGProps<SVGSVGElement>, 'strokeColor'>;

const Clock = ({
  strokeColor = 'colors.semantic.icon.grey.2',
  ...props
}: TClock) => {
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
        d="M6.56282 3.99992V7.49992L10.0628 9.24992M12.8337 7.49996C12.8337 10.7216 10.222 13.3333 7.00033 13.3333C3.77866 13.3333 1.16699 10.7216 1.16699 7.49996C1.16699 4.2783 3.77866 1.66663 7.00033 1.66663C10.222 1.66663 12.8337 4.2783 12.8337 7.49996Z"
        stroke={token(strokeColor)}
        strokeWidth="0.875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Clock;
