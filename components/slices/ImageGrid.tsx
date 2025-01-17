import React from 'react';
import styled from 'styled-components';
import Image from 'UI/Image';

type PrismicImageObject = {
  image_url?: any;
  image_alt?: string;
  image_source?: any;
};

type ImageGridProps = {
  cols: number;
  images: Array<PrismicImageObject>;
};

const StyledImageGrid = styled.div<any>`
  display: grid;
  grid-gap: 1.5em;
  grid-template-columns: repeat(
    ${({ colsProp }: { colsProp: number | null }) => colsProp},
    1fr
  );
  max-width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledImageBox = styled.div`
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

/**
 *
 * A simple image grid
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - Number of columns
 *  - Defaults to 1
 *
 * ### Repeatable zone
 * - Image Source
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Image URL
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 *
 * **Note: Either 'Image Source' or 'Image URL' is required and if left blank will break the slice**
 */

const ImageGrid: React.FC<React.PropsWithChildren<ImageGridProps>> = ({
  images,
  cols,
}) => {
  return (
    <StyledImageGrid colsProp={cols}>
      {images.map((image, index) => (
        <StyledImageBox key={index}>
          <Image
            width={580}
            height={300}
            format="pjpg"
            url={image.image_url.url || image.image_source.url}
            alt={image.image_alt || image.image_source.alt}
            loadHigherQualityImage={true}
          />
        </StyledImageBox>
      ))}
    </StyledImageGrid>
  );
};

export default ImageGrid;
