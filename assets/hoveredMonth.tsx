const HoveredMonth = ({ month, year }: { month: string; year: string }) => (
  <svg
    width="136"
    height="119"
    viewBox="0 0 136 119"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="hovered-month"
  >
    <g clipPath="url(#clip0_4_42)">
      <rect width="136" height="119" rx="8" fill="#9933FF" />
      <rect width="136" height="37" fill="url(#paint0_radial_4_42)" />
      <path
        d="M0 37H136V111C136 115.418 132.418 119 128 119H8C3.58172 119 0 115.418 0 111V37Z"
        fill="url(#paint1_linear_4_42)"
      />
      <g filter="url(#filter0_d_4_42)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M137 92.7183L137 92.7182L137 92.718V92.0145H136.318L136.304 92L136.289 92.0145H118C113.029 92.0145 109 96.0439 109 101.014V119.256H110.014L109.26 120L126.395 119.256H128C128.539 119.256 129.067 119.209 129.581 119.118L136.853 118.802L136.853 111.883C136.95 111.356 137 110.812 137 110.256V92.7183ZM136.853 92.862L136.853 111.883C136.181 115.565 133.269 118.464 129.581 119.118L126.395 119.256H110.014L125.272 104.204L136.853 92.862ZM136.853 92.862V92.7794L125.272 104.204L109.903 119.256L109.207 118.538L136.289 92.0145H136.318L137 92.718V92.7183L136.853 92.862Z"
          fill="white"
          fillOpacity="0.3"
          shapeRendering="crispEdges"
        />
      </g>
      <text
        fill="black"
        fillOpacity="0.8"
        xmlSpace="preserve"
        fontFamily="Halyard Display"
        fontSize="24"
        letterSpacing="0.8px"
      >
        <tspan x="43.4109" y="84.324">
          {month}
        </tspan>
      </text>
      <text
        fill="white"
        xmlSpace="preserve"
        fontFamily="Halyard Display"
        fontSize="24"
        letterSpacing="0.8px"
      >
        <tspan x="39.3352" y="29.324">
          {year}
        </tspan>
      </text>
    </g>
    <defs>
      <filter
        id="filter0_d_4_42"
        x="101"
        y="84"
        width="36.0001"
        height="36"
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
        <feOffset dx="-4" dy="-4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.501961 0 0 0 0 0 0 0 0 0 1 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_4_42"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_4_42"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_4_42"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(101 2.14091e-06) rotate(147.011) scale(67.9559 249.784)"
      >
        <stop stopColor="#9E3AFE" />
        <stop offset="1" stopColor="#B96BFB" />
      </radialGradient>
      <linearGradient
        id="paint1_linear_4_42"
        x1="136"
        y1="43"
        x2="-7.61549e-06"
        y2="119"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E8D2FF" />
        <stop offset="1" stopColor="#FCF3FC" />
      </linearGradient>
      <clipPath id="clip0_4_42">
        <rect width="136" height="119" rx="8" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default HoveredMonth;
