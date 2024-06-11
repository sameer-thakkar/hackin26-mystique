const quickSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.667 1.333L2 9.334h6l-.667 5.334 6.667-8H8l.667-5.333z"
      ></path>
    </svg>
  );
};

const skipSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
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

export const ClockSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 14.667A6.667 6.667 0 108 1.334a6.667 6.667 0 000 13.333z"
      ></path>
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 4v4l4 2"
      ></path>
    </svg>
  );
};

const cancelSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <g
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath="url(#clip0_524_2039)"
      >
        <path d="M7.835 15.588s5.835-2.918 5.835-7.294V3.188L7.835 1 2 3.188v5.106c0 4.376 5.835 7.293 5.835 7.293z"></path>
        <path d="M11.5 5.5l-4.313 5.556L5 8.758"></path>
      </g>
      <defs>
        <clipPath id="clip0_524_2039">
          <path fill="#fff" d="M0 0H16V16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

const transferSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5777 11.4072H5.42183"
        stroke="#444444"
        strokeMiterlimit="10"
      />
      <path
        d="M2.30518 11.4066H2C1.44772 11.4066 1 10.9589 1 10.4066V4.40658C1 3.7034 1.56955 3.13385 2.27273 3.13385H12.9904C13.6936 3.13385 14.2632 3.7034 14.2632 4.40658L14.8837 10.3019C14.9459 10.8923 14.4829 11.4066 13.8892 11.4066H13.6948"
        stroke="#444444"
        strokeMiterlimit="10"
      />
      <path
        d="M3.86373 13.3154C4.74236 13.3154 5.45464 12.6031 5.45464 11.7245C5.45464 10.8459 4.74236 10.1336 3.86373 10.1336C2.98509 10.1336 2.27282 10.8459 2.27282 11.7245C2.27282 12.6031 2.98509 13.3154 3.86373 13.3154Z"
        stroke="#444444"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path
        d="M12.136 13.3157C13.0147 13.3157 13.7269 12.6034 13.7269 11.7248C13.7269 10.8461 13.0147 10.1339 12.136 10.1339C11.2574 10.1339 10.5451 10.8461 10.5451 11.7248C10.5451 12.6034 11.2574 13.3157 12.136 13.3157Z"
        stroke="#444444"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
      <path d="M1 7.58871H15" stroke="#444444" strokeMiterlimit="10" />
      <path
        d="M9.84211 3L10.4451 7.58839"
        stroke="#444444"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

const phoneSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.334 1.333H4.667c-.737 0-1.333.597-1.333 1.334v10.666c0 .737.596 1.334 1.333 1.334h6.667c.736 0 1.333-.597 1.333-1.333V2.667c0-.737-.597-1.333-1.333-1.333zM8 12h.007"
      ></path>
    </svg>
  );
};

export const StartIcon = () => {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <path
        d="M8.167 1.7l2.06 4.173 4.606.674L11.5 9.793l.787 4.587-4.12-2.167-4.12 2.167.786-4.587L1.5 6.547l4.607-.674L8.167 1.7z"
        fill="#FFBC00"
      />
    </svg>
  );
};

export const StarIcon = ({ className = '' }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g>
      <path
        id="Vector"
        d="M9.1875 1.91235L11.505 6.60735L16.6875 7.36485L12.9375 11.0174L13.8225 16.1774L9.1875 13.7399L4.5525 16.1774L5.4375 11.0174L1.6875 7.36485L6.87 6.60735L9.1875 1.91235Z"
        fill="#FE3394"
      />
    </g>
  </svg>
);

