const quickSvg = (props) => {
  return (
    <svg width={14} height={16} viewBox="0 0 14 16" fill="none" {...props}>
      <path
        d="M7.667 1.333L1 9.334h6l-.667 5.334 6.667-8H7l.667-5.333z"
        stroke="#444"
        fill="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const skipSvg = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <circle cx="13.5" cy="2.5" r="1.5" stroke="#444444" />
      <path
        d="M5 5.5L8.5 2L11 4.5"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 6.5V8.5H15.5"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 8.5L10.5 12L6.5 14.5"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.5 10.5L0.5 15.5" stroke="#444444" strokeLinecap="round" />
    </svg>
  );
};

const clockSvg = (props) => {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 14.667A6.667 6.667 0 108 1.334a6.667 6.667 0 000 13.333z"
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 4v4l4 2"
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const cancelSvg = (props) => {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <g
        clipPath="url(#prefix__clip0)"
        stroke="#444"
        strokeLinecap="round"
        fill="#fff"
        strokeLinejoin="round"
      >
        <path d="M7.835 15.588s5.835-2.918 5.835-7.294V3.188L7.835 1 2 3.188v5.106c0 4.376 5.835 7.293 5.835 7.293z" />
        <path d="M11.5 5.5l-4.313 5.556L5 8.758" />
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

const transferSvg = (props) => {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M14 6H2M2 6l4-4M2 10h12M14 10l-4 4"
        stroke="#444"
        fill="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const phoneSvg = (props) => {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" {...props}>
      <path
        d="M11.334 1.333H4.667c-.737 0-1.333.597-1.333 1.334v10.666c0 .737.596 1.334 1.333 1.334h6.667c.736 0 1.333-.597 1.333-1.333V2.667c0-.737-.597-1.333-1.333-1.333zM8 12h.007"
        stroke="#444"
        strokeLinecap="round"
        fill="#fff"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const StartIcon = (props) => {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8.167 1.7l2.06 4.173 4.606.674L11.5 9.793l.787 4.587-4.12-2.167-4.12 2.167.786-4.587L1.5 6.547l4.607-.674L8.167 1.7z"
        fill="#FFBC00"
      />
    </svg>
  );
};

export const StarIcon = (props) => (
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.20833 1.125L11.7833 6.34167L17.5417 7.18333L13.375 11.2417L14.3583 16.975L9.20833 14.2667L4.05833 16.975L5.04167 11.2417L0.875 7.18333L6.63333 6.34167L9.20833 1.125Z"
      fill="#FF007A"
      stroke="#FF007A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const hotelSvg = (props) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Frame 2">
        <g id="Group 12">
          <path
            id="Rectangle 2"
            d="M3.67845 5.10777C3.86542 4.17292 4.68625 3.5 5.63961 3.5H14.3604C15.3138 3.5 16.1346 4.17292 16.3216 5.10777L17 8.5H3L3.67845 5.10777Z"
            stroke="#444444"
          />
          <g id="Rectangle 1">
            <path
              d="M4 9H16V8H4V9ZM18.5 11.5V15.3H19.5V11.5H18.5ZM18.8 15H1.2V16H18.8V15ZM1.5 15.3V11.5H0.5V15.3H1.5ZM1.2 15C1.36568 15 1.5 15.1343 1.5 15.3H0.5C0.5 15.6866 0.813403 16 1.2 16V15ZM18.5 15.3C18.5 15.1343 18.6343 15 18.8 15V16C19.1866 16 19.5 15.6866 19.5 15.3H18.5ZM16 9C17.3807 9 18.5 10.1193 18.5 11.5H19.5C19.5 9.567 17.933 8 16 8V9ZM4 8C2.067 8 0.5 9.567 0.5 11.5H1.5C1.5 10.1193 2.61929 9 4 9V8Z"
              fill="#444444"
            />
          </g>
          <circle id="Ellipse 15" cx="4.5" cy="12" r="1" stroke="#444444" />
          <circle id="Ellipse 16" cx="15.5" cy="12" r="1" stroke="#444444" />
          <path
            id="Rectangle 3"
            d="M7.5 2.7C7.5 2.3134 7.8134 2 8.2 2H11.8C12.1866 2 12.5 2.3134 12.5 2.7V3.5H7.5V2.7Z"
            fill="#444444"
          />
          <path
            id="Vector 6"
            d="M7 13.5L13 13.5"
            stroke="#444444"
            strokeLinecap="round"
          />
          <path
            id="Rectangle 5"
            d="M14 15.5H17V17C17 17.8284 16.3284 18.5 15.5 18.5V18.5C14.6716 18.5 14 17.8284 14 17V15.5Z"
            stroke="#444444"
          />
          <path
            id="Rectangle 6"
            d="M3 15.5H6V17C6 17.8284 5.32843 18.5 4.5 18.5V18.5C3.67157 18.5 3 17.8284 3 17V15.5Z"
            stroke="#444444"
          />
        </g>
      </g>
    </svg>
  );
};

export const foodSvg = (props) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Food">
        <path
          id="Vector"
          d="M6.25 3.75V6.56248"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M10.0595 3.75V6.56248"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_3"
          d="M13.8691 3.75V6.56248"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Ellipse"
          d="M18.2445 9.25C18.2018 11.1299 17.8972 12.9733 16.8647 14.3828C15.7651 15.884 13.7552 17 10 17C6.35749 17 4.34192 15.887 3.21276 14.3787C2.15565 12.9666 1.80655 11.1207 1.75654 9.25H18.2445Z"
          stroke="#444444"
        />
      </g>
    </svg>
  );
};

