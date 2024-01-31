import COLORS from 'const/colors';

const Calendar = ({
  strokeColor = COLORS.GRAY.G2,
}: {
  strokeColor?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.667 2.664H3.333C2.597 2.664 2 3.261 2 3.997v9.334c0 .736.597 1.333 1.333 1.333h9.334c.736 0 1.333-.597 1.333-1.333V3.997c0-.736-.597-1.333-1.333-1.333zM10.667 1.332v2.667M5.333 1.332v2.667M2 6.664h12"
    ></path>
  </svg>
);
export default Calendar;
