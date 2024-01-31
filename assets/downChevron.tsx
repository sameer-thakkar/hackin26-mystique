import COLORS from 'const/colors';

const DownChevron = (strokeWidth = 1) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.33329 4.66675L7.99996 11.3334L14.6666 4.66675"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </svg>
);
export default DownChevron;
