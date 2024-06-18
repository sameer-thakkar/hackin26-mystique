import { SVGProps } from 'react';

const SUV = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.578 11.407H5.422m-3.117 0H2a1 1 0 0 1-1-1v-6c0-.704.57-1.273 1.273-1.273h7.953a1 1 0 0 1 .968.75l.612 2.366a1 1 0 0 0 .968.75H14a1 1 0 0 1 1 1v2.406a1 1 0 0 1-1 1h-.305"
      stroke="#444"
      strokeMiterlimit={10}
    />
    <path
      d="M3.864 13.316a1.59 1.59 0 1 0 0-3.182 1.59 1.59 0 0 0 0 3.182Zm8.272 0a1.59 1.59 0 1 0 0-3.182 1.59 1.59 0 0 0 0 3.182Z"
      stroke="#444"
      strokeMiterlimit={10}
      strokeLinecap="square"
    />
    <path d="M1 7h12M7.5 3v4" stroke="#444" strokeMiterlimit={10} />
  </svg>
);
export default SUV;
