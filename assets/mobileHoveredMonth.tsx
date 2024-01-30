const MobileHoveredMonth = ({
  month,
  year,
}: {
  month: string;
  year: string;
}) => {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_35_56794)">
        <rect
          width="72"
          height="72"
          rx="6"
          fill="url(#paint0_radial_35_56794)"
        />
        <path
          d="M0 19H72V66C72 69.3137 69.3137 72 66 72H6C2.68629 72 0 69.3137 0 66V19Z"
          fill="url(#paint1_radial_35_56794)"
        />
        <text
          fill="black"
          fillOpacity="0.8"
          xmlSpace="preserve"
          fontFamily="Halyard Display"
          fontSize="14"
          letterSpacing="0.522449px"
        >
          <tspan x="21.1006" y="49.5819">
            {month}
          </tspan>
        </text>
        <text
          fill="white"
          xmlSpace="preserve"
          fontFamily="Halyard Display"
          fontSize="12"
          letterSpacing="0.391837px"
        >
          <tspan x="21.4299" y="15.111">
            {year}
          </tspan>
        </text>
        <g filter="url(#filter0_d_35_56794)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M72.3672 58.4673L72.3673 58.4672L72.3672 58.4672V58.1087H72.0174L71.9111 57.9998L71.7992 58.1087H63.8774C60.6313 58.1087 57.9999 60.7402 57.9999 63.9863V71.9872H58.5206L58.1332 72.3667L72.2918 71.7562L72.2918 67.054C72.3414 66.7465 72.3672 66.4311 72.3672 66.1097V58.4673ZM72.2918 58.5406L72.2918 67.054C71.84 69.8511 69.4143 71.9872 66.4897 71.9872H58.5206L66.3788 64.2903L72.2918 58.5406ZM72.2918 58.5406V58.4987L66.3788 64.2903L58.4634 71.9872L58.0072 71.5199L71.7992 58.1087H72.0174L72.3672 58.4672V58.4673L72.2918 58.5406Z"
            fill="white"
            fillOpacity="0.3"
            shapeRendering="crispEdges"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_35_56794"
          x="52.7754"
          y="52.7754"
          width="19.5919"
          height="19.5913"
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
          <feOffset dx="-2.61224" dy="-2.61224" />
          <feGaussianBlur stdDeviation="1.30612" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.501961 0 0 0 0 0 0 0 0 0 1 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_35_56794"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_35_56794"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial_35_56794"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(36 21) rotate(-145.491) scale(48.5412)"
        >
          <stop stopColor="#C986F9" />
          <stop offset="1" stopColor="#9933FF" />
        </radialGradient>
        <radialGradient
          id="paint1_radial_35_56794"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(36 45.5) rotate(140.371) scale(41.5482 56.4428)"
        >
          <stop stopColor="#FDF0FA" />
          <stop offset="1" stopColor="#DEBBFE" />
        </radialGradient>
        <clipPath id="clip0_35_56794">
          <rect width="72" height="72" rx="6" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
export default MobileHoveredMonth;
