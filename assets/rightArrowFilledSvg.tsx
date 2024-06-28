import COLORS from 'const/colors';

const RightArrowFilledSvg = ({
  svgFill = COLORS.BRAND.WHITE,
  svgStroke = COLORS.GRAY.G1,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  svgFill?: string;
  svgStroke?: string;
}) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="16" height="16" rx="8" fill={svgFill} />
      <path
        d="M7.33398 11.3334L10.6673 8.00008L7.33398 4.66675"
        stroke={svgStroke}
        strokeWidth="0.666667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RightArrowFilledSvg;
