import COLORS from "const/colors";

const ReversibleArrow = ({
  fillColor = COLORS.GRAY.G2,
}: any) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 6H2"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 6L6 2"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 10L14 10"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 9.99999L10 14"
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default ReversibleArrow;
