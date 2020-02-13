import React from 'react';
import Image from './Image';
import styled from 'styled-components';

type PrismicImageObject = {
  image_url?: any;
  image_source?: any;
};

type ImageGridProps = {
  cols: number;
  images: Array<PrismicImageObject>;
  lazyLoadImages?: boolean;
};

const StyledImageGrid = styled.div`
  display: grid;
  grid-gap: 1.5em;
  grid-template-columns: repeat(${({ cols }) => cols}, 1fr);
  max-width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageBox = styled.div`
  border-radius: 3px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.18);
  img {
    width: 100%;
    max-width: 100%;
    object-fit: cover;
    height: 350px;
    display: block;
  }
  @media (max-width: 768px) {
    img {
      height: 200px !important;
    }
  }
`;

class ImageGrid extends React.Component<ImageGridProps, any> {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    lazyLoadImages: true,
  };

  render() {
    const { images, cols, lazyLoadImages } = this.props;
    return (
      <StyledImageGrid cols={cols}>
        {images.map((image, index) => (
          <ImageBox key={index}>
            <Image
              dontLazyLoad={!lazyLoadImages}
              width={580}
              height={300}
              format="pjpg"
              url={image.image_url.url || image.image_source.url}
            />
          </ImageBox>
        ))}
      </StyledImageGrid>
    );
  }
}

export default ImageGrid;
