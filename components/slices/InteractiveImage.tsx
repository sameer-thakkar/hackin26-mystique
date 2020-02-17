import React, { Component } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Image from '../UI/Image';

const InteractiveImage = props => {
  const { src, alt } = props;
  return (
    <div className="interactive-image">
      <TransformWrapper>
        <TransformComponent>
          <img src={src} alt={alt} />
        </TransformComponent>
      </TransformWrapper>
      <style jsx global>{`
        .interactive-image {
          display: grid;
        }
        .interactive-image img {
          max-height: 80vh;
        }
        @media (max-width: 768px) {
          .interactive-image img {
            max-height: 100vh;
            max-width: 100vw;
            object-fit: cover;
          }
        }
      `}</style>
    </div>
  );
};
export default InteractiveImage;
