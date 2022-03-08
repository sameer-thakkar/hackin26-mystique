import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { SOLEIL, COLORS } from 'const/ui-constants';
import {
  SAFETY_DETAILS_TYPE,
  CLUBBED_SAFETY_TAGS,
  SAFETY_MEASURE_REDIRECT_PAGE_LINK,
} from 'const/index';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import {
  CHEVRON_LEFT_CIRCLE,
  SEE_SAFETY,
  PURPS_RIGHT_ARROW,
} from 'assets/SvgIcons';

import Image from '../UI/Image';

const Slider = dynamic(() => import('../UI/Slider'));

const PitchGrid = styled.div`
  display: grid;
  grid-row-gap: 2rem;
  padding-bottom: 3rem;
  a {
    display: grid;
    grid-template-columns: repeat(2, max-content);
    column-gap: 0.469rem;
    align-items: center;
    color: ${COLORS.PURPS3};
  }
`;

const Section = styled.div`
  display: grid;
  grid-row-gap: 2rem;
`;

const SliderSection = styled.div`
  display: grid;
  position: relative;
  .swiper-container {
    overflow: hidden;
    max-width: calc(${(90 * 2.566) / 6.25}rem - 5rem);
  }
  .next-slide {
    right: -1rem;
  }
  .prev-slide {
    left: -1rem;
  }
  .slide {
    display: grid;
    img {
      width: calc(${(90 * 2.566) / 6.25}rem - 5rem);
      height: 24.625rem;
      object-fit: cover;
    }
  }
  .next-slide {
    left: unset;
    right: -1.25rem;
    svg {
      transform: rotate(180deg);
    }
  }
  .safe-pagination {
    display: none;
    top: 23.75rem;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 768px) {
    margin: 0 -1.5rem;
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
        height: 25rem;
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
  font-size: 0.75rem;
  color: ${COLORS.WHITE};
  line-height: 1.188rem;
  background: ${COLORS.BLACK};
  padding: 0.5rem 1rem;
`;

const Heading = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.5rem;
`;

const Text = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  color: ${COLORS.FOUR_BLACK};
  font-style: normal;
  font-weight: normal;
  font-size: 0.938rem;
  line-height: 1.5rem;
  li {
    list-style-position: inside;
    padding-left: 1.5rem;
    text-indent: -1.5em;
    line-height: 1.625rem;
  }
`;

const Pitch = styled.div`
  display: grid;
  grid-row-gap: 1.5rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right;
  ${Heading} {
    font-size: 1.5rem;
  }
`;

const EmphasizedText = styled.div`
  font-family: ${SOLEIL.FONT_STACK};
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.313rem;
`;

const Content = styled.div`
  display: grid;
  grid-row-gap: 0.5rem;
  height: max-content;
`;

const ImageTextGrid = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: auto auto;
  grid-column-gap: 1.5rem;

  @media (max-width: 768px) {
    grid-column-gap: 1rem;
  }
`;

const Icon = styled.div``;

const HorizontalLine = styled.hr`
  grid-column: 1;
  color: ${COLORS.GREY.G6};
  margin: 1.25rem 0rem;

  @media (max-width: 768px) {
    margin: 0.313rem 0rem;
  }
`;

const renderSafetyDetailsSection = (tags) =>
  Object.entries(strings.SAFE_EXPERIENCE_NEW.MODAL.DETAILS).map(
    ([key, { HEADING, DESCRIPTION }]: any) => (
      <Conditional key={key} if={tags.includes(key)}>
        <ImageTextGrid>
          <Content>
            <EmphasizedText>{HEADING}</EmphasizedText>
            <Text>
              <div dangerouslySetInnerHTML={{ __html: `${DESCRIPTION}` }}></div>
            </Text>
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
      <Icon>{SEE_SAFETY}</Icon>
      <Section>
        <Pitch>
          <Text>{strings.SAFE_EXPERIENCE_NEW.MODAL.SUB_HEADING}</Text>
          <HorizontalLine />
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
      <a
        href={SAFETY_MEASURE_REDIRECT_PAGE_LINK}
        rel="noreferrer"
        target="_blank"
      >
        {strings.MORE_DETAILS} {PURPS_RIGHT_ARROW}
      </a>
    </PitchGrid>
  );
};

export default SafeExperiencesPitch;
