import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import Image from 'UI/Image';
import Conditional from 'components/common/Conditional';
import Carousel from 'components/GlobalMbs/Carousels/Carousel';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';
import { ASPECT_RATIO } from 'const/index';
import { strings } from 'const/strings';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { convertUidToUrl, getValidUrl } from 'utils/urlUtils';
import { getLocalisedPrice } from 'utils/currency';

const StyledCard = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 8px;
  }
  .tag-wrapper {
    display: flex;
  }
  .tag {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px;
    margin-right: 8px;
    padding: 4px 8px;
    color: ${COLORS.GRAY.G3};
    background-color: ${COLORS.GRAY.G7};
    border-radius: 2px;
    &:last-child {
      margin-right: 0;
    }
  }
  .ticket-wrapper {
    display: grid;
    grid-template-rows: repeat(2, max-content);
    row-gap: 4px;
  }
  .from-price {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: ${COLORS.GRAY.G4};
  }
  .from-price span {
    color: ${COLORS.GRAY.G4};
    text-decoration: line-through;
  }
  .final-price {
    font-size: 16px;
    line-height: 16px;
    font-style: normal;
    font-weight: 600;
    color: ${COLORS.GRAY.G3};
  }
  .final-price .discount {
    color: ${COLORS.TEXT.OKAY_GREEN_3};
    background-color: ${COLORS.BACKGROUND.SOOTHING_GREEN};
    border-radius: 2px;
    font-size: 11px;
    line-height: 12px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.2px;
    padding: 2px 4px;
    margin-left: 8px;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${HALYARD.FONT_STACK};
  @media (max-width: 500px) {
    margin-bottom: 24px;
  }
  h2 {
    font-size: 24px;
    font-weight: 600;
    line-height: 28px;
    color: ${COLORS.GRAY.G2};
    margin: 0;
  }
  a {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.2px;
    color: ${COLORS.GRAY.G2};
  }
  svg {
    height: 10px;
    transform: rotate(180deg);
  }
`;

interface ExperienceProps {
  cardsInARow: number;
  experienceType: string;
  mbType?: string;
  showSeeAll: boolean;
  title: string;
  experiencePageUid?: string;
  attractions?: any[];
  rides?: any[];
  tickets?: any;
}

const ExperienceCarousel: FunctionComponent<ExperienceProps> = ({
  cardsInARow = 4,
  experienceType,
  showSeeAll = true,
  title,
  experiencePageUid,
  attractions,
  rides,
  tickets,
}) => {
  const { isDev, host } = useContext(MBContext);

  const entrySection = (
    <HeaderWrapper>
      <h2>{title}</h2>
      {showSeeAll && (
        <a
          href={convertUidToUrl({
            // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
            uid: experiencePageUid,
            isDev,
            hostname: host,
          })}
        >
          {strings.SEE_ALL} {CHEVRON_LEFT}
        </a>
      )}
    </HeaderWrapper>
  );

  let cards;

  switch (experienceType) {
    case 'Attractions':
      cards = attractions?.map((a) => a);
      break;
    case 'Rides':
      cards = rides?.map((a) => a);
      break;
    case 'Tickets':
      cards = tickets?.data ?? [];
  }

  let ridesAttractionMarkup, ticketsMarkup;
  const { GLOBAL_MB: globalMbAR } = ASPECT_RATIO;

  if (experienceType === 'Attractions' || experienceType === 'Rides') {
    ridesAttractionMarkup = cards?.map((card: any, index: number) => {
      const {
        age_group: ageGroup,
        experience_tags: experienceTags,
        experience_image: { url: imageUrl },
        image_alt_text: altText,
        name,
      } = card;
      const ageGroupTag = ageGroup ? ageGroup?.split(',') : null;
      const experienceTag = experienceTags ? experienceTags?.split(',') : null;
      const experienceTagMarkup = experienceTag?.map(
        (tag: any, index: number) => (
          <div key={`exp-${index}`} className="tag">
            {tag}
          </div>
        )
      );
      const ageGroupMarkup = ageGroupTag?.map((tag: any, index: number) => (
        <div key={`age-${index}`} className="tag">
          {tag}
        </div>
      ));
      return (
        <div key={index} className="swiper-slide">
          <StyledCard key={index}>
            <Image
              url={imageUrl}
              className="image"
              alt={altText}
              aspectRatio={globalMbAR}
              autoCrop={false}
            />
            <div className="title">{name}</div>
            <div className="tag-wrapper">
              <Conditional if={experienceTag?.length}>
                {experienceTagMarkup}
              </Conditional>
              <Conditional if={ageGroupTag?.length}>
                {ageGroupMarkup}
              </Conditional>
            </div>
          </StyledCard>
        </div>
      );
    });
  }
  if (experienceType === 'Tickets') {
    ticketsMarkup = cards?.map((card: any, index: number) => {
      const {
        name,
        imageUrl,
        image_alt_text: altText,
        listingPrice: {
          originalPrice,
          finalPrice,
          bestDiscount,
          cashbackType,
          currencyCode,
        },
      } = card;
      return (
        <div key={index} className="swiper-slide">
          <StyledCard>
            <Image
              url={getValidUrl(imageUrl)}
              className="image"
              alt={altText}
              aspectRatio={globalMbAR}
              autoCrop={false}
            />
            <div className="title">{name}</div>
            <Conditional if={card?.listingPrice}>
              <div className="price-wrapper">
                <Conditional if={originalPrice > finalPrice}>
                  <div className="from-price">
                    from{' '}
                    <span>
                      <Conditional if={originalPrice}>
                        {getLocalisedPrice({
                          price: originalPrice,
                          currencyCode,
                        })}
                      </Conditional>
                    </span>
                  </div>
                </Conditional>
                <div className="final-price">
                  <Conditional if={finalPrice}>
                    {getLocalisedPrice({ price: finalPrice, currencyCode })}
                  </Conditional>
                  <Conditional if={bestDiscount > 0}>
                    <span className="discount">
                      {bestDiscount}
                      {cashbackType === 'PERCENTAGE' && '%'}
                    </span>
                  </Conditional>
                </div>
              </div>
            </Conditional>
          </StyledCard>
        </div>
      );
    });
  }

  return (
    <>
      <Conditional if={ticketsMarkup?.length}>
        <Carousel cardsInARow={cardsInARow} entrySection={entrySection}>
          {ticketsMarkup}
        </Carousel>
      </Conditional>
      <Conditional if={ridesAttractionMarkup?.length}>
        <Carousel cardsInARow={cardsInARow} entrySection={entrySection}>
          {ridesAttractionMarkup}
        </Carousel>
      </Conditional>
    </>
  );
};

export default ExperienceCarousel;
