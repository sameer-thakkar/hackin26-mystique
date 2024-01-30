const LttChevronLeft = ({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`chevron-left ${disabled ? 'disabled' : ''}`}
    onClick={onClick}
  >
    <circle
      cx="18"
      cy="18"
      r="17.5089"
      transform="matrix(-1 0 0 1 36 0)"
      stroke={disabled ? '#79797930' : '#79797960'}
      strokeOpacity="0.6"
      strokeWidth="0.982287"
    />
    <path
      d="M21.334 11.3337L14.6673 18.0003L21.334 24.667"
      stroke={disabled ? '#44444460' : '#444444'}
      strokeWidth="1.47343"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default LttChevronLeft;
