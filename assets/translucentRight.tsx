const TranslucentRight = (<svg
  width="60"
  height="60"
  viewBox="0 0 60 60"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g filter="url(#filter0_dd_13789_46128)">
    <g filter="url(#filter1_b_13789_46128)">
      <rect
        x="8"
        y="6"
        width="44"
        height="44"
        rx="22"
        fill="white"
        fillOpacity="0.3"
      />
      <path
        d="M26.667 21.3331L33.3337 27.9998L26.667 34.6665"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </g>
  <defs>
    <filter
      id="filter0_dd_13789_46128"
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
        result="effect1_dropShadow_13789_46128"
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
        in2="effect1_dropShadow_13789_46128"
        result="effect2_dropShadow_13789_46128"
      />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="effect2_dropShadow_13789_46128"
        result="shape"
      />
    </filter>
    <filter
      id="filter1_b_13789_46128"
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
        result="effect1_backgroundBlur_13789_46128"
      />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="effect1_backgroundBlur_13789_46128"
        result="shape"
      />
    </filter>
  </defs>
</svg>)
export default TranslucentRight;
