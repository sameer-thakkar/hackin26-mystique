const OUTLINE_STAR = ({ strokeColor }: { strokeColor: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      d="M7 .512l2.012 4.27 4.5.69-3.256 3.322.768 4.694L7 11.271l-4.024 2.217.768-4.694L.49 5.472l4.5-.69L7 .513z"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OUTLINE_STAR;
