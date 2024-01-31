const TranslucentLeft = (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g filter="url(#filter0_dd_13789_46127)">
      <g filter="url(#filter1_b_13789_46127)">
        <rect
          width="44"
          height="44"
          rx="22"
          transform="matrix(-1 0 0 1 52 6)"
          fill="white"
          fillOpacity="0.3"
        />
        <path
          d="M33.3335 21.3331L26.6668 27.9998L33.3335 34.6665"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_dd_13789_46127"
        x="0"
        y="0"
        width="60"
        height="60"
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
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_13789_46127"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="0.5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_13789_46127"
          result="effect2_dropShadow_13789_46127"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_13789_46127"
          result="shape"
        />
      </filter>
      <filter
        id="filter1_b_13789_46127"
        x="-4"
        y="-6"
        width="68"
        height="68"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="6" />
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="effect1_backgroundBlur_13789_46127"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_13789_46127"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default TranslucentLeft;
