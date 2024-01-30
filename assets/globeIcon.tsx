import COLORS from 'const/colors';

const GlobeIcon = ({ stroke = COLORS.GRAY.G3 }: { stroke?: string }) => (
  <svg
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g
      clipPath="url(#a)"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 14.667A6.667 6.667 0 1 0 8 1.334a6.667 6.667 0 0 0 0 13.333ZM1.333 8h13.333" />
      <path d="M8 1.333A10.2 10.2 0 0 1 10.666 8 10.2 10.2 0 0 1 8 14.667 10.2 10.2 0 0 1 5.333 8 10.2 10.2 0 0 1 8 1.333v0Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default GlobeIcon;