export const headphonesSvg = (props) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="headphones">
        <path
          id="Vector"
          d="M2.5 15V10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10V15"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M17.5 15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H15C14.558 17.5 14.134 17.3244 13.8215 17.0118C13.5089 16.6993 13.3333 16.2754 13.3333 15.8333V13.3333C13.3333 12.8913 13.5089 12.4674 13.8215 12.1548C14.134 11.8423 14.558 11.6667 15 11.6667H17.5V15.8333ZM2.5 15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H5C5.44203 17.5 5.86595 17.3244 6.17851 17.0118C6.49107 16.6993 6.66667 16.2754 6.66667 15.8333V13.3333C6.66667 12.8913 6.49107 12.4674 6.17851 12.1548C5.86595 11.8423 5.44203 11.6667 5 11.6667H2.5V15.8333Z"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const userSvg = (props) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Tour user">
        <path
          id="Vector"
          d="M11.7857 18.125V16.9642C11.7857 16.3486 11.5411 15.7581 11.1058 15.3228C10.6704 14.8874 10.08 14.6428 9.46429 14.6428H4.82143C4.20575 14.6428 3.61528 14.8874 3.17993 15.3228C2.74458 15.7581 2.5 16.3486 2.5 16.9642V18.125"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M7.1429 12.3214C8.42499 12.3214 9.46433 11.282 9.46433 9.99993C9.46433 8.71784 8.42499 7.6785 7.1429 7.6785C5.86081 7.6785 4.82147 8.71784 4.82147 9.99993C4.82147 11.282 5.86081 12.3214 7.1429 12.3214Z"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Line 1"
          d="M11.7857 12.3214V7.09823M11.7857 7.09823L11.7857 2.0143C11.7857 1.94804 11.8531 1.9031 11.9143 1.92858L18.5211 4.68142C18.6003 4.71443 18.5962 4.82808 18.5148 4.85522L11.7857 7.09823Z"
          stroke="#444444"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

