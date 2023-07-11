import React from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const InteractiveImage = (props: any) => {
  const { src, alt, isMobile } = props;
  const mobileProps = {
    centerContent: false,
    limitToWrapper: true,
  };
  return (
    <div className="interactive-image">
      <TransformWrapper
        scale={isMobile ? 4 : 1}
        options={isMobile ? mobileProps : {}}
      >
        <TransformComponent>
          <div className="zoom-wrapper">
            <img src={src} alt={alt} />
          </div>
        </TransformComponent>
      </TransformWrapper>
      <style jsx global>{`
        .interactive-image img {
          width: 100%;
          height: 80vh;
        }
        .zoom-wrapper {
          width: 80vw;
          height: 100%;
        }
        .react-transform-element {
          cursor: crosshair;
        }
        @media (max-width: 768px) {
          .react-transform-element {
            // transform-origin: -50% -50%;
          }

          .interactive-image {
            display: grid;
            height: 100vh;
          }

          .zoom-wrapper {
            height: 100vh;
            width: 100%;
            display: block;
          }
          .interactive-image img {
            height: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
export default InteractiveImage;
