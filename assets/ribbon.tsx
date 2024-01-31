const Ribbon = (index: number) => (
  <svg
    width="48"
    height="72"
    viewBox="0 0 48 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M48 10.2857C48 4.60507 43.3949 0 37.7143 0H-7.15256e-07V72L24 62.5263L48 72V10.2857Z"
      fill="url(#paint0_linear_8668_66062)"
    />
    <text x="15" y="45" fontSize="36" font-color="white" fill="white">
      {index}
    </text>
    <defs>
      <linearGradient
        id="paint0_linear_8668_66062"
        x1="24"
        y1="0"
        x2="24"
        y2="72"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF5BAA" />
        <stop offset="1" stopColor="#FF017B" />
      </linearGradient>
    </defs>
  </svg>
);
export default Ribbon;
