import COLORS from 'const/colors';

const ChevronLeftCircle = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#chev_filter0_d)">
      <circle r="16" transform="matrix(-1 0 0 1 20 18)" fill="white" />
    </g>
    <g clipPath="url(#chev_clip0)">
      <path
        d="M23.3333 24.6666L16.6667 17.9999L23.3333 11.3333"
        stroke={COLORS.GRAY.G2}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter
        id="chev_filter0_d"
        x="0"
        y="0"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
      <clipPath id="chev_clip0">
        <rect
          width="16"
          height="16"
          transform="matrix(-1 0 0 1 28 10)"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);
export default ChevronLeftCircle;
