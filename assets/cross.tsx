import COLORS from 'const/colors';

const Cross = (props: any) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="11.5" stroke={COLORS.TEXT.CANDY_1} />
    <path
      d="M17 7L7 17"
      stroke={COLORS.TEXT.CANDY_1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7L17 17"
      stroke={COLORS.TEXT.CANDY_1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default Cross;
