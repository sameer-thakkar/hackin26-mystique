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

export const timerSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.40002 2.5C2.40002 5.59279 4.90723 8.1 8.00002 8.1C11.0928 8.1 13.6 5.59279 13.6 2.5L12.6 2.5C12.6 5.04051 10.5405 7.1 8.00002 7.1C5.45951 7.1 3.40002 5.04051 3.40002 2.5L2.40002 2.5Z"
        fill="#444444"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2C1 1.72386 1.22386 1.5 1.5 1.5L14.5 1.5C14.7761 1.5 15 1.72386 15 2C15 2.27614 14.7761 2.5 14.5 2.5L1.5 2.5C1.22386 2.5 1 2.27614 1 2Z"
        fill="#444444"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.40002 13.6997C2.40002 13.6996 2.40002 13.6998 2.40002 13.6997C2.40002 10.6069 4.90723 8.1 8.00002 8.1C11.0928 8.1 13.6 10.6066 13.6 13.6994C13.6 13.6993 13.6 13.6995 13.6 13.6994L12.6 13.6997C12.6 13.6996 12.6 13.6998 12.6 13.6997C12.6 11.1592 10.5405 9.09941 8.00002 9.09941C5.45951 9.09941 3.40002 11.1589 3.40002 13.6994C3.40002 13.6993 3.40002 13.6995 3.40002 13.6994L2.40002 13.6997Z"
        fill="#444444"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 14.1997C1 14.4758 1.22386 14.6997 1.5 14.6997L14.5 14.6997C14.7761 14.6997 15 14.4758 15 14.1997C15 13.9236 14.7761 13.6997 14.5 13.6997L1.5 13.6997C1.22386 13.6997 1 13.9236 1 14.1997Z"
        fill="#444444"
      />
    </svg>
  );
};

export const busTimeSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.75" cy="3.75" r="2.75" stroke="#444444" />
      <path
        d="M12 2.5V4H11"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 1L4.5 1C3.39543 1 2.5 1.89543 2.5 3L2.5 13C2.5 13.5523 2.94771 14 3.5 14L12.5 14C13.0523 14 13.5 13.5523 13.5 13L13.5 6"
        stroke="#444444"
        strokeLinecap="round"
      />
      <path d="M3 9L13.5 9" stroke="#444444" strokeLinecap="round" />
      <path d="M3 4.5L9 4.5" stroke="#444444" strokeLinecap="round" />
      <path d="M10 11.5H11.5" stroke="#444444" strokeLinecap="round" />
      <path d="M4.5 11.5H6" stroke="#444444" strokeLinecap="round" />
      <path
        d="M3.34998 13.5H4.84998V14.75C4.84998 15.1642 4.51419 15.5 4.09998 15.5C3.68576 15.5 3.34998 15.1642 3.34998 14.75V13.5Z"
        fill="#444444"
      />
      <path
        d="M11.5 13.5H13V14.75C13 15.1642 12.6642 15.5 12.25 15.5C11.8358 15.5 11.5 15.1642 11.5 14.75V13.5Z"
        fill="#444444"
      />
    </svg>
  );
};

export const calendarSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 9.5V3.91634C14 3.17996 13.403 2.58301 12.6667 2.58301L3.33333 2.58301C2.59695 2.58301 2 3.17996 2 3.91634L2 13.2497C2 13.9861 2.59695 14.583 3.33333 14.583L10.5 14.583"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 1.25V3.91667"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.33334 1.25V3.91667"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.58301L14 6.58301"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11.75" cy="11.8506" r="3" stroke="#444444" />
      <path
        d="M11.4773 10.4863V12.1227H13.1137"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const foodDrinkSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 1.5V5C6.5 6.10457 5.60457 7 4.5 7H4.25M2 1.5L2 5C2 6.10457 2.89543 7 4 7H4.25M4.25 7L4.25 14.6125M4.25 1.5V5"
        stroke="#444444"
        strokeLinecap="round"
      />
      <path d="M11 7.19336L11 14.5001" stroke="#444444" strokeLinecap="round" />
      <path
        d="M9.37399 2.55272C9.66142 1.91216 10.2981 1.5 11.0002 1.5V1.5C11.7023 1.5 12.339 1.91216 12.6264 2.55272L12.7429 2.81229C13.2222 3.88045 13.1965 5.10738 12.6729 6.15454V6.15454C12.5598 6.38092 12.3894 6.57385 12.1788 6.71425L12.0238 6.81763C11.404 7.23084 10.5965 7.23084 9.97666 6.81763L9.82158 6.71425C9.61099 6.57385 9.44067 6.38092 9.32748 6.15454V6.15454C8.8039 5.10738 8.77822 3.88045 9.25752 2.81229L9.37399 2.55272Z"
        stroke="#444444"
      />
    </svg>
  );
};

