import COLORS from 'const/colors';

const GridIcon = ({ fillColor = COLORS.GRAY.G2 }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M8.33333 2.5H2.5V8.33333H8.33333V2.5Z"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5013 2.5H11.668V8.33333H17.5013V2.5Z"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5013 11.6667H11.668V17.5H17.5013V11.6667Z"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 11.6667H2.5V17.5H8.33333V11.6667Z"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default GridIcon;
