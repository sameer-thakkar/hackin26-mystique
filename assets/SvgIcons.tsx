import COLORS from 'const/colors';
import React from 'react';

export const CHEVRON_LEFT = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.1667 1.66671L5.83332 10L14.1667 18.3334"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CHEVRON_DOWN = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.33329 4.66675L7.99996 11.3334L14.6666 4.66675"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SEARCH_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 17.5L13.875 13.875"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CLOSE_WHITE = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3333 2.66669L2.66663 13.3334"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66663 2.66669L13.3333 13.3334"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const STAR = (color) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.125 1.2749L7.67 4.4049L11.125 4.9099L8.625 7.3449L9.215 10.7849L6.125 9.1599L3.035 10.7849L3.625 7.3449L1.125 4.9099L4.58 4.4049L6.125 1.2749Z"
      fill={color}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LOCATION = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 6.66675C14 11.3334 8 15.3334 8 15.3334C8 15.3334 2 11.3334 2 6.66675C2 5.07545 2.63214 3.54933 3.75736 2.42411C4.88258 1.29889 6.4087 0.666748 8 0.666748C9.5913 0.666748 11.1174 1.29889 12.2426 2.42411C13.3679 3.54933 14 5.07545 14 6.66675Z"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8.66675C9.10457 8.66675 10 7.77132 10 6.66675C10 5.56218 9.10457 4.66675 8 4.66675C6.89543 4.66675 6 5.56218 6 6.66675C6 7.77132 6.89543 8.66675 8 8.66675Z"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TWITTER = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 4.30632C14.5129 4.53544 13.9924 4.67802 13.4601 4.72812C14.0176 4.38987 14.4361 3.85003 14.6359 3.21142C14.1124 3.54052 13.5361 3.76872 12.9348 3.88508C12.6957 3.6062 12.4025 3.38317 12.0746 3.23066C11.7467 3.07816 11.3915 2.99963 11.0324 3.00025C10.6812 3.00003 10.3335 3.07184 10.009 3.21158C9.68457 3.35131 9.38977 3.55623 9.14147 3.81462C8.89318 4.073 8.69626 4.37978 8.56198 4.71741C8.4277 5.05505 8.35869 5.41692 8.3589 5.78232C8.36589 5.99523 8.39315 6.20688 8.44028 6.41419C7.3781 6.35542 6.33944 6.06639 5.39083 5.56562C4.44223 5.06485 3.60462 4.36339 2.93167 3.50618C2.68917 3.92453 2.56261 4.40454 2.56598 4.89309C2.56887 5.34975 2.67742 5.79897 2.88246 6.20273C3.0875 6.60649 3.38298 6.95291 3.7439 7.21268C3.31757 7.21037 2.899 7.0939 2.52846 6.87448V6.91682C2.53109 7.55528 2.74635 8.17305 3.13756 8.66489C3.52877 9.15673 4.07175 9.49222 4.67398 9.61421C4.44778 9.66311 4.21792 9.69144 3.98699 9.6989C3.82422 9.70601 3.66123 9.69179 3.50187 9.65655C3.67361 10.2039 4.00255 10.6833 4.44433 11.0301C4.8861 11.3768 5.41944 11.5742 5.9724 11.5956C5.02917 12.3755 3.8562 12.7927 2.65159 12.7768C2.43359 12.7841 2.21543 12.77 2 12.7345C3.14166 13.5051 4.46217 13.9404 5.82198 13.9945C7.18178 14.0486 8.53037 13.7194 9.7252 13.0416C10.92 12.3639 11.9167 11.3629 12.61 10.1443C13.3032 8.92577 13.6672 7.53496 13.6635 6.11888V5.78067C14.1698 5.35297 14.6192 4.85719 15 4.30632Z"
      fill="white"
    />
  </svg>
);

export const INSTAGRAM = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.9556 5.53498C13.9446 5.04197 13.8472 4.55472 13.6677 4.09542C13.5111 3.69499 13.2734 3.33131 12.9694 3.02729C12.6653 2.72328 12.3017 2.4855 11.9012 2.32895C11.4419 2.14945 10.9547 2.052 10.4617 2.04103C9.80186 2.00024 9.59912 2.00024 7.9964 2.00024C6.39368 2.00024 6.18854 2.00024 5.53114 2.04103C5.03813 2.052 4.55088 2.14945 4.09157 2.32895C3.69164 2.48612 3.32855 2.72436 3.02516 3.02867C2.72178 3.33299 2.48465 3.6968 2.3287 4.09722C2.14921 4.55652 2.05176 5.04377 2.04079 5.53678C2 6.1516 2 6.35674 2 8.00024C2 9.64375 2 9.8081 2.04079 10.4655C2.05176 10.9585 2.14921 11.4458 2.3287 11.9051C2.48526 12.3055 2.72303 12.6692 3.02705 12.9732C3.33107 13.2772 3.69474 13.515 4.09517 13.6715C4.55448 13.851 5.04173 13.9485 5.53474 13.9595C6.15075 14.0002 6.35649 14.0002 8 14.0002C9.64351 14.0002 9.80786 14.0002 10.4653 13.9595C10.9583 13.9485 11.4455 13.851 11.9048 13.6715C12.3053 13.515 12.6689 13.2772 12.973 12.9732C13.277 12.6692 13.5147 12.3055 13.6713 11.9051C13.8508 11.4458 13.9482 10.9585 13.9592 10.4655C14 9.84949 14 9.64375 14 8.00024C14 6.35674 14 6.19239 13.9592 5.53498H13.9556ZM12.8873 10.4235C12.8754 10.8014 12.8062 11.1754 12.6822 11.5326C12.5825 11.7947 12.4284 12.0327 12.2301 12.231C12.0319 12.4293 11.7938 12.5833 11.5317 12.683C11.1745 12.8071 10.8006 12.8762 10.4227 12.8882C9.80666 12.929 9.60092 12.929 7.9988 12.929C6.39668 12.929 6.23233 12.929 5.57493 12.8882C5.19699 12.8762 4.82306 12.8071 4.46586 12.683C4.20371 12.5835 3.96561 12.4295 3.76722 12.2314C3.56883 12.0332 3.41465 11.7952 3.31481 11.5332C3.1905 11.1758 3.12113 10.8017 3.10907 10.4235C3.06828 9.8075 3.06828 9.60176 3.06828 7.99964C3.06828 6.39752 3.06828 6.23317 3.10907 5.57577C3.121 5.19784 3.19016 4.8239 3.31421 4.4667C3.41415 4.20472 3.56837 3.96683 3.76674 3.76866C3.96512 3.57049 4.20317 3.41652 4.46526 3.31685C4.82246 3.19281 5.1964 3.12364 5.57433 3.11171C6.23413 3.07092 6.39608 3.07092 7.9982 3.07092C9.60032 3.07092 9.76467 3.07092 10.4221 3.11171C10.8 3.12364 11.1739 3.19281 11.5311 3.31685C11.7933 3.41649 12.0313 3.57052 12.2296 3.76882C12.4279 3.96712 12.582 4.20517 12.6816 4.4673C12.8059 4.82444 12.875 5.19841 12.8867 5.57637C12.9281 6.19239 12.9281 6.39812 12.9281 8.00024C12.9281 9.60236 12.9281 9.76671 12.8873 10.4235Z"
      fill="white"
    />
    <path
      d="M7.94713 4.81876C7.31576 4.81876 6.69857 5.00598 6.17361 5.35675C5.64865 5.70752 5.23949 6.20608 4.99788 6.78938C4.75627 7.37269 4.69305 8.01454 4.81622 8.63378C4.9394 9.25301 5.24343 9.82182 5.68987 10.2683C6.13631 10.7147 6.70512 11.0187 7.32435 11.1419C7.94358 11.2651 8.58544 11.2019 9.16875 10.9602C9.75205 10.7186 10.2506 10.3095 10.6014 9.78452C10.9521 9.25956 11.1394 8.64237 11.1394 8.011C11.1403 7.59153 11.0584 7.17599 10.8983 6.78826C10.7382 6.40053 10.5031 6.04825 10.2065 5.75163C9.90988 5.45501 9.5576 5.21991 9.16987 5.05982C8.78214 4.89973 8.3666 4.81781 7.94713 4.81876ZM7.94713 10.0816C7.39802 10.0814 6.87146 9.86322 6.48318 9.47495C6.09491 9.08667 5.87671 8.56011 5.87655 8.011C5.86709 7.73332 5.91362 7.45657 6.01336 7.19725C6.1131 6.93792 6.26401 6.70132 6.4571 6.50154C6.65019 6.30176 6.88152 6.14288 7.1373 6.03438C7.39308 5.92587 7.66808 5.86995 7.94593 5.86995C8.22377 5.86995 8.49877 5.92587 8.75455 6.03438C9.01033 6.14288 9.24166 6.30176 9.43475 6.50154C9.62785 6.70132 9.77876 6.93792 9.8785 7.19725C9.97824 7.45657 10.0248 7.73332 10.0153 8.011C10.0151 8.55969 9.79728 9.08589 9.40952 9.4741C9.02176 9.86231 8.49581 10.0808 7.94713 10.0816ZM11.3115 3.95622C11.1189 3.96194 10.9358 4.04101 10.7996 4.17725C10.6633 4.31348 10.5843 4.49661 10.5785 4.6892C10.5785 4.88368 10.6558 5.07019 10.7933 5.20771C10.9308 5.34522 11.1173 5.42248 11.3118 5.42248C11.5063 5.42248 11.6928 5.34522 11.8303 5.20771C11.9678 5.07019 12.0451 4.88368 12.0451 4.6892C12.0497 4.59164 12.0339 4.49419 11.9987 4.40309C11.9634 4.312 11.9096 4.22927 11.8405 4.16021C11.7714 4.09114 11.6887 4.03727 11.5976 4.00204C11.5065 3.96681 11.4091 3.951 11.3115 3.95562V3.95622Z"
      fill="white"
    />
  </svg>
);

