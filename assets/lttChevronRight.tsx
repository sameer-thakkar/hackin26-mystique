const LttChevronRight = ({
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
    onClick={onClick}
    className={`chevron-right ${disabled ? 'disabled' : ''}`}
  >
    <circle
      cx="18"
      cy="18"
      r="17.5089"
      stroke={disabled ? '#79797930' : '#79797960'}
      strokeOpacity="0.6"
      strokeWidth="0.982287"
    />
    <path
      d="M14.666 11.3337L21.3327 18.0003L14.666 24.667"
      stroke={disabled ? '#44444460' : '#444444'}
      strokeWidth="1.47343"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default LttChevronRight;
