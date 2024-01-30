import COLORS from 'const/colors';

const Ticksvg = ({ strokeColor = COLORS.GRAY.G3 }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 3.3335L5.75 12.0002L2 8.06077"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default Ticksvg;
