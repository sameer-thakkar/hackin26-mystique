import React from 'react';

const CrossIconSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}>
      <path d="M28.94 31.8L.6 60.1c-.77.8-.77 2.08 0 2.86.4.4.92.6 1.44.6.5 0 1.03-.2 1.42-.6L32 34.42l28.54 28.54c.4.4.9.6 1.43.6.5 0 1.03-.2 1.42-.6.78-.78.78-2.06 0-2.85L35.05 31.8 63.4 3.43c.8-.8.8-2.06 0-2.85-.78-.8-2.05-.8-2.84 0L32 29.14 3.44.6C2.64-.2 1.38-.2.6.6c-.8.78-.8 2.05 0 2.84L28.93 31.8z" />
    </svg>
  );
};
export default CrossIconSvg;
