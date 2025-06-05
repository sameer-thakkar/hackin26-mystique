const Month = ({ month, year }: { month: string; year: string }) => (
  <svg
    width="136"
    height="119"
    viewBox="0 0 136 119"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="month"
  >
    <g clipPath="url(#clip0_28_4291)">
      <rect width="136" height="119" rx="8" fill="#9933FF" />
      <rect width="136" height="37" fill="url(#paint0_radial_28_4291)" />
      <path
        d="M0 37H136V111C136 115.418 132.418 119 128 119H8C3.58172 119 0 115.418 0 111V37Z"
        fill="url(#paint1_linear_28_4291)"
      />
      <text
        fill="black"
        fillOpacity="0.8"
        xmlSpace="preserve"
        fontFamily="halyard-display"
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
        fontFamily="halyard-display"
        fontSize="24"
        letterSpacing="0.8px"
      >
        <tspan x="39.3352" y="29.324">
          {year}
        </tspan>
      </text>
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_28_4291"
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
        id="paint1_linear_28_4291"
        x1="125.5"
        y1="42.5"
        x2="29"
        y2="119"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DEBBFE" />
        <stop offset="0.841701" stopColor="#F9E9FB" />
      </linearGradient>
      <clipPath id="clip0_28_4291">
        <rect width="136" height="119" rx="8" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default Month;
