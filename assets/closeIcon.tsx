const CloseIcon = (props: any) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.3334 2.66669L2.66669 13.3334"
      stroke={props.color ?? '#444444'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66669 2.66669L13.3334 13.3334"
      stroke={props.color ?? '#444444'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CloseIcon;