export const carSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.87847 4.40782C3.06544 3.47297 3.88627 2.80005 4.83963 2.80005L11.1604 2.80005C12.1138 2.80005 12.9346 3.47297 13.1216 4.40782L13.6 6.80005L2.40002 6.80005L2.87847 4.40782Z"
        stroke="#444444"
      />
      <path
        d="M0.800049 8.80005C0.800049 7.69548 1.69548 6.80005 2.80005 6.80005L13.2 6.80005C14.3046 6.80005 15.2 7.69548 15.2 8.80005V12.2C15.2 12.3105 15.1105 12.4 15 12.4L1.00005 12.4C0.889592 12.4 0.800049 12.3105 0.800049 12.2L0.800049 8.80005Z"
        stroke="#444444"
      />
      <path d="M6.5 9.5L9.5 9.5" stroke="#444444" strokeLinecap="round" />
      <path
        d="M1 12.5L1 13.535C1 14.1066 1.46337 14.57 2.03496 14.57V14.57C2.60655 14.57 3.06992 14.1066 3.06992 13.535V12.5"
        stroke="#444444"
      />
      <path
        d="M13 12.5V13.535C13 14.1066 13.4634 14.57 14.035 14.57V14.57C14.6065 14.57 15.0699 14.1066 15.0699 13.535V12.5"
        stroke="#444444"
      />
      <path
        d="M2.5 6H1"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 6H13.5"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.75 8.825C2.51528 8.825 2.325 9.01528 2.325 9.25V10.1C2.325 10.3347 2.51528 10.525 2.75 10.525H4.025C4.49444 10.525 4.875 10.1444 4.875 9.675C4.875 9.20556 4.49444 8.825 4.025 8.825H2.75Z"
        stroke="#444444"
        strokeWidth="0.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 8.825C13.4847 8.825 13.675 9.01528 13.675 9.25V10.1C13.675 10.3347 13.4847 10.525 13.25 10.525H11.975C11.5056 10.525 11.125 10.1444 11.125 9.675C11.125 9.20556 11.5056 8.825 11.975 8.825H13.25Z"
        stroke="#444444"
        strokeWidth="0.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const attractionSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.87033 1.58343C7.94938 1.53261 8.05083 1.53261 8.12989 1.58343L14.3126 5.55812C14.5141 5.68765 14.4224 6 14.1829 6H1.81717C1.57763 6 1.48589 5.68764 1.68739 5.55812L7.87033 1.58343Z"
        stroke="#444444"
      />
      <path d="M1.5 14.5H14.5" stroke="#444444" strokeLinecap="round" />
      <path d="M12.5 12.5V8" stroke="#444444" strokeLinecap="round" />
      <path d="M6.5 12.5V8" stroke="#444444" strokeLinecap="round" />
      <path d="M9.5 12.5V8" stroke="#444444" strokeLinecap="round" />
      <path d="M3.5 12.5V8" stroke="#444444" strokeLinecap="round" />
    </svg>
  );
};

