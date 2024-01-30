import COLORS from "const/colors";

const Mapsvg = () => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.5 0.5L1.5 0.5C0.947715 0.5 0.5 0.947715 0.5 1.5L0.5 8.5C0.5 9.05229 0.947715 9.5 1.5 9.5L8.5 9.5C9.05229 9.5 9.5 9.05229 9.5 8.5L9.5 1.5C9.5 0.947715 9.05229 0.5 8.5 0.5Z"
        stroke={COLORS.GRAY.G2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.25 4C3.66421 4 4 3.66421 4 3.25C4 2.83579 3.66421 2.5 3.25 2.5C2.83579 2.5 2.5 2.83579 2.5 3.25C2.5 3.66421 2.83579 4 3.25 4Z"
        stroke={COLORS.GRAY.G2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 6.5L7 4L1.5 9.5"
        stroke={COLORS.GRAY.G2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default Mapsvg;