export const FACEBOOK = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.35552 14.0002H6.34221V7.99994H5V5.93764H6.34221V4.73758C6.34221 3.01249 6.74487 2.00024 8.52357 2.00024H10V4.06255H9.06045C8.35606 4.06255 8.32224 4.36256 8.32224 4.88759V5.93764H10L9.83196 7.99994H8.35552V14.0002Z"
      fill="white"
    />
  </svg>
);
export const CHEVRON_RIGHT_DEFAULT = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_dd_5078_128212)">
      <circle cx="26" cy="22" r="18" fill="white" />
    </g>
    <path
      d="M22.6667 15.3334L29.3333 22.0001L22.6667 28.6667"
      stroke={COLORS.GRAY.G1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_dd_5078_128212"
        x="0"
        y="0"
        width="52"
        height="52"
        filterUnits="userSpaceOnUse"
        colorInterpolation-filters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_5078_128212"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-1" />
        <feGaussianBlur stdDeviation="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_5078_128212"
          result="effect2_dropShadow_5078_128212"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_5078_128212"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const CHEVRON_LEFT_DEFAULT = (
  <svg
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_dd_5618_123793)">
      <circle r="18" transform="matrix(-1 0 0 1 26 22)" fill="white" />
    </g>
    <path
      d="M29.3335 15.3334L22.6668 22.0001L29.3335 28.6667"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_dd_5618_123793"
        x="0"
        y="0"
        width="52"
        height="52"
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
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_5618_123793"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="-1" />
        <feGaussianBlur stdDeviation="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_5618_123793"
          result="effect2_dropShadow_5618_123793"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_5618_123793"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const CHEVRON_LEFT_CIRCLE = (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#chev_filter0_d)">
      <circle r="16" transform="matrix(-1 0 0 1 20 18)" fill="white" />
    </g>
    <g clipPath="url(#chev_clip0)">
      <path
        d="M23.3333 24.6666L16.6667 17.9999L23.3333 11.3333"
        stroke={COLORS.GRAY.G2}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter
        id="chev_filter0_d"
        x="0"
        y="0"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
      <clipPath id="chev_clip0">
        <rect
          width="16"
          height="16"
          transform="matrix(-1 0 0 1 28 10)"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
);