export const locationSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 6.6665C14 11.3332 8 15.3332 8 15.3332C8 15.3332 2 11.3332 2 6.6665C2 5.0752 2.63214 3.54908 3.75736 2.42386C4.88258 1.29864 6.4087 0.666504 8 0.666504C9.5913 0.666504 11.1174 1.29864 12.2426 2.42386C13.3679 3.54908 14 5.0752 14 6.6665Z"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.6665C9.10457 8.6665 10 7.77107 10 6.6665C10 5.56193 9.10457 4.6665 8 4.6665C6.89543 4.6665 6 5.56193 6 6.6665C6 7.77107 6.89543 8.6665 8 8.6665Z"
        stroke="#444444"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const discoSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_1444_89329"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="2"
        y="3"
        width="12"
        height="11"
      >
        <path
          d="M13 8.66658C13 11.1979 10.7614 13.2499 8 13.2499C5.23857 13.2499 3 11.1979 3 8.66658C3 6.13528 5.23857 4.08325 8 4.08325C10.7614 4.08325 13 6.13528 13 8.66658Z"
          fill="#111111"
          stroke="#444444"
          strokeWidth="0.729166"
        />
      </mask>
      <g mask="url(#mask0_1444_89329)">
        <path
          d="M3.83331 5.75L4.99695 5.98273C6.97934 6.37921 9.02061 6.37921 11.003 5.98273L12.1666 5.75"
          stroke="#444444"
          strokeWidth="0.729166"
          strokeLinecap="round"
        />
        <path
          d="M3.83331 11.1667L4.99695 11.3995C6.97934 11.796 9.02061 11.796 11.003 11.3995L12.1666 11.1667"
          stroke="#444444"
          strokeWidth="0.729166"
          strokeLinecap="round"
        />
        <path
          d="M3 8.25L3.15776 8.30259C6.30091 9.3503 9.69908 9.3503 12.8422 8.30259L13 8.25"
          stroke="#444444"
          strokeWidth="0.729166"
          strokeLinecap="round"
        />
        <path
          d="M8.41663 13.6665L8.74882 13.2451C10.9617 10.4377 10.8212 6.44211 8.41663 3.79708V3.79708"
          stroke="#444444"
          strokeWidth="0.729166"
          strokeLinecap="round"
        />
        <path
          d="M7.58325 13.5361L7.25106 13.1147C5.03819 10.3073 5.17868 6.31173 7.58325 3.6667V3.6667"
          stroke="#444444"
          strokeWidth="0.729166"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M13 8.6665C13 11.4279 10.7614 13.6665 8 13.6665C5.23857 13.6665 3 11.4279 3 8.6665C3 5.90508 5.23857 3.6665 8 3.6665C10.7614 3.6665 13 5.90508 13 8.6665Z"
        stroke="#444444"
        strokeWidth="0.729166"
      />
      <path
        d="M8 3.66667V2"
        stroke="#444444"
        strokeWidth="0.729166"
        strokeLinecap="round"
      />
      <path
        d="M11.8601 0.758086C11.9049 0.659559 12.0448 0.659559 12.0896 0.758086L12.4132 1.47005C12.4367 1.52179 12.4782 1.56325 12.5299 1.58677L13.2419 1.91039C13.3404 1.95517 13.3404 2.09512 13.2419 2.13991L12.5299 2.46353C12.4782 2.48704 12.4368 2.52851 12.4132 2.58024L12.0896 3.29221C12.0448 3.39073 11.9049 3.39073 11.8601 3.29221L11.5365 2.58024C11.513 2.52851 11.4715 2.48704 11.4198 2.46353L10.7078 2.13991C10.6093 2.09512 10.6093 1.95517 10.7078 1.91039L11.4198 1.58677C11.4715 1.56325 11.513 1.52179 11.5365 1.47005L11.8601 0.758086Z"
        fill="#444444"
      />
      <path
        d="M14.1503 3.13951C14.2005 3.08508 14.2914 3.11504 14.2994 3.18863L14.3525 3.67749C14.3568 3.71755 14.3761 3.75453 14.4064 3.78107L14.7764 4.10495C14.8321 4.15371 14.8045 4.24536 14.7312 4.25524L14.2171 4.32446C14.18 4.32946 14.1458 4.34727 14.1204 4.37481L13.7689 4.75618C13.7187 4.81061 13.6278 4.78065 13.6198 4.70706L13.5667 4.2182C13.5623 4.17813 13.5431 4.14116 13.5128 4.11462L13.1428 3.79073C13.0871 3.74198 13.1147 3.65032 13.188 3.64045L13.7021 3.57123C13.7392 3.56623 13.7734 3.54842 13.7988 3.52088L14.1503 3.13951Z"
        fill="#444444"
      />
      <path
        d="M2.42153 13.0945C2.45215 13.0271 2.54785 13.0271 2.57847 13.0945L2.79977 13.5814C2.81585 13.6167 2.8442 13.6451 2.87958 13.6612L3.36642 13.8825C3.43379 13.9131 3.43379 14.0088 3.36642 14.0394L2.87958 14.2607C2.8442 14.2768 2.81585 14.3051 2.79977 14.3405L2.57847 14.8274C2.54785 14.8947 2.45215 14.8947 2.42153 14.8274L2.20023 14.3405C2.18415 14.3051 2.1558 14.2768 2.12042 14.2607L1.63358 14.0394C1.56621 14.0088 1.56621 13.9131 1.63358 13.8825L2.12042 13.6612C2.1558 13.6451 2.18415 13.6167 2.20023 13.5814L2.42153 13.0945Z"
        fill="#444444"
      />
    </svg>
  );
};

