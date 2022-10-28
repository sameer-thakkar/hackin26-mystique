import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';
import {
  SAFETY_DETAILS_IMAGES,
  SAFETY_DETAILS_TYPE,
  CLUBBED_SAFETY_TAGS,
  LANGUAGE_MAP,
} from 'const/index';
import useWindowSize from 'hooks/useWindowSize';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { CHEVRON_LEFT_CIRCLE, Shield } from 'assets/SvgIcons';
import { greyScheme } from 'style/theme';
import { MBContext } from 'contexts/MBContext';
import { getSafetyBannerDocument } from 'utils/prismicUtils';
import { RichText } from 'prismic-reactjs';

import IconCTA, { StyledIconCTA } from './IconCTA';
import Image from './Image';

const Slider = dynamic(() => import('./Slider'));

const PitchGrid = styled.div`
  display: grid;
  grid-row-gap: 48px;
  padding: 0 16px 48px;
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
  color: ${COLORS.BRAND.WHITE};
  line-height: 19px;
  background: ${COLORS.BRAND.BLACK};
  padding: 8px 16px;
`;

const Heading = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
`;

const Text = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  color: ${COLORS.GRAY.G2};
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 24px;
  /* or 160% */
  font-feature-settings: 'ss04' on;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
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
  font-family: ${HALYARD.FONT_STACK};
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
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
  .section-image {
    img {
      border-radius: 2px;
      width: 160px;
      height: 120px;
      object-fit: cover;
    }
  }

  @media (max-width: 768px) {
    grid-column-gap: 16px;
    .section-image {
      img {
        width: 104px;
      }
    }
  }
`;

const _FAQGrid = styled.div`
  display: grid;
  grid-row-gap: 16px;
  margin-bottom: 32px;
  & > div {
    padding-bottom: 12px;
    margin-right: 0;
  }
`;

const SafetyCard = styled.div`
  display: grid;
  padding: 16px;
  grid-column-gap: 24px;
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  grid-template-columns: auto auto;
  align-items: center;
  ${StyledIconCTA} {
    margin-left: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.08);
    padding: 4px 7px;
    padding-left: 18px;
    background: ${COLORS.BRAND.WHITE};
    grid-template-columns: auto;
    svg {
      transform: scale(1.1);
    }
  }
  @media (max-width: 768px) {
    grid-template-columns: auto;
    grid-row-gap: 8px;

    ${Text} {
      font-size: 12px;
      line-height: 20px;
    }
  }
`;

const AttentionStrip = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  padding: 12px 16px;
  border-radius: 4px;
  background-color: ${COLORS.WARNING_RED.LIGHT_TONE_3};
  color: ${COLORS.WARNING_RED.DARK_TONE};
  margin-top: -8px;
  margin-bottom: 8px;
  p {
    display: inline;
    color: inherit;
  }
  a {
    font-size: 12px;
    line-height: 16px;
    display: inline-block;
    text-decoration: underline;
    cursor: pointer;
    color: ${COLORS.WARNING_RED.DARK_TONE};
    @media (max-width: 768px) {
      display: block;
      margin-top: 4px;
    }
  }
`;

const renderSafetyDetailsSection = (tags, lang, isMobile) =>
  Object.entries(strings.SAFE_EXPERIENCE.MODAL.DETAILS).map(
    ([key, { HEADING, DESCRIPTION }]: any) => (
      <Conditional key={key} if={tags.includes(key)}>
        <ImageTextGrid>
          <Content>
            <EmphasizedText>{HEADING}</EmphasizedText>
            <Text>{DESCRIPTION}</Text>
          </Content>
          <div className="section-image">
            <Image
              url={SAFETY_DETAILS_IMAGES[key]}
              height={120}
              width={isMobile ? 104 : 160}
            />
          </div>
        </ImageTextGrid>
      </Conditional>
    )
  );

export const getSafetyDescription = async (countryCode, cityCode, lang?) => {
  const language = LANGUAGE_MAP[lang]?.locale;
  try {
    const options = await getSafetyBannerDocument({ lang: language });
    const selectedSafetyPitch = options?.find((el) => {
      const [, optcountryCode] = el?.country?.split('-');
      if (el?.city?.cityCode === cityCode && optcountryCode === countryCode)
        return true;
      else if (
        (!el?.city && optcountryCode === countryCode) ||
        (el?.city?.cityCode !== cityCode && optcountryCode === countryCode)
      )
        return true;
      return false;
    });

    return selectedSafetyPitch;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const SafeExperiencesPitch = ({
  allTags = [],
  generic = false,
  images = [],
}) => {
  const GENERAL_SAFETY_NOTE = {
    description: [
      {
        spans: [],
        type: 'paragraph',
        text: strings.SAFE_EXPERIENCE.GENERAL_DESCRIPTION,
      },
    ],
    heading: [
      { spans: [], type: 'paragraph', text: strings.SAFE_EXPERIENCE.HEADING },
    ],
  };
  const { lang, primaryCountry, primaryCity } = useContext(MBContext);
  const [safetyBannerData, setSafetyBannerData] = useState(null);
  useEffect(() => {
    getSafetyDescription(primaryCountry?.code, primaryCity, lang).then(
      (data) => {
        data
          ? setSafetyBannerData(data)
          : setSafetyBannerData(GENERAL_SAFETY_NOTE);
      }
    );
  }, []);

  const { width } = useWindowSize();
  const isMobile = width < 768;
  let tags = allTags;
  if (generic) {
    tags = Object.keys(strings.SAFE_EXPERIENCE.MODAL.DETAILS).filter(
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
      <Section>
        <Pitch>
          <Heading>{strings.SAFE_EXPERIENCE.MODAL.HEADING}</Heading>
          <Conditional if={safetyBannerData}>
            <Section>
              <AttentionStrip>
                {strings.SAFE_EXPERIENCE.EU_PREFIX}
                <RichText render={safetyBannerData?.description} />
              </AttentionStrip>
            </Section>
          </Conditional>
          <Text style={{ maxWidth: isMobile ? 'auto' : '82%' }}>
            {strings.SAFE_EXPERIENCE.MODAL.SUB_HEADING}
          </Text>
        </Pitch>
      </Section>
      <Conditional if={generic}>
        <SafetyCard>
          <IconCTA
            text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
            colorScheme={greyScheme}
            icon={Shield}
          />
          <Text>{strings.SAFE_EXPERIENCE.MODAL.BADGE_DESCRIPTION}</Text>
        </SafetyCard>
      </Conditional>

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

      <Section>{renderSafetyDetailsSection(tags, lang, isMobile)}</Section>

      {/* <Section>
        <Heading>{"FAQ's"}</Heading>
        <FAQGrid>
          <Accordion 
            heading={"How does this work?"}
            content={"Similar to a treasury bond, guests can purchase a $100 “hotel bond” directly from the hotels listed on the Buy Now Stay Later website. After a 60 day maturation period, that $100 bond will be worth $150. Basically, spend $100 and receive a gift certificate for $150. It’s as easy as that. And use it when you want! (after the 60 days of course)."}  
          />
        </FAQGrid>
      </Section> */}
    </PitchGrid>
  );
};

export default SafeExperiencesPitch;
