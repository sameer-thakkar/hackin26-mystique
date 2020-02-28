import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const InteractiveImage = props => {
  const { src, alt, isMobile } = props;
  const mobileProps = {
    centerContent: false,
    limitToWrapper: true,
  };
  return (
    <div className="interactive-image">
      <TransformWrapper
        scale={isMobile ? 3 : 1}
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
          width: 800px;
          height: auto;
        }
        .zoom-wrap {
          width: 800px;
          height: 400px;
        }
        @media (max-width: 768px) {
          .react-transform-element {
            // transform-origin: -50% -50%;
          }

          .interactive-image {
            display: grid;
            height: 90vh;
          }
          .zoom-wrapper {
            height: calc(100vh - 60px);
            display: block;
            align-items: center;
            justify-content: center;
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
