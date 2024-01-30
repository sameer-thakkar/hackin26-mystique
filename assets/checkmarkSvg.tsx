const CheckmarkSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="11"
      fill="none"
      viewBox="0 0 14 11"
      {...props}
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 1.333L4.75 10 1 6.06"
      ></path>
    </svg>
  );
};
export default CheckmarkSvg;
