import React from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import Image from 'UI/Image';
import COLORS from 'const/colors';
import { shortCodeSerializer } from '../../utils/shortCodes';

type FeatureBoxProps = {
  blocks: any[];
  lazyLoad?: boolean;
};

const StyledFeatureBoxWrapper = styled.div`
  display: grid;
  grid-row-gap: 40px;
`;

const StyledFeatureBox = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 6px;
  overflow: hidden;
  height: 100%;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .content {
    padding: 24px 40px;
  }

  h3 {
    margin-top: 0;
  }
  @media (max-width: 768px) {
    grid-template-rows: auto auto;
    grid-template-columns: unset;
    .content {
      padding: 0 10px;
    }
    p {
      padding-right: 0;
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
                priority={!lazyLoad}
                height={375}
                attribution={block.image_source?.copyright}
                width={580}
                url={imageURL}
                alt={block.image_alt || `feature-box_${index}`}
                loadHigherQualityImage={true}
              />
            ) : null}
          </div>
          <div className="content">
            <PrismicRichText
              key={index}
              field={block.feature_description}
              components={shortCodeSerializer}
            />
          </div>
        </StyledFeatureBox>
      );
    })}
  </StyledFeatureBoxWrapper>
);

export default FeatureBox;
