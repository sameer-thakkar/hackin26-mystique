interface BackArrowProps extends React.SVGProps<SVGSVGElement> {
  stroke?: string;
}

const BackArrow = ({ stroke = '#444444', ...props }: BackArrowProps) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.3333 9.33337L2.33334 9.33337"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.33334 16.3334L2.33334 9.33337L9.33334 2.33337"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default BackArrow;
