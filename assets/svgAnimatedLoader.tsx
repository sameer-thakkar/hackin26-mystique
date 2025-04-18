const SvgAnimatedLoader = () => {
  return (
    <svg
      width="290"
      height="310"
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <defs>
        <filter id="big-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <linearGradient id="mask-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" stopOpacity="0" />
          <stop offset="50%" stopColor="rgba(0,0,0,0.5)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="rgba(0,0,0,1)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="stroke-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8000FF" />
          <stop offset="45%" stopColor="rgba(128,0,255,0)" />
          <stop offset="55%" stopColor="rgba(128,0,255,0)" />
          <stop offset="100%" stopColor="#8000FF" />
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <path
          d="M 101.676 61.3289 L 101.676 92.4052 C 101.676 96.1209 98.6635 99.1331 94.9478 99.1331 C 92.641 99.1331 90.5254 100.338 89.0395 102.102 C 83.1756 109.065 70.1552 119 50.9329 119 C 34.3273 119 20.7765 107.961 14.3772 100.565 C 12.9936 98.9664 11.0305 97.9391 8.91587 97.9391 C 5.27514 97.9391 2.32374 94.9877 2.32374 91.3469 L 2.32373 61.2651 L 2.32373 30.2525 C 2.32373 26.2811 5.27514 23.0616 8.91587 23.0616 C 11.0305 23.0616 12.9936 22.0342 14.3772 20.4351 C 20.7765 13.0391 34.3273 2 50.9329 2 C 70.8883 2 83.727 14.6036 89.1157 20.6255 C 90.4903 22.1617 92.3959 23.0615 94.4574 23.0616 C 98.4288 23.0616 101.676 26.2811 101.676 30.2525 L 101.676 61.3289 Z"
          stroke="#EAD6FF"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g filter="url(#big-blur)" transform="translate(52,60)">
          <g
            style={{
              animation: 'rotateSvgPageLoaderGroup 3s linear infinite',
            }}
          >
            <circle cx="-15" cy="0" r="20" fill="#E6CCFF" />
            <circle cx="15" cy="0" r="20" fill="#FFA5D3" fillOpacity="0.45" />
          </g>
        </g>
        <path
          d="M 101.676 61.3289 L 101.676 92.4052 C 101.676 96.1209 98.6635 99.1331 94.9478 99.1331 C 92.641 99.1331 90.5254 100.338 89.0395 102.102 C 83.1756 109.065 70.1552 119 50.9329 119 C 34.3273 119 20.7765 107.961 14.3772 100.565 C 12.9936 98.9664 11.0305 97.9391 8.91587 97.9391 C 5.27514 97.9391 2.32374 94.9877 2.32374 91.3469 L 2.32373 61.2651 L 2.32373 30.2525 C 2.32373 26.2811 5.27514 23.0616 8.91587 23.0616 C 11.0305 23.0616 12.9936 22.0342 14.3772 20.4351 C 20.7765 13.0391 34.3273 2 50.9329 2 C 70.8883 2 83.727 14.6036 89.1157 20.6255 C 90.4903 22.1617 92.3959 23.0615 94.4574 23.0616 C 98.4288 23.0616 101.676 26.2811 101.676 30.2525 L 101.676 61.3289 Z"
          stroke="url(#stroke-gradient)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="40 443"
          strokeDashoffset="270"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="483"
          style={{
            animation: 'rotateSvgPageLoaderDashOffset 2s ease-in-out infinite',
          }}
        />
      </g>
    </svg>
  );
};

export default SvgAnimatedLoader;
