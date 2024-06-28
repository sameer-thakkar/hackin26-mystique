const ChevronRight = ({
  fillColor,
  width = 16,
  height = 16,
  strokeWidth,
  className = '',
}: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M4.66675 14.6667L11.3334 8.00004L4.66675 1.33337"
      stroke={fillColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default ChevronRight;
