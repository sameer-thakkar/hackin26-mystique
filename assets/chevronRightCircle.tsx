const ChevronRightCircle = (
  <svg
    width="88"
    height="48"
    viewBox="0 0 88 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="6" width="80" height="32" fill="url(#paint0_linear_1215_2305)" />
    <g filter="url(#filter0_dd_1215_2305)">
      <circle cx="64" cy="22" r="16" fill="white" />
    </g>
    <path
      d="M60.6667 15.3334L67.3334 22.0001L60.6667 28.6667"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_dd_1215_2305"
        x="40"
        y="0"
        width="48"
        height="48"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1215_2305"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="0.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1215_2305"
          result="effect2_dropShadow_1215_2305"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1215_2305"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_1215_2305"
        x1="60"
        y1="22"
        x2="-5.43868e-07"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);
export default ChevronRightCircle;
