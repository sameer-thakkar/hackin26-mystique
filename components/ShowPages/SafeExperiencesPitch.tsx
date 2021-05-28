import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { SOLEIL, COLORS } from 'const/ui-constants';
import {
  SAFETY_DETAILS_TYPE,
  CLUBBED_SAFETY_TAGS,
} from 'const/index';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { CHEVRON_LEFT_CIRCLE, SEE_SAFETY } from 'assets/SvgIcons';

import Image from '../UI/Image';

const Slider = dynamic(() => import('../UI/Slider'));

const PitchGrid = styled.div`
  display: grid;
  grid-row-gap: 48px;
  padding-bottom: 48px;
`;

const Section = styled.div`
  display: grid;
  grid-row-gap: 32px;
`;

const SliderSection = styled.div`
  display: grid;
  position: relative;
  .swiper-container {
    overflow: hidden;
    max-width: calc(${(1440 * 41.06) / 100}px - 80px);
  }
  .next-slide {
    right: -16px;
  }
  .prev-slide {
    left: -16px;
  }
  .slide {
    display: grid;
    img {
      width: calc(${(1440 * 41.06) / 100}px - 80px);
      height: 394px;
      object-fit: cover;
    }
  }
  .next-slide {
    left: unset;
    right: -20px;
    svg {
      transform: rotate(180deg);
    }
  }
  .safe-pagination {
    display: none;
    top: 380px;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 768px) {
    margin: 0 -24px;
    .swiper-container {
      overflow: hidden;
      max-width: 100vw;
    }
    .safe-pagination {
      display: grid;
    }
    .slide {
      display: grid;
      img {
        width: 100%;
        height: 400px;
        object-fit: cover;
      }
    }
    .prev-slide,
    .next-slide {
      display: none;
    }
  }
`;

const Caption = styled.div`
  font-size: 12px;
  color: ${COLORS.WHITE};
  line-height: 19px;
  background: ${COLORS.BLACK};
  padding: 8px 16px;
`;

const Heading = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
`;

const Text = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  color: ${COLORS.FOUR_BLACK};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 19px;
`;

const Pitch = styled.div`
  display: grid;
  grid-row-gap: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
  ${Heading} {
    font-size: 24px;
  }
`;

const EmphasizedText = styled.div`
  font-family: ${SOLEIL.FONT_STACK}
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const Content = styled.div`
  display: grid;
  grid-row-gap: 8px;
  height: max-content;
`;

const ImageTextGrid = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: auto auto;
  grid-column-gap: 24px;

  @media (max-width: 768px) {
    grid-column-gap: 16px;
  }
`;

const Icon = styled.div`
    
`;

const renderSafetyDetailsSection = (tags) =>
  Object.entries(strings.SAFE_EXPERIENCE_NEW.MODAL.DETAILS).map(
    ([key, { HEADING, DESCRIPTION }]: any) => (
      <Conditional key={key} if={tags.includes(key)}>
        <ImageTextGrid>
          <Content>
            <EmphasizedText>{HEADING}</EmphasizedText>
            <Text><div dangerouslySetInnerHTML={{ __html: `${DESCRIPTION}` }}></div></Text>
          </Content>
        </ImageTextGrid>
      </Conditional>
    )
  );

const SafeExperiencesPitch = ({
  allTags = [],
  generic = false,
  images = [],
}) => {
  let tags = allTags;
  if (generic) {
    tags = Object.keys(strings.SAFE_EXPERIENCE_NEW.MODAL.DETAILS).filter(
      (k) => k.indexOf('DEFAULT') > -1
    );
  }
  if (
    tags.includes(SAFETY_DETAILS_TYPE.SAFETY_RESTRICTED_CAPACITY) &&
    tags.includes(SAFETY_DETAILS_TYPE.SAFETY_SOCIAL_DISTANCING)
  ) {
    tags.splice(
      tags.indexOf(SAFETY_DETAILS_TYPE.SAFETY_RESTRICTED_CAPACITY),
      1
    );
  }
  Object.entries(CLUBBED_SAFETY_TAGS).forEach(([, value]) => {
    if (tags.includes(value[0]) && tags.includes(value[1])) {
      tags.splice(tags.indexOf(value[0]), 1);
      tags.splice(tags.indexOf(value[1]), 1);
      tags.push(value[2]);
    }
  });

  return (
    <PitchGrid>
      <Icon>
        {SEE_SAFETY}
      </Icon>
      <Section>
        <Pitch>
          <Heading>{strings.SAFE_EXPERIENCE_NEW.MODAL.HEADING}</Heading>
          <Text>{strings.SAFE_EXPERIENCE_NEW.MODAL.SUB_HEADING}</Text>
        </Pitch>
      </Section>
      <Conditional if={images.length}>
        <SliderSection>
          <Slider
            paginationClass={'safe-pagination'}
            nextButton={CHEVRON_LEFT_CIRCLE}
            prevButton={CHEVRON_LEFT_CIRCLE}
            sliderOptions={{
              pagination: false,
              shouldSwiperUpdate: true,
            }}
          >
            {images.map(({ url, altText, description }, index) => (
              <div className="slide" key={index}>
                <Image url={url} aspectRatio="1:2" alt={altText} height={400} />
                <Conditional if={description}>
                  <Caption>{description}</Caption>
                </Conditional>
              </div>
            ))}
          </Slider>
        </SliderSection>
      </Conditional>
      <Section>{renderSafetyDetailsSection(tags)}</Section>
    </PitchGrid>
  );
};

export default SafeExperiencesPitch;