export const validitySvg = (props) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="ticket clock">
        <path
          id="Subtract"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.87027 1.535C8.02165 1.26878 8.35798 1.17224 8.62752 1.31765L10.3402 2.24161C10.5225 2.33994 10.6361 2.53035 10.6361 2.73745V2.77773C10.6576 3.13472 10.7572 3.48271 10.9278 3.79713C11.0744 4.06411 11.2723 4.29948 11.5101 4.4897C11.7483 4.68013 12.0218 4.82153 12.3148 4.90574C12.6079 4.98996 12.9147 5.01531 13.2176 4.98035C13.5205 4.94539 13.8135 4.85081 14.0797 4.70205C14.2552 4.60395 14.4697 4.60684 14.6425 4.70963L16.3665 5.73501C16.6307 5.89213 16.7202 6.23201 16.5676 6.49885L16.1907 7.15808C15.877 6.95373 15.5415 6.77984 15.1886 6.6406L15.3146 6.42036L14.3296 5.83453C14.0175 5.97097 13.6864 6.06052 13.3468 6.09971C12.8961 6.15172 12.4396 6.114 12.0036 5.98871C11.5676 5.86341 11.1607 5.65304 10.8064 5.36971C10.4521 5.08638 10.1574 4.73571 9.9393 4.33792L9.93827 4.33603C9.72721 3.94759 9.59047 3.52402 9.53419 3.08707L8.57743 2.57092L7.01094 5.32579L10.1171 7.12094C9.77456 7.3381 9.45713 7.59126 9.17009 7.87508L6.45395 6.30532L5.58026 7.84182L2.58548 13.0286L3.55167 13.5753C3.95455 13.4081 4.38466 13.3132 4.82217 13.2959L4.82423 13.2958C5.27561 13.2796 5.72576 13.3525 6.14894 13.5104C6.57212 13.6683 6.96002 13.9081 7.29047 14.216C7.62092 14.5239 7.88743 14.8939 8.07476 15.3049C8.21736 15.6178 8.31196 15.9497 8.3559 16.2895L9.33545 16.8529L9.65273 16.3007C9.94778 16.5325 10.2666 16.7354 10.6049 16.9053L10.0317 17.903C9.95719 18.0326 9.83428 18.1273 9.68998 18.1662C9.54568 18.2052 9.39182 18.1852 9.26225 18.1107L7.54679 17.124C7.39505 17.0401 7.2859 16.888 7.2611 16.7083C7.25812 16.6869 7.25636 16.6652 7.25586 16.6434C7.24454 16.3424 7.17442 16.0464 7.04946 15.7723C6.92355 15.496 6.74442 15.2473 6.52231 15.0403C6.30021 14.8334 6.03949 14.6722 5.75505 14.5661C5.47099 14.4601 5.16885 14.4111 4.86586 14.4218C4.48909 14.4369 4.12024 14.5347 3.7855 14.7083C3.61641 14.796 3.41446 14.7923 3.24868 14.6985L1.53596 13.7295C1.40517 13.6555 1.30936 13.5323 1.26984 13.3873C1.23031 13.2423 1.25035 13.0875 1.32549 12.9574L4.60259 7.28161L5.7237 5.31001C5.73244 5.28967 5.74248 5.26962 5.75384 5.24997C5.76383 5.23269 5.7746 5.21613 5.78607 5.20032L7.87027 1.535Z"
          fill="#444444"
        />
        <g id="Group 5">
          <path
            id="Vector 5"
            d="M12.8718 9.85532V12.5126L14.7475 13.1378"
            stroke="#444444"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Ellipse 10"
            d="M13.1249 7.5C15.5412 7.5 17.4999 9.45875 17.4999 11.875C17.4999 14.2912 15.5412 16.25 13.1249 16.25C11.9379 16.25 10.8613 15.7773 10.0731 15.0098C9.70246 14.6489 9.39561 14.2229 9.17104 13.7502"
            stroke="#444444"
            strokeLinecap="round"
          />
          <circle
            id="Ellipse 11"
            cx="13.125"
            cy="11.875"
            r="4.375"
            stroke="#444444"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="0.47 1.22"
          />
        </g>
      </g>
    </svg>
  );
};

export const descriptorIcons = {
  RETURN_TRANSFERS: transferSvg,
  FREE_CANCELLATION: cancelSvg,
  DURATION: clockSvg,
  INSTANT_CONFIRMATION: quickSvg,
  MOBILE_TICKET: phoneSvg,
  SKIP_THE_LINE: skipSvg,
  HOTEL_PICKUP: hotelSvg,
  MEALS_INCLUDED: foodSvg,
  AUDIO_GUIDE: headphonesSvg,
  GUIDED_TOUR: userSvg,
  EXTENDED_VALIDITY: validitySvg,
};
