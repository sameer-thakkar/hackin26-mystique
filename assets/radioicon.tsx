import COLORS from 'const/colors';

const Radioicon = ({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle
      cx={10}
      cy={10}
      {...(!isActive
        ? { stroke: COLORS.GRAY.G5, r: 9 }
        : { fill: COLORS.BRAND.PURPS, r: 10 })}
    />
    <circle cx={10} cy={10} r={4} fill="#fff" />
  </svg>
);
export default Radioicon;
