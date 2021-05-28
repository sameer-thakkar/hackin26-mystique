import React from 'react';
import styled from 'styled-components';

import Image from '../UI/Image';

const GalleryWrapper = styled.div`
  display: grid;
  grid-template-columns: calc(70% - 10px) 30%;
  grid-gap: 10px;

  .left-image-wrapper {
    height: 490px;
    padding: 5px 0;
  }

  .right-image-wrapper {
    height: 240px;
    padding: 5px 0;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    .left-image-wrapper {
      height: 140px;
    }
    .right-image-wrapper {
      height: 65px;
    }
    img {
      border-radius: 5px;
    }
  }
`;

const Gallery = ({ galleryArray }) => {
  const [first, second, third] = galleryArray;

  return (
    <GalleryWrapper>
      <div className="left-image-wrapper">
        {first ? (
          <Image url={first.url} alt={first.alt || 'Gallery Image'} />
        ) : null}
      </div>
      {second && third ? (
        <div>
          <div className="right-image-wrapper">
            <Image url={second.url} alt={second.alt || 'Gallery Image'} />
          </div>
          <div className="right-image-wrapper">
            <Image url={third.url} alt={third.alt || 'Gallery Image'} />
          </div>
        </div>
      ) : null}
    </GalleryWrapper>
  );
};

export default Gallery;