export const hotelSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="16"
      fill="none"
      viewBox="0 0 14 16"
    >
      <path
        stroke="#444"
        d="M2.698 6.784A1.667 1.667 0 014.32 5.5h5.36c.774 0 1.446.532 1.623 1.286l.363 1.547H2.333l.365-1.549z"
      ></path>
      <path
        fill="#444"
        d="M3.5 8.834h7v-1h-7v1zm9 2v2h1v-2h-1zm.333 1.666H1.167v1h11.666v-1zM1.5 12.834v-2h-1v2h1zm-.333-.334c.184 0 .333.15.333.334h-1c0 .368.298.666.667.666v-1zm11.333.334c0-.185.15-.334.333-.334v1a.667.667 0 00.667-.666h-1zm-2-4a2 2 0 012 2h1a3 3 0 00-3-3v1zm-7-1a3 3 0 00-3 3h1a2 2 0 012-2v-1z"
      ></path>
      <path
        stroke="#444"
        d="M3.832 10.667a.5.5 0 11-1 0 .5.5 0 011 0zM4.5 2a1 1 0 11-2 0 1 1 0 012 0z"
      ></path>
      <circle cx="10.666" cy="10.666" r="0.5" stroke="#444"></circle>
      <path
        fill="#444"
        d="M5 5.083c0-.322.26-.583.583-.583h2.833c.322 0 .584.261.584.583V5.5H5v-.417z"
      ></path>
      <path stroke="#444" strokeLinecap="round" d="M5.001 11.666h4"></path>
      <path
        stroke="#444"
        d="M9.666 13h2v1a1 1 0 01-1 1v0a1 1 0 01-1-1v-1zM2.333 13h2v1a1 1 0 01-1 1v0a1 1 0 01-1-1v-1z"
      ></path>
    </svg>
  );
};

export const foodSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 3v2.25M8.048 3v2.25M11.095 3v2.25"
      ></path>
      <path
        stroke="#444"
        d="M14.493 7.5c-.043 1.46-.292 2.87-1.082 3.947C12.556 12.614 10.984 13.5 8 13.5c-2.893 0-4.47-.883-5.35-2.057-.808-1.08-1.092-2.491-1.142-3.943h12.985z"
      ></path>
    </svg>
  );
};

export const headphonesSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12V8a6 6 0 1112 0v4"
      ></path>
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 12.667A1.333 1.333 0 0112.667 14H12a1.333 1.333 0 01-1.333-1.333v-2A1.333 1.333 0 0112 9.334h2v3.333zm-12 0A1.333 1.333 0 003.333 14H4a1.333 1.333 0 001.333-1.333v-2A1.333 1.333 0 004 9.334H2v3.333z"
      ></path>
    </svg>
  );
};

export const guidedTourSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.929"
        d="M8.929 14v-.928a1.857 1.857 0 00-1.858-1.858H3.357A1.857 1.857 0 001.5 13.071v.93M5 9.714A1.857 1.857 0 105 6a1.857 1.857 0 000 3.714z"
      ></path>
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeWidth="0.929"
        d="M9 9.5V5.321m0 0V1.282c0-.066.067-.111.129-.086l5.213 2.173a.093.093 0 01-.006.174L9 5.32z"
      ></path>
    </svg>
  );
};

export const validitySvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        stroke="#444"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.667 2.667H3.333C2.597 2.667 2 3.264 2 4v9.334c0 .736.597 1.333 1.333 1.333h9.334c.736 0 1.333-.597 1.333-1.333V4c0-.736-.597-1.333-1.333-1.333zM10.666 1.333V4M5.333 1.333V4M2 6.667h12"
      ></path>
    </svg>
  );
};

export const userSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4785_110723)">
        <path
          d="M16.6673 17.5V15.8333C16.6673 14.9493 16.3161 14.1014 15.691 13.4763C15.0659 12.8512 14.218 12.5 13.334 12.5L6.66732 12.5C5.78326 12.5 4.93542 12.8512 4.31029 13.4763C3.68517 14.1014 3.33398 14.9493 3.33398 15.8333L3.33398 17.5"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.99935 9.16667C11.8403 9.16667 13.3327 7.67428 13.3327 5.83333C13.3327 3.99238 11.8403 2.5 9.99935 2.5C8.1584 2.5 6.66602 3.99238 6.66602 5.83333C6.66602 7.67428 8.1584 9.16667 9.99935 9.16667Z"
          stroke="#444444"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4785_110723">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const descriptorIcons: Record<any, any> = {
  TRANSFERS: transferSvg,
  FREE_CANCELLATION: cancelSvg,
  DURATION: ClockSvg,
  INSTANT_CONFIRMATION: quickSvg,
  MOBILE_TICKET: phoneSvg,
  SKIP_THE_LINE: skipSvg,
  HOTEL_PICKUP: hotelSvg,
  MEALS_INCLUDED: foodSvg,
  AUDIO_GUIDE: headphonesSvg,
  GUIDED_TOUR: guidedTourSvg,
  EXTENDED_VALIDITY: validitySvg,
  USER: userSvg,
};
