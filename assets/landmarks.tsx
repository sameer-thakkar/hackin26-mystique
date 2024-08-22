import COLORS from 'const/colors';

const Landmarks = ({
  height = 16,
  width = 16,
  stroke = COLORS.GRAY.G2,
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.87033 1.58343C7.94938 1.53261 8.05083 1.53261 8.12989 1.58343L14.3126 5.55812C14.5141 5.68765 14.4224 6 14.1829 6H1.81717C1.57763 6 1.48589 5.68764 1.68739 5.55812L7.87033 1.58343Z"
      stroke={stroke}
    />
    <path d="M1.5 14.5H14.5" stroke={stroke} strokeLinecap="round" />
    <path d="M12.5 12.5V8" stroke={stroke} strokeLinecap="round" />
    <path d="M6.5 12.5V8" stroke={stroke} strokeLinecap="round" />
    <path d="M9.5 12.5V8" stroke={stroke} strokeLinecap="round" />
    <path d="M3.5 12.5V8" stroke={stroke} strokeLinecap="round" />
  </svg>
);
export default Landmarks;