export const boatSvg = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.50421 9.59391C1.39455 9.30745 1.60606 9 1.9128 9H9.39623C9.46415 9 9.53114 8.98419 9.59189 8.95381L11.4071 8.04619C11.4679 8.01581 11.5349 8 11.6028 8H14.0846C14.3785 8 14.5888 8.28392 14.5031 8.56501L13.094 13.19C13.0379 13.3742 12.868 13.5 12.6755 13.5H3.30049C3.11922 13.5 2.95672 13.3882 2.89191 13.2189L1.50421 9.59391Z"
        stroke="#444444"
        strokeWidth="0.875"
      />
      <path
        d="M8.99957 9H3.43707C3.19545 9 2.99957 8.80412 2.99957 8.5625V6.4375C2.99957 6.19588 3.19545 6 3.43707 6H10.6993C10.8802 6 11.0425 6.11135 11.1076 6.28016L11.7111 7.84602"
        stroke="#444444"
        strokeWidth="0.875"
        strokeLinecap="round"
      />
      <path
        d="M5 3.4375C5 3.19588 5.19588 3 5.4375 3H5.5625C5.80412 3 6 3.19588 6 3.4375V5.5625C6 5.80412 5.80412 6 5.5625 6H5.4375C5.19588 6 5 5.80412 5 5.5625V3.4375Z"
        fill="#444444"
      />
      <rect x="8" y="3" width="1" height="3" rx="0.4375" fill="#444444" />
      <path
        d="M5.5 11C5.5 11.2761 5.27614 11.5 5 11.5C4.72386 11.5 4.5 11.2761 4.5 11C4.5 10.7239 4.72386 10.5 5 10.5C5.27614 10.5 5.5 10.7239 5.5 11Z"
        fill="#444444"
      />
      <path
        d="M7.5 11C7.5 11.2761 7.27614 11.5 7 11.5C6.72386 11.5 6.5 11.2761 6.5 11C6.5 10.7239 6.72386 10.5 7 10.5C7.27614 10.5 7.5 10.7239 7.5 11Z"
        fill="#444444"
      />
      <path
        d="M9.5 11C9.5 11.2761 9.27614 11.5 9 11.5C8.72386 11.5 8.5 11.2761 8.5 11C8.5 10.7239 8.72386 10.5 9 10.5C9.27614 10.5 9.5 10.7239 9.5 11Z"
        fill="#444444"
      />
      <path
        d="M11.5 11C11.5 11.2761 11.2761 11.5 11 11.5C10.7239 11.5 10.5 11.2761 10.5 11C10.5 10.7239 10.7239 10.5 11 10.5C11.2761 10.5 11.5 10.7239 11.5 11Z"
        fill="#444444"
      />
    </svg>
  );
};

const shieldSVG = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.00033 14.6666C8.00033 14.6666 13.3337 11.9999 13.3337 7.99992V3.33325L8.00033 1.33325L2.66699 3.33325V7.99992C2.66699 11.9999 8.00033 14.6666 8.00033 14.6666Z"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const descriptorIcons: Record<any, any> = {
  TRANSFERS: transferSvg,
  FREE_CANCELLATION: cancelSvg,
  FLEXIBLE_CANCELLATION: shieldSVG,
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
  TOTAL_DURATION: timerSvg,
  FREQUENCY: busTimeSvg,
  FIRST_DEPARTURE: calendarSvg,
  LAST_DEPARTURE: calendarSvg,
  FOOD_AND_DRINKS: foodDrinkSvg,
  MODE_OF_TRANSPORT: carSvg,
  ATTRACTIONS: attractionSvg,
  STARTING_STOP: locationSvg,
  LIVE_ENTERTAINMENT: discoSvg,
  BOAT_TYPE: boatSvg,
};
