const ButtonLoaderAnimation = (
  <svg
    version="1.1"
    id="L5"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 65 100"
    enableBackground="new 0 0 0 0"
    xmlSpace="preserve"
    style={{
      width: '100%',
      height: ' 100%',
    }}
  >
    <circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
      <animateTransform
        attributeName="transform"
        dur=".7s"
        type="translate"
        values="0 6 ; 0 -6; 0 6"
        repeatCount="indefinite"
        begin="0.1"
      />
    </circle>
    <circle fill="#fff" stroke="none" cx="30" cy="50" r="6">
      <animateTransform
        attributeName="transform"
        dur=".7s"
        type="translate"
        values="0 6 ; 0 -6; 0 6"
        repeatCount="indefinite"
        begin="0.25"
      />
    </circle>
    <circle fill="#fff" stroke="none" cx="54" cy="50" r="6">
      <animateTransform
        attributeName="transform"
        dur=".7s"
        type="translate"
        values="0 6 ; 0 -6; 0 6"
        repeatCount="indefinite"
        begin="0.4"
      />
    </circle>
  </svg>
);
export default ButtonLoaderAnimation;
