const Badge = (children: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="120"
    height="28"
    viewBox="0 0 120 28"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M120 0H0L0.603015 5.25H0.603058L2.47542 20.9475C2.95531 24.9708 6.36733 28 10.4191 28H108.809C112.716 28 116.051 25.1778 116.698 21.3247L119.397 5.25H119.397L120 0Z"
      fill="url(#paint0_linear_5130_3338)"
    />

    <text x="28" y="19" fontSize="14" font-color="white" fill="white">
      {children}
    </text>
    <defs>
      <linearGradient
        id="paint0_linear_5130_3338"
        x1="3.95723e-07"
        y1="3.06251"
        x2="116.836"
        y2="12.0555"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E5006E" />
        <stop offset="1" stopColor="#FF66AF" />
      </linearGradient>
    </defs>
  </svg>
)
export default Badge;
