import COLORS from 'const/colors';

const RightArrowPointed = ({ fillColor = COLORS.GRAY.G2 }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M1.5 6L10.5 6"
      stroke={fillColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 1.5L10.5 6L6 10.5"
      stroke={fillColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default RightArrowPointed;
