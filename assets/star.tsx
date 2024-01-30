const Star = ({ color }: { color: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.125 1.2749L7.67 4.4049L11.125 4.9099L8.625 7.3449L9.215 10.7849L6.125 9.1599L3.035 10.7849L3.625 7.3449L1.125 4.9099L4.58 4.4049L6.125 1.2749Z"
      fill={color}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default Star;
