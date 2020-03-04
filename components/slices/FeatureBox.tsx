import React from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Image from '../UI/Image';
import { shortCodeSerializer } from '../../utils/shortCodes';

type FeatureBoxProps = {
  blocks: any[];
  lazyLoad?: boolean;
};

const StyledFeatureBoxWrapper = styled.div`
  display: grid;
  grid-row-gap: 40px;
  line-height: 30px;
`;

const StyledFeatureBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #ebebeb;
  height: 100%;
  grid-column-gap: 40px;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  h3 {
    margin-top: 20px;
  }
  p {
    padding-right: 40px;
  }
  @media (max-width: 768px) {
    grid-template-rows: auto auto;
    grid-template-columns: unset;
    p {
      padding-right: 0;
      padding: 0 10px;
    }
  }
`;

/**
 *
 * A simple feature box consisting of an image and a description
 *
 * ### Non-repeatable zone
 * Nil.
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
 * - Feature Description
 *  - Rich Text field
 */

const FeatureBox: React.FC<FeatureBoxProps> = ({ blocks, lazyLoad }) => (
  <StyledFeatureBoxWrapper>
    {blocks.map((block, index) => {
      const imageURL = block.image_url.url || block.image_source.url;
      return (
        <StyledFeatureBox key={index}>
          <div>
            {imageURL ? (
              <Image
                dontLazyLoad={!lazyLoad}
                height={375}
                width={580}
                url={imageURL}
                alt={`feature-box_${index}`}
              />
            ) : null}
          </div>
          <div>
            <RichText
              key={index}
              render={block.feature_description}
              htmlSerializer={shortCodeSerializer}
            />
          </div>
        </StyledFeatureBox>
      );
    })}
  </StyledFeatureBoxWrapper>
);

export default FeatureBox;
