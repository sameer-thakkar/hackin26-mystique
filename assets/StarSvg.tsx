export const StarSvg = ({
  stroke = '#e5006e',
  fill = '#e5006e',
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
      role="img"
      aria-hidden="true"
      {...props}
    >
      <path
        fill={fill}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.125 1.275l1.545 3.13 3.455.505-2.5 2.435.59 3.44-3.09-1.625-3.09 1.625.59-3.44-2.5-2.435 3.455-.505 1.545-3.13z"
      ></path>
    </svg>
  );
};
