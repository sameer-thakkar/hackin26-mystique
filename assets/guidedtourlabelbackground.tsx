const Guidedtourlabelbackground = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="148"
        height="22"
        viewBox="0 0 148 22"
        fill="none"
      >
        <path
          d="M10.5937 19.881L0 0H148L138.819 19.6903C138.163 21.0993 136.749 22 135.194 22H14.1238C12.646 22 11.2886 21.1852 10.5937 19.881Z"
          fill="white"
        />
      </svg>
    );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="151"
      height="24"
      viewBox="0 0 151 24"
      fill="none"
    >
      <path
        d="M9.75183 19.5683L0 0H151L142.629 19.1977C141.357 22.1143 138.478 24 135.296 24H16.912C13.878 24 11.1051 22.2837 9.75183 19.5683Z"
        fill="white"
      />
    </svg>
  );
};
export default Guidedtourlabelbackground;