export const CHEVRON_RIGHT_CIRCLE = (
  <svg
    width="88"
    height="48"
    viewBox="0 0 88 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="6" width="80" height="32" fill="url(#paint0_linear_1215_2305)" />
    <g filter="url(#filter0_dd_1215_2305)">
      <circle cx="64" cy="22" r="16" fill="white" />
    </g>
    <path
      d="M60.6667 15.3334L67.3334 22.0001L60.6667 28.6667"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_dd_1215_2305"
        x="40"
        y="0"
        width="48"
        height="48"
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
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1215_2305"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="0.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_1215_2305"
          result="effect2_dropShadow_1215_2305"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_1215_2305"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_1215_2305"
        x1="60"
        y1="22"
        x2="-5.43868e-07"
        y2="22"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export const POWERED_BY_HEADOUT = (
  <svg
    width="97"
    height="44"
    viewBox="0 0 97 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="0.5"
      y1="0.5"
      x2="0.499998"
      y2="43.5"
      stroke="#E2E2E2"
      strokeLinecap="round"
    />
    <path
      d="M12.9793 16.66C14.9473 16.66 16.3873 15.124 16.3873 12.692V12.676C16.3873 10.244 14.9313 8.788 12.9953 8.788C11.9393 8.788 11.0913 9.252 10.5633 10.036V5.7H9.02731V16.5H10.5633V15.396C11.0913 16.18 11.9393 16.66 12.9793 16.66ZM12.6113 15.316C11.2673 15.316 10.4833 14.308 10.4833 12.82V12.692C10.4833 11.188 11.2993 10.132 12.6113 10.132C13.9073 10.132 14.7393 11.012 14.7393 12.628V12.74C14.7393 14.372 13.8753 15.316 12.6113 15.316ZM16.8918 18.116V19.54H17.6918C19.4998 19.54 20.1558 18.836 20.8438 17.044L23.7398 8.948H22.0758L20.2358 14.58L18.2198 8.948H16.5718L19.4838 16.356C18.8918 17.892 18.6518 18.116 17.6118 18.116H16.8918Z"
      fill="#666666"
    />
    <g clipPath="url(#clip0_419_33)">
      <path
        d="M10.5756 29.6902C11.8781 28.6659 13.7073 27.8024 15.6683 27.8024C17.5268 27.8024 19.0781 28.5634 19.0781 31.461V41.3098H16.4878V32.0756C16.4878 30.422 15.7561 29.9683 14.4829 29.9683C13.0342 29.9683 11.6878 30.6561 10.5902 31.2854V41.3098H8V23.5H9.41951C10.4146 23.5 10.5902 23.7341 10.5902 25.2268V29.6902H10.5756Z"
        fill="#8000FF"
      />
      <path
        d="M23.7903 35.1634C23.922 38.3244 25.3415 39.5098 27.8439 39.5098C29.5561 39.5098 30.7268 38.9537 31.5317 38.2951H32.3659V40.0951C31.4 40.7537 29.9512 41.4707 27.4488 41.4707C23.3805 41.4707 21.1122 38.8805 21.1122 34.6951C21.1122 30.4512 23.7317 27.8024 27.2 27.8024C30.7122 27.8024 32.7756 29.8659 32.7756 34.2415C32.7756 34.5927 32.7463 35.061 32.7463 35.1634H23.7903ZM23.8342 33.4512H30.2C30.1561 30.5683 29.0293 29.5878 27.2 29.5878C25.4585 29.5878 24.1122 30.6268 23.8342 33.4512Z"
        fill="#8000FF"
      />
      <path
        d="M42.3171 39.8463C41.322 40.9146 40.122 41.4707 38.3512 41.4707C35.9366 41.4707 34.1805 40.0951 34.1805 37.5049C34.1805 34.7829 36.3464 33.4512 39.3464 33.4512C40.4878 33.4512 41.3366 33.5829 42.2439 33.8024V32.0463C42.2439 30.4659 41.322 29.7781 39.5659 29.7781C37.9854 29.7781 36.7707 30.261 35.922 30.8756H35.1024V28.9439C36.2732 28.3585 37.7512 27.8024 39.8878 27.8024C43.0488 27.8024 44.8488 28.9439 44.8488 31.8707V41.3098H43.8244C42.8293 41.3244 42.4781 41.0317 42.3171 39.8463ZM42.2439 38.1634V35.339C41.5122 35.1927 40.6927 35.0902 39.7707 35.0902C37.9854 35.0902 36.7122 35.7488 36.7122 37.3585C36.7122 39.0122 37.7512 39.7 39.1854 39.7C40.5903 39.6854 41.4829 39.0268 42.2439 38.1634Z"
        fill="#8000FF"
      />
      <path
        d="M56.2927 39.5098C55.3707 40.6073 53.9512 41.4707 52.122 41.4707C49.3415 41.4707 46.9854 39.4805 46.9854 34.8561C46.9854 29.6317 49.8098 27.8024 52.4878 27.8024C54.3171 27.8024 55.4146 28.3439 56.2781 29.178V23.5H57.6976C58.722 23.5 58.8683 23.7488 58.8683 25.2268V41.3098H57.1561C56.5707 41.3244 56.3659 41.0171 56.2927 39.5098ZM56.2634 37.7829V31.0073C55.5024 30.2902 54.5805 29.8805 53.2049 29.8805C51.4488 29.8805 49.5903 30.8171 49.5903 34.7098C49.5903 38.3537 50.9366 39.539 52.7512 39.539C54.2293 39.5683 55.2683 38.8805 56.2634 37.7829Z"
        fill="#8000FF"
      />
      <path
        d="M61.0195 34.6951C61.0195 30.4512 63.7707 27.8024 67.3854 27.8024C71 27.8024 73.7512 30.4512 73.7512 34.6951C73.7512 38.9244 71 41.4707 67.3854 41.4707C63.7707 41.4707 61.0195 38.9244 61.0195 34.6951ZM71.0878 34.6951C71.0878 31.4902 69.639 29.7634 67.3707 29.7634C65.1317 29.7634 63.6537 31.4902 63.6537 34.6951C63.6537 37.9 65.1317 39.5098 67.3707 39.5098C69.639 39.5098 71.0878 37.9146 71.0878 34.6951Z"
        fill="#8000FF"
      />
      <path
        d="M84.3025 38.1927V28.0073H86.8927V41.3244H85.2683C84.6537 41.3244 84.4049 41.1195 84.3317 39.8171C83.0147 40.7537 81.2732 41.5 79.5171 41.5C77.4244 41.5 75.8732 40.6366 75.8732 37.9439V28.0073H78.4634V37.3439C78.4634 39.0561 79.2976 39.4512 80.5269 39.4512C81.8732 39.4659 83.2342 38.822 84.3025 38.1927Z"
        fill="#8000FF"
      />
      <path
        d="M88.6927 27.9634H90.3025V24.3634H91.8683C92.6732 24.3634 92.922 24.6561 92.922 25.7829L92.8927 27.9634H95.8488V29.7927H92.8927V37.622C92.8927 39.0415 93.4781 39.4512 94.7951 39.4512H95.9951V41.1342C95.5268 41.2366 94.7952 41.3829 93.8878 41.3829C91.6342 41.3829 90.3171 40.4317 90.3171 37.9585V29.7927H88.7073V27.9634H88.6927Z"
        fill="#8000FF"
      />
    </g>
    <defs>
      <clipPath id="clip0_419_33">
        <rect
          width="88.2"
          height="18"
          fill="white"
          transform="translate(8 23.5)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const WHITE_BLIP = (
  <svg
    width="30"
    height="16"
    viewBox="0 0 30 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28.3933 6.53701C26.2828 10.5196 21.0586 12.5051 15.6729 12.5051C11.3943 12.5051 7.18495 11.9361 3.5176 10.299C12.2823 11.2395 20.7703 10.8679 28.3933 6.53701ZM28.3933 4.87663C25.8331 4.1103 23.5266 3.8897 21.1393 3.91292C15.0847 3.95936 8.96096 5.7939 3.5522 8.19739C7.85384 4.35414 14.2544 1.55588 20.6665 1.55588C23.7226 1.55588 27.24 2.86792 28.3933 4.87663ZM29.5696 5.74746C29.5696 1.66038 23.4458 0 19.9515 0C14.4735 0 9.87203 2.00871 5.93944 4.2148C5.69725 3.77358 5.35128 3.69231 4.80925 3.62264C4.00197 3.55298 3.50607 3.51814 2.89484 3.51814C2.22596 3.51814 1.22262 3.56459 0.438411 3.69231C0.0578368 3.76197 -0.0690212 4.06386 0.0347717 4.5283C0.380748 5.7939 0.899713 6.93179 1.58013 8C1.28029 9.04499 1.38408 10.0319 2.24902 10.8447C1.94917 12.0639 1.85691 13.3991 1.90304 14.6067C1.97224 15.106 2.22596 15.2453 2.64113 15.1756C4.18649 14.9318 5.68572 14.3861 6.9889 13.6894C7.31181 13.5152 7.46173 13.3179 7.55399 13.074L11.3713 13.6662C11.9594 14.3048 12.5476 14.8505 13.2626 15.4543C13.7354 15.8026 14.2429 16 14.8656 16C17.645 15.9768 19.9861 15.5588 21.9235 14.8157C22.6847 14.5718 23.2498 13.5501 24.0917 12.1219C25.9599 11.1698 29.5696 9.38171 29.5696 5.74746Z"
      fill="white"
    />
  </svg>
);

export const GLOBE = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.99992 14.6666C11.6818 14.6666 14.6666 11.6818 14.6666 7.99992C14.6666 4.31802 11.6818 1.33325 7.99992 1.33325C4.31802 1.33325 1.33325 4.31802 1.33325 7.99992C1.33325 11.6818 4.31802 14.6666 7.99992 14.6666Z"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.33325 8H14.6666"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99992 1.33325C9.66744 3.15882 10.6151 5.52794 10.6666 7.99992C10.6151 10.4719 9.66744 12.841 7.99992 14.6666C6.3324 12.841 5.38475 10.4719 5.33325 7.99992C5.38475 5.52794 6.3324 3.15882 7.99992 1.33325V1.33325Z"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SHIELD = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      stroke={COLORS.OCEAN_BLUE.DARK_TONE}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CLOSE_BLACK = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" rx="2" fill="black" />
    <path
      d="M17.3333 6.66666L6.66667 17.3333"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66667 6.66666L17.3333 17.3333"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CLOSE_YELLOW = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3333 2.66667L2.66663 13.3333"
      stroke={COLORS.TEXT.HOLA_YELLOW_3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66663 2.66667L13.3333 13.3333"
      stroke={COLORS.TEXT.HOLA_YELLOW_3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const STAR_FULL = ({ fillColor = COLORS.PRIMARY.JOY_MUSTARD }) => (
  <svg id="star-full" viewBox="0 0 475.075 475.075">
    <path
      fill={fillColor}
      d="M475.075,186.573c0-7.043-5.328-11.42-15.992-13.135L315.766,152.6L251.529,22.694c-3.614-7.804-8.281-11.704-13.99-11.704
        c-5.708,0-10.372,3.9-13.989,11.704L159.31,152.6L15.986,173.438C5.33,175.153,0,179.53,0,186.573c0,3.999,2.38,8.567,7.139,13.706
        l103.924,101.068L86.51,444.096c-0.381,2.666-0.57,4.575-0.57,5.712c0,3.997,0.998,7.374,2.996,10.136
        c1.997,2.766,4.993,4.142,8.992,4.142c3.428,0,7.233-1.137,11.42-3.423l128.188-67.386l128.197,67.386
        c4.004,2.286,7.81,3.423,11.416,3.423c3.819,0,6.715-1.376,8.713-4.142c1.992-2.758,2.991-6.139,2.991-10.136
        c0-2.471-0.096-4.374-0.287-5.712l-24.555-142.749l103.637-101.068C472.604,195.33,475.075,190.76,475.075,186.573z"
    />
  </svg>
);

export const STAR_HALF = ({ fillColor = COLORS.PRIMARY.JOY_MUSTARD }) => (
  <svg id="star-half" viewBox="0 0 19 18">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-154.000000, -83.000000)">
        <g transform="translate(154.000000, 83.000000)">
          <path
            d="M9,14.9983037 L9.0015564,14.9973985 L14.2431108,17.7559529 C14.3987732,17.8461423 14.5470236,17.8912363 14.6878595,17.8912363 C14.8361124,17.8912363 14.9491507,17.8367477 15.0269819,17.7277688 C15.1048131,17.61879 15.1437287,17.4853867 15.1437287,17.3275552 C15.1437287,17.2298499 15.1400227,17.1546932 15.1326107,17.1020828 L14.1763976,11.4652717 L18.2125024,7.47441002 C18.4052274,7.27900046 18.5015886,7.09862396 18.5015886,6.93327546 C18.5015886,6.65519292 18.2940421,6.48233168 17.878939,6.41468923 L12.2973307,5.5917145 L9.54125588,0.461218322 C9.40041751,0.153072185 9.22393198,0.00328063965 9.0015564,0.00328063965 L9,0.00328308745 L9,14.9983037 Z"
            fill={COLORS.GRAY.G7}
          />
          <path
            d="M9,14.9983037 L4.25847781,17.7559529 C4.09540338,17.8461423 3.94715547,17.8912363 3.81372913,17.8912363 C3.65806671,17.8912363 3.5413199,17.8367477 3.4634887,17.7277688 C3.38565749,17.61879 3.34674189,17.4853867 3.34674189,17.3275552 C3.34674189,17.2824606 3.35415391,17.2073039 3.36898044,17.1020828 L4.32519099,11.4652717 L0.277968488,7.47441002 C0.0926552745,7.27148267 0,7.09110869 0,6.93327546 C0,6.65519292 0.207547809,6.48233168 0.622649653,6.41468923 L6.20425798,5.5917145 L8.45161899,0.461218322 C8.59212867,0.153791354 8.77830949,0.00398068662 9,0.00328308745 L9,14.9983037 Z"
            id="Combined-Shape"
            fill={fillColor}
          />
        </g>
      </g>
    </g>
  </svg>
);

export const STAR_EMPTY = (
  <svg id="star-empty" viewBox="0 0 475.075 475.075">
    <path
      fill={COLORS.GRAY.G6}
      d="M475.075,186.573c0-7.043-5.328-11.42-15.992-13.135L315.766,152.6L251.529,22.694c-3.614-7.804-8.281-11.704-13.99-11.704
        c-5.708,0-10.372,3.9-13.989,11.704L159.31,152.6L15.986,173.438C5.33,175.153,0,179.53,0,186.573c0,3.999,2.38,8.567,7.139,13.706
        l103.924,101.068L86.51,444.096c-0.381,2.666-0.57,4.575-0.57,5.712c0,3.997,0.998,7.374,2.996,10.136
        c1.997,2.766,4.993,4.142,8.992,4.142c3.428,0,7.233-1.137,11.42-3.423l128.188-67.386l128.197,67.386
        c4.004,2.286,7.81,3.423,11.416,3.423c3.819,0,6.715-1.376,8.713-4.142c1.992-2.758,2.991-6.139,2.991-10.136
        c0-2.471-0.096-4.374-0.287-5.712l-24.555-142.749l103.637-101.068C472.604,195.33,475.075,190.76,475.075,186.573z"
    />
  </svg>
);

export const PIN = (
  <svg
    width="20"
    height="25"
    viewBox="0 0 20 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 10.2466C19 17.2934 10 23.3335 10 23.3335C10 23.3335 1 17.2934 1 10.2466C1 7.84375 1.94821 5.53928 3.63604 3.84017C5.32387 2.14107 7.61305 1.18652 10 1.18652C12.3869 1.18652 14.6761 2.14107 16.364 3.84017C18.0518 5.53928 19 7.84375 19 10.2466Z"
      stroke={COLORS.BRAND.PURPS}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 13.2666C11.6569 13.2666 13 11.9145 13 10.2466C13 8.57867 11.6569 7.22656 10 7.22656C8.34315 7.22656 7 8.57867 7 10.2466C7 11.9145 8.34315 13.2666 10 13.2666Z"
      stroke={COLORS.BRAND.PURPS}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CALENDAR = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
  >
    <path
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.667 2.664H3.333C2.597 2.664 2 3.261 2 3.997v9.334c0 .736.597 1.333 1.333 1.333h9.334c.736 0 1.333-.597 1.333-1.333V3.997c0-.736-.597-1.333-1.333-1.333zM10.667 1.332v2.667M5.333 1.332v2.667M2 6.664h12"
    ></path>
  </svg>
);

export const CIRCLE_TICK = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.3333 9.23333V10C18.3323 11.797 17.7504 13.5456 16.6744 14.9849C15.5984 16.4241 14.086 17.4771 12.3628 17.9866C10.6395 18.4961 8.79768 18.4349 7.11202 17.8122C5.42636 17.1894 3.98717 16.0384 3.00909 14.5309C2.03101 13.0234 1.56645 11.2401 1.68469 9.44693C1.80293 7.6538 2.49763 5.94694 3.66519 4.58089C4.83275 3.21485 6.41061 2.26282 8.16345 1.86679C9.91629 1.47076 11.7502 1.65195 13.3916 2.38333"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3333 3.33334L10 11.675L7.5 9.17501"
      stroke={COLORS.GRAY.G2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CANDY_STAR = (
  <svg
    width="11"
    height="11"
    viewBox="0 0 11 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.5 1L6.8905 3.817L10 4.2715L7.75 6.463L8.281 9.559L5.5 8.0965L2.719 9.559L3.25 6.463L1 4.2715L4.1095 3.817L5.5 1Z"
      fill={COLORS.BRAND.CANDY}
      stroke={COLORS.BRAND.CANDY}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CROSS = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="11.5" stroke={COLORS.BRAND.CANDY} />
    <path
      d="M17 7L7 17"
      stroke={COLORS.BRAND.CANDY}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7L17 17"
      stroke={COLORS.BRAND.CANDY}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CHECK = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986"
      stroke={COLORS.TEXT.OKAY_GREEN_3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 4L12 14.01L9 11.01"
      stroke={COLORS.TEXT.OKAY_GREEN_3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const QUOTES = (
  <svg
    width="47"
    height="38"
    viewBox="0 0 47 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.8287 34.9101L16.8344 34.9044L16.8399 34.8985C18.568 33.0552 19.4186 30.7007 19.4186 27.8778C19.4186 25.27 18.621 23.0796 17.0035 21.3466C15.5115 19.748 13.6238 18.7957 11.366 18.4832C12.1595 14.5696 13.8738 11.2525 16.5063 8.51754C17.4636 7.55865 17.9525 6.40216 17.9525 5.07239C17.9525 3.83761 17.4525 2.78436 16.4911 1.93789C15.5339 0.986069 14.3802 0.5 13.0543 0.5C11.4976 0.5 10.1248 1.10474 8.95414 2.2754L8.94588 2.28366L8.93802 2.29229C3.31418 8.46749 0.5 15.8099 0.5 24.2941C0.5 28.683 1.31973 32.0219 3.051 34.2148L3.05589 34.221L3.06098 34.2271C4.89851 36.4091 7.32195 37.5 10.2851 37.5C12.9031 37.5 15.0976 36.6412 16.8287 34.9101ZM43.8694 34.9101L43.8751 34.9044L43.8806 34.8985C45.6087 33.0552 46.4593 30.7007 46.4593 27.8778C46.4593 25.27 45.6617 23.0796 44.0443 21.3466C42.5522 19.748 40.6645 18.7957 38.4067 18.4832C39.2002 14.5695 40.9146 11.2525 43.5471 8.51751C44.5043 7.55863 44.9932 6.40214 44.9932 5.07239C44.9932 3.83761 44.4932 2.78437 43.5318 1.9379C42.5746 0.986071 41.4209 0.5 40.095 0.5C38.5383 0.5 37.1655 1.10474 35.9949 2.2754L35.9866 2.28366L35.9787 2.29229C30.3549 8.46749 27.5407 15.8099 27.5407 24.2941C27.5407 28.683 28.3605 32.0219 30.0917 34.2148L30.0966 34.221L30.1017 34.2271C31.9392 36.4091 34.3627 37.5 37.3258 37.5C39.9438 37.5 42.1383 36.6412 43.8694 34.9101Z"
      stroke="#F0F0F0"
    />
  </svg>
);

export const Shield = (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.16797 3.9L13.0013 0V26C13.0013 26 2.16797 20.8 2.16797 13V3.9Z"
      fill="#61DE56"
    />
    <path
      d="M23.834 3.9L13.0007 0V26C13.0007 26 23.834 20.8 23.834 13V3.9Z"
      fill="#13C37B"
    />
  </svg>
);

export const AudioGuideIcon = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.5 11.75c0 6.49-5.26 11.75-11.75 11.75S0 18.24 0 11.75 5.26 0 11.75 0 23.5 5.26 23.5 11.75zM12 5.5A5.5 5.5 0 006.5 11v.833H8a1.833 1.833 0 011.833 1.834v2A1.833 1.833 0 018 17.5h-.667A1.833 1.833 0 015.5 15.667V11a6.5 6.5 0 1113 0v4.667a1.833 1.833 0 01-1.833 1.833H16a1.834 1.834 0 01-1.833-1.833v-2A1.833 1.833 0 0116 11.833h1.5V11A5.5 5.5 0 0012 5.5zm5.5 7.333H16a.833.833 0 00-.833.834v2A.834.834 0 0016 16.5h.667a.833.833 0 00.833-.833V12.833zm-11 0V15.667a.833.833 0 00.833.833H8a.833.833 0 00.833-.833v-2A.833.833 0 008 12.833H6.5z"
      fill="#A4563B"
    />
  </svg>
);

export const BrownTicket = (
  <svg width={26} height={26} viewBox="0 0 20 20" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.335.783a1.53 1.53 0 00-2.67 0 1.53 1.53 0 01-2.118.567 1.53 1.53 0 00-2.312 1.335 1.53 1.53 0 01-1.55 1.55A1.53 1.53 0 001.35 6.547a1.53 1.53 0 01-.567 2.118 1.53 1.53 0 000 2.67 1.53 1.53 0 01.567 2.117 1.53 1.53 0 001.335 2.313 1.53 1.53 0 011.55 1.55 1.53 1.53 0 002.312 1.335 1.53 1.53 0 012.118.567 1.53 1.53 0 002.67 0 1.53 1.53 0 012.117-.567 1.53 1.53 0 002.313-1.335 1.53 1.53 0 011.55-1.55 1.53 1.53 0 001.335-2.313 1.53 1.53 0 01.567-2.117 1.53 1.53 0 000-2.67 1.53 1.53 0 01-.567-2.118 1.53 1.53 0 00-1.335-2.312 1.53 1.53 0 01-1.55-1.55 1.53 1.53 0 00-2.313-1.335 1.53 1.53 0 01-2.117-.567zm2.57 6.018a.5.5 0 10-.707-.707l-6.63 6.63a.5.5 0 10.707.708l6.63-6.63zm-6.273-.326a.684.684 0 100 1.368.684.684 0 000-1.368zm-1.684.684a1.684 1.684 0 113.368 0 1.684 1.684 0 01-3.368 0zm6.21 5.21a.684.684 0 111.368 0 .684.684 0 01-1.369 0zm.683-1.684a1.684 1.684 0 100 3.368 1.684 1.684 0 000-3.368z"
      fill="#A4563B"
    />
  </svg>
);

export const BorderedShield = (
  <svg
    width="22"
    height="26"
    viewBox="0 0 22 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 3.9L11.0002 0V26C11.0002 26 0 20.8 0 13V3.9Z" fill="#61DE56" />
    <path
      d="M22 3.9L10.9998 0V26C10.9998 26 22 20.8 22 13V3.9Z"
      fill="#13C37B"
    />
    <path
      d="M1.97949 5.53809L10.9996 2.34009V23.6601C10.9996 23.6601 1.97949 19.3961 1.97949 13.0001V5.53809Z"
      fill="#F0F0F0"
    />
    <path
      d="M20.02 5.53809L10.9999 2.34009V23.6601C10.9999 23.6601 20.02 19.3961 20.02 13.0001V5.53809Z"
      fill="#F0F0F0"
    />
    <path
      d="M3.30029 6.61434L10.9565 3.8999V21.9962C10.9565 21.9962 3.30029 18.3769 3.30029 12.948V6.61434Z"
      fill="#61DE56"
    />
    <path
      d="M18.6118 6.61434L10.9556 3.8999V21.9962C10.9556 21.9962 18.6118 18.3769 18.6118 12.948V6.61434Z"
      fill="#13C37B"
    />
  </svg>
);

export const BackArrow = (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.3333 9.33337L2.33334 9.33337"
      stroke="#444444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.33334 16.3334L2.33334 9.33337L9.33334 2.33337"
      stroke="#444444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const INFO_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="20" rx="10" fill="white" fillOpacity="0.88" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 5.25C9.58579 5.25 9.25 5.58579 9.25 6C9.25 6.41421 9.58579 6.75 10 6.75H10.01C10.4242 6.75 10.76 6.41421 10.76 6C10.76 5.58579 10.4242 5.25 10.01 5.25H10ZM10.75 10C10.75 9.58579 10.4142 9.25 10 9.25C9.58579 9.25 9.25 9.58579 9.25 10V14C9.25 14.4142 9.58579 14.75 10 14.75C10.4142 14.75 10.75 14.4142 10.75 14V10Z"
      fill="black"
    />
  </svg>
);

export const FLAME = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path d="M0.5 13.91H13.5V0.91H0.5V13.91Z" fill="url(#pattern0)" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0" transform="scale(0.015625)" />
      </pattern>
      <image
        id="image0"
        width="64"
        height="64"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const PLAY_CIRCLE = (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40.0003 73.3334C58.4098 73.3334 73.3337 58.4096 73.3337 40.0001C73.3337 21.5906 58.4098 6.66675 40.0003 6.66675C21.5908 6.66675 6.66699 21.5906 6.66699 40.0001C6.66699 58.4096 21.5908 73.3334 40.0003 73.3334Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.333 26.6667L53.333 40.0001L33.333 53.3334V26.6667Z"
      fill="white"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HAPPY_EMOJI = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="#FFF2F8" />
    <path
      d="M24 34C29.5228 34 34 29.5228 34 24C34 18.4772 29.5228 14 24 14C18.4772 14 14 18.4772 14 24C14 29.5228 18.4772 34 24 34Z"
      stroke="#E5006E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 26C20 26 21.5 28 24 28C26.5 28 28 26 28 26"
      stroke="#E5006E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 21H21.01"
      stroke="#E5006E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 21H27.01"
      stroke="#E5006E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GOLDEN_STAR = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="#FFF8EF" />
    <path
      d="M24.25 14.5498L27.34 20.8098L34.25 21.8198L29.25 26.6898L30.43 33.5698L24.25 30.3198L18.07 33.5698L19.25 26.6898L14.25 21.8198L21.16 20.8098L24.25 14.5498Z"
      stroke="#FFBC00"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const VERIFIED = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="#F2FDEB" />
    <g clipPath="url(#clip0)">
      <path
        d="M23.7525 35.3813C23.7525 35.3813 32.505 31.005 32.505 24.4406V16.7822L23.7525 13.5L15 16.7822L15 24.4406C15 31.005 23.7525 35.3813 23.7525 35.3813Z"
        stroke="#088943"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.25 20.25L22.7812 28.5833L19.5 25.1364"
        stroke="#088943"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="translate(12 12)"
        />
      </clipPath>
    </defs>
  </svg>
);

export const HEADPHONE = (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="24" fill="#F8F6FF" />
    <path
      d="M15 30V24C15 21.6131 15.9482 19.3239 17.636 17.636C19.3239 15.9482 21.6131 15 24 15C26.3869 15 28.6761 15.9482 30.364 17.636C32.0518 19.3239 33 21.6131 33 24V30"
      stroke="#6600CC"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33 31C33 31.5304 32.7893 32.0391 32.4142 32.4142C32.0391 32.7893 31.5304 33 31 33H30C29.4696 33 28.9609 32.7893 28.5858 32.4142C28.2107 32.0391 28 31.5304 28 31V28C28 27.4696 28.2107 26.9609 28.5858 26.5858C28.9609 26.2107 29.4696 26 30 26H33V31ZM15 31C15 31.5304 15.2107 32.0391 15.5858 32.4142C15.9609 32.7893 16.4696 33 17 33H18C18.5304 33 19.0391 32.7893 19.4142 32.4142C19.7893 32.0391 20 31.5304 20 31V28C20 27.4696 19.7893 26.9609 19.4142 26.5858C19.0391 26.2107 18.5304 26 18 26H15V31Z"
      stroke="#6600CC"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BLUE_QUOTES = (
  <svg
    width="42"
    height="37"
    viewBox="0 0 42 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38.048 0C38.8213 0 39.4787 0.309334 40.02 0.928001C40.6387 1.46933 40.948 2.088 40.948 2.784C40.948 3.40267 40.6773 4.09867 40.136 4.872C38.048 7.50133 36.424 10.0147 35.264 12.412C34.1813 14.732 33.64 16.6653 33.64 18.212C33.64 18.8307 33.756 19.2947 33.988 19.604C34.22 19.9133 34.6067 20.1067 35.148 20.184C39.324 21.1893 41.412 23.8573 41.412 28.188C41.412 30.5853 40.6387 32.5573 39.092 34.104C37.5453 35.5733 35.5733 36.308 33.176 36.308C30.392 36.308 28.2267 35.38 26.68 33.524C25.1333 31.5907 24.36 29 24.36 25.752C24.36 17.9413 27.9173 9.976 35.032 1.856C36.1147 0.618667 37.12 0 38.048 0ZM13.688 0C14.4613 0 15.1187 0.309334 15.66 0.928001C16.2787 1.46933 16.588 2.088 16.588 2.784C16.588 3.40267 16.3173 4.09867 15.776 4.872C13.688 7.50133 12.064 10.0147 10.904 12.412C9.82133 14.732 9.28 16.6653 9.28 18.212C9.28 18.8307 9.396 19.2947 9.628 19.604C9.86 19.9133 10.2467 20.1067 10.788 20.184C14.964 21.1893 17.052 23.8573 17.052 28.188C17.052 30.5853 16.2787 32.5573 14.732 34.104C13.1853 35.5733 11.2133 36.308 8.816 36.308C6.032 36.308 3.86667 35.38 2.32 33.524C0.773334 31.5907 0 29 0 25.752C0 17.9413 3.55733 9.976 10.672 1.856C11.7547 0.618667 12.76 0 13.688 0Z"
      fill="#CBE4F5"
    />
  </svg>
);

export const RIGHT_ARROW = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 11L8.5 6L3.5 1"
      stroke="#F8F8F8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BLACK_RIGHT_ARROW = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.5 11L8.5 6L3.5 1"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BLACK_CROSS = (
  <svg
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_dd)">
      <circle cx="28" cy="26" r="20" fill="white" />
      <circle cx="28" cy="26" r="19.5" stroke="#E2E2E2" />
    </g>
    <path
      d="M33.3337 20.6667L22.667 31.3334"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.667 20.6667L33.3337 31.3334"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_dd"
        x="0"
        y="0"
        width="56"
        height="56"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="0.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export const ALL_PHOTOS = (
  <svg
    width="75"
    height="24"
    viewBox="0 0 75 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="75" height="24" rx="4" fill="white" />
    <path
      d="M15.5 7.5L8.5 7.5C7.94772 7.5 7.5 7.94772 7.5 8.5L7.5 15.5C7.5 16.0523 7.94772 16.5 8.5 16.5H15.5C16.0523 16.5 16.5 16.0523 16.5 15.5V8.5C16.5 7.94772 16.0523 7.5 15.5 7.5Z"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.25 11C10.6642 11 11 10.6642 11 10.25C11 9.83579 10.6642 9.5 10.25 9.5C9.83579 9.5 9.5 9.83579 9.5 10.25C9.5 10.6642 9.83579 11 10.25 11Z"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 13.5L14 11L8.5 16.5"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.38 15L25.7 8H24.86L22.15 15H23.2L23.74 13.51H26.72L27.27 15H28.38ZM25.23 9.46H25.24L26.41 12.65H24.06L25.23 9.46ZM30.2832 7.5H29.3732V15H30.2832V7.5ZM32.8711 7.5H31.9611V15H32.8711V7.5ZM37.049 10V17.5H37.959V14.46C38.359 14.87 38.939 15.12 39.529 15.12C41.059 15.12 42.049 13.83 42.049 12.51C42.049 11.04 40.989 9.88 39.549 9.88C38.949 9.88 38.319 10.15 37.959 10.67V10H37.049ZM37.959 11.67C38.209 11.05 38.889 10.72 39.429 10.72C40.469 10.72 41.119 11.56 41.119 12.49C41.119 13.35 40.569 14.28 39.409 14.28C38.889 14.28 38.299 14.01 37.959 13.52V11.67ZM44.2188 7.5H43.3088V15H44.2188V11.68C44.5788 11.12 45.1288 10.72 45.7088 10.72C46.1488 10.72 46.4188 10.88 46.5788 11.12C46.8188 11.48 46.8388 12.01 46.8388 12.5V15H47.7487V12.4C47.7487 11.64 47.6388 10.97 47.2988 10.51C47.0088 10.12 46.5488 9.88 45.8488 9.88C45.1788 9.88 44.5888 10.23 44.2188 10.82V7.5ZM51.5032 9.88C50.0432 9.88 48.9532 11.04 48.9532 12.5C48.9532 13.96 50.0432 15.12 51.5032 15.12C52.9632 15.12 54.0532 13.96 54.0532 12.5C54.0532 11.04 52.9632 9.88 51.5032 9.88ZM53.1232 12.5C53.1232 13.47 52.4432 14.28 51.5032 14.28C50.5632 14.28 49.8832 13.47 49.8832 12.5C49.8832 11.53 50.5632 10.72 51.5032 10.72C52.4432 10.72 53.1232 11.53 53.1232 12.5ZM57.6707 10.8V10H56.2707V8.8H55.3607V10H54.6907V10.8H55.3607V13.28C55.3607 13.67 55.4007 14.04 55.5207 14.32C55.7307 14.79 56.1607 15.1 56.8607 15.1C57.1907 15.1 57.5407 15.01 57.7907 14.88L57.5407 14.15C57.3807 14.23 57.1807 14.29 56.9807 14.29C56.4807 14.29 56.3107 13.98 56.2807 13.45C56.2707 13.3 56.2707 13.19 56.2707 13.06V10.8H57.6707ZM60.8977 9.88C59.4377 9.88 58.3477 11.04 58.3477 12.5C58.3477 13.96 59.4377 15.12 60.8977 15.12C62.3577 15.12 63.4477 13.96 63.4477 12.5C63.4477 11.04 62.3577 9.88 60.8977 9.88ZM62.5177 12.5C62.5177 13.47 61.8377 14.28 60.8977 14.28C59.9577 14.28 59.2777 13.47 59.2777 12.5C59.2777 11.53 59.9577 10.72 60.8977 10.72C61.8377 10.72 62.5177 11.53 62.5177 12.5ZM67.6852 10.43C67.2852 10.07 66.7152 9.88 66.1452 9.88C65.3152 9.88 64.5352 10.36 64.5352 11.37C64.5352 12.27 65.3052 12.56 65.9652 12.82C66.4652 13.02 66.9252 13.2 66.9252 13.59C66.9252 14.11 66.5152 14.36 66.0252 14.36C65.6252 14.36 65.2652 14.18 64.9352 13.83L64.2952 14.34C64.6852 14.85 65.3352 15.12 66.0152 15.12C66.9552 15.12 67.8252 14.67 67.8252 13.55C67.8252 12.68 67.0152 12.31 66.3652 12.06C65.8852 11.87 65.4052 11.68 65.4052 11.3C65.4052 10.91 65.6952 10.64 66.1552 10.64C66.4952 10.64 66.9152 10.81 67.1452 11.01L67.6852 10.43Z"
      fill="#444444"
    />
  </svg>
);

export const RED_RIGHT_ARROW = (
  <svg
    width="6"
    height="12"
    viewBox="0 0 6 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 11L5.5 6L0.5 1"
      stroke="#EC1943"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const PURPS_RIGHT_ARROW = (
  <svg
    width="6"
    height="12"
    viewBox="0 0 6 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 11L5.5 6L0.5 1"
      stroke={COLORS.TEXT.PURPS_3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PURPS_TICK_MARK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M14 3.33337L5.75 12L2 8.06065"
      stroke={COLORS.TEXT.PURPS_3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BLACK_COLOR_CLOSE = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3333 2.66663L2.66666 13.3333"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66666 2.66663L13.3333 13.3333"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const STAR_FULL_NEW = ({ fillColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      fill={fillColor}
      d="M7 .512l2.012 4.27 4.5.69-3.256 3.322.768 4.694L7 11.271l-4.024 2.217.768-4.694L.49 5.472l4.5-.69L7 .513z"
    ></path>
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M7 0c.186 0 .356.11.438.285l1.898 4.03 4.246.65a.495.495 0 01.394.349.529.529 0 01-.124.524l-3.071 3.135.724 4.429a.523.523 0 01-.194.5.47.47 0 01-.514.04L7 11.848l-3.797 2.092a.47.47 0 01-.514-.039.523.523 0 01-.195-.5l.725-4.429L.148 5.838a.529.529 0 01-.124-.524.495.495 0 01.394-.349l4.246-.65L6.562.285A.487.487 0 017 0zm0 1.668L5.426 5.009a.49.49 0 01-.367.28l-3.521.54 2.547 2.599a.527.527 0 01.14.453l-.6 3.672 3.148-1.735a.469.469 0 01.454 0l3.149 1.735-.602-3.672a.527.527 0 01.141-.453l2.547-2.6-3.52-.54a.49.49 0 01-.368-.279L7 1.668z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export const STAR_HALF_NEW = ({ fillColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      fill={fillColor}
      d="M7 .512V11.27l-4.024 2.218.768-4.694L.49 5.472l4.5-.69L7 .513z"
    ></path>
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M7 0c.186 0 .356.11.438.285l1.898 4.03 4.246.65a.495.495 0 01.394.349.529.529 0 01-.124.524l-3.071 3.135.724 4.429a.523.523 0 01-.194.5.47.47 0 01-.514.04L7 11.848l-3.797 2.092a.47.47 0 01-.514-.039.523.523 0 01-.195-.5l.725-4.429L.148 5.838a.529.529 0 01-.124-.524.495.495 0 01.394-.349l4.245-.65 1.9-4.03A.487.487 0 017 0zm0 1.668L5.426 5.009a.49.49 0 01-.367.28l-3.521.54 2.547 2.599a.527.527 0 01.14.453l-.6 3.672 3.148-1.735a.469.469 0 01.454 0l3.149 1.735-.602-3.672a.527.527 0 01.141-.453l2.547-2.6-3.52-.54a.49.49 0 01-.368-.279L7 1.668z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export const STAR_EMPTY_NEW = ({ fillColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 14 14"
  >
    <path
      fill={fillColor}
      fillRule="evenodd"
      d="M7 0c.186 0 .356.11.438.285l1.898 4.03 4.246.65a.495.495 0 01.394.349.529.529 0 01-.124.524l-3.071 3.135.724 4.429a.523.523 0 01-.194.5.47.47 0 01-.514.04L7 11.848l-3.797 2.092a.47.47 0 01-.514-.039.523.523 0 01-.195-.5l.725-4.429L.148 5.838a.529.529 0 01-.124-.524.495.495 0 01.394-.349l4.245-.65 1.9-4.03A.487.487 0 017 0zm0 1.668L5.426 5.009a.49.49 0 01-.367.28l-3.521.54 2.547 2.599a.527.527 0 01.14.453l-.6 3.672 3.148-1.735a.469.469 0 01.454 0l3.149 1.735-.602-3.672a.527.527 0 01.141-.453l2.547-2.6-3.52-.54a.49.49 0 01-.368-.279L7 1.668z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export const CHEVRON_RIGHT = ({ fillColor }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="6"
    height="10"
    fill="none"
    viewBox="0 0 6 10"
  >
    <path
      stroke={fillColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="0.976"
      d="M1 9l4-4-4-4"
    ></path>
  </svg>
);

export const PERCENTAGE = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M12.6666 3.33334L3.33331 12.6667"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.33335 5.99999C5.25383 5.99999 6.00002 5.2538 6.00002 4.33332C6.00002 3.41285 5.25383 2.66666 4.33335 2.66666C3.41288 2.66666 2.66669 3.41285 2.66669 4.33332C2.66669 5.2538 3.41288 5.99999 4.33335 5.99999Z"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 13.3333C12.5871 13.3333 13.3333 12.5871 13.3333 11.6667C13.3333 10.7462 12.5871 10 11.6667 10C10.7462 10 10 10.7462 10 11.6667C10 12.5871 10.7462 13.3333 11.6667 13.3333Z"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloseIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.3334 2.66669L2.66669 13.3334"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66669 2.66669L13.3334 13.3334"
      stroke="#444444"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const VIDEO_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
  >
    <path
      d="M26.8327 8.16797L18.666 14.0013L26.8327 19.8346V8.16797Z"
      fill="white"
    />
    <path
      d="M16.3327 5.83203H3.49935C2.21068 5.83203 1.16602 6.8767 1.16602 8.16536V19.832C1.16602 21.1207 2.21068 22.1654 3.49935 22.1654H16.3327C17.6213 22.1654 18.666 21.1207 18.666 19.832V8.16536C18.666 6.8767 17.6213 5.83203 16.3327 5.83203Z"
      fill="white"
    />
  </svg>
);

export const RadioIcon = ({ isActive, ...props }) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx={10}
      cy={10}
      {...(!isActive
        ? { stroke: COLORS.GRAY.G5, r: 9 }
        : { fill: COLORS.BRAND.PURPS, r: 10 })}
    />
    <circle cx={10} cy={10} r={4} fill="#fff" />
  </svg>
);

export const GlobeIcon = (props) => (
  <svg
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g
      clipPath="url(#a)"
      stroke="#666"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 14.667A6.667 6.667 0 1 0 8 1.334a6.667 6.667 0 0 0 0 13.333ZM1.333 8h13.333" />
      <path d="M8 1.333A10.2 10.2 0 0 1 10.666 8 10.2 10.2 0 0 1 8 14.667 10.2 10.2 0 0 1 5.333 8 10.2 10.2 0 0 1 8 1.333v0Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const PLAY_BUTTON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
  >
    <path
      d="M36.001 65.9981C52.5695 65.9981 66.001 52.5666 66.001 35.998C66.001 19.4295 52.5695 5.99805 36.001 5.99805C19.4324 5.99805 6.00098 19.4295 6.00098 35.998C6.00098 52.5666 19.4324 65.9981 36.001 65.9981Z"
      fill="black"
      fillOpacity="0.4"
      stroke="#E2E2E2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M29.999 23.998L47.999 35.998L29.999 47.998V23.998Z"
      stroke="#F8F8F8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
