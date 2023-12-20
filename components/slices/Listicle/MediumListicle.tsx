import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PrismicRichText } from '@prismicio/react';
import { useWindowWidth } from '@react-hook/window-size';
import Button from 'UI/Button';
import Chevron from 'UI/Chevron';
import Image from 'UI/Image';
import Tags from 'UI/Tags';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import { CANDY_STAR } from 'assets/SvgIcons';
import Pricing from './Pricing';

const CardWrapper = styled.div`
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 8px;
  display: grid;
  padding: 24px;
  font-family: ${HALYARD.FONT_STACK};
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const CardTop = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  grid-column-gap: 21px;
  cursor: pointer;
  ${({
    // @ts-expect-error TS(2339): Property 'isActive' does not exist on type 'Pick<D... Remove this comment to see the full error message
    isActive,
  }) =>
    isActive
      ? `  border-bottom: 1px solid ${COLORS.GRAY.G6}; padding-bottom: 24px;`
      : ``}
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .title-section {
    margin-bottom: 24px;
    .rating {
      margin-top: 4px;
    }
  }
  .price-section {
    display: grid;
    grid-auto-flow: column;
    align-items: flex-end;
    margin-top: 40px;
  }
`;

const Rating = styled.div`
  margin-top: 4px;
  color: ${COLORS.TEXT.CANDY_1};
  span {
    color: ${COLORS.GRAY.G3};
  }
`;

const ChevronWrapper = styled.div`
  width: max-content;
  display: flex;
  justify-self: flex-end;
`;

const MobileCardTitleSection = styled.div`
  display: grid;
  grid-auto-flow: column;
  padding: 8px 16px;
`;

const CardTitle = styled.div`
  font-weight: 600;
  font-size: 21px;
  line-height: 28px;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 18px;
  }
`;

const CardBottom = styled.div`
  display: ${({
    // @ts-expect-error TS(2339): Property 'isOpen' does not exist on type 'Pick<Det... Remove this comment to see the full error message
    isOpen,
  }) => {
    if (isOpen) return `grid`;
    return `none`;
  }};
  padding-top: 24px;
  @media (max-width: 768px) {
    padding: 0;
    border-top: 1px solid ${COLORS.GRAY.G6};
  }
`;

const CardBottomContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'summary summary' 'duration theatre' 'pricing cta';
  grid-gap: 24px;
  .summary {
    grid-area: summary;
    * {
      font-family: ${HALYARD.FONT_STACK};
      font-size: 16px;
      line-height: 24px;
      margin-top: 0;
      :last-child {
        margin-bottom: 0;
      }
    }
  }
  .pricing {
    grid-area: pricing;
  }
  .cta {
    grid-area: cta;
  }
  @media (max-width: 768px) {
    padding: 16px;
    grid-template-columns: 1fr;
    grid-template-areas: 'tags' 'summary' 'duration' 'theatre' 'cta';
    grid-row-gap: 16px;
    .tags {
      grid-area: tags;
    }
    .cta {
      margin-top: 0px;
      justify-self: unset;
      width: unset;
      button {
        margin-top: 16px;
        width: 100%;
      }
    }
  }
`;

const DurationInfo = styled.div`
  margin-top: 8px;
  font-size: 16px;
  grid-area: duration;
  div {
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 8px;
  }
`;

const TheatreInfo = styled.div`
  margin-top: 8px;
  grid-area: theatre;
  font-size: 16px;
  div {
    font-weight: 600;
    line-height: 20px;
    margin-bottom: 8px;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: ${COLORS.TEXT.CANDY_1};
`;

const ReadMore = styled(Button)`
  width: ${({
    // @ts-expect-error TS(2339): Property 'fullWidth' does not exist on type 'Pick<... Remove this comment to see the full error message
    fullWidth,
  }) => (fullWidth ? '100%;' : '42%; margin-right: 8px')};
`;

const BookNow = styled(Button)`
  width: ${({
    // @ts-expect-error TS(2339): Property 'fullWidth' does not exist on type 'Pick<... Remove this comment to see the full error message
    fullWidth,
  }) => (fullWidth ? '100%' : '55%')};
`;

type MediumListicleProps = {
  isOpen?: boolean;
  primary: any;
  items: any[];
  currentLanguage: string;
  tourData: any;
};

const MediumListicle: React.FC<MediumListicleProps> = ({
  isOpen: cardOpen = false,
  primary,
  items,
  currentLanguage,
  tourData,
}) => {
  const [isOpen, setIsOpen] = useState(cardOpen || false);
  const [isMobile, setIsMobile] = useState(false);
  const width = useWindowWidth();

  useEffect(() => {
    if (width < 768) {
      setIsMobile(true);
    }
  }, [width]);

  const {
    title,
    tags,
    show_price,
    summary,
    duration,
    theatre_name,
    seating_chart_link,
    read_more_link,
    book_now_link,
  } = primary;

  const image = {
    url: items[0]?.image?.url || tourData?.imageUploads[0]?.url,
    alt: items[0]?.image?.alt || tourData?.imageUploads[0]?.alt,
  };
  const finalTags = tags ? tags.split(',') : [];
  const ratings = {
    avg: tourData?.reviewsDetails.averageRating,
    count: tourData?.reviewCount,
  };

  return (
    <>
      <CardWrapper>
        {isMobile ? (
          <div onClick={() => setIsOpen((c) => !c)} role="button" tabIndex={0}>
            <Image url={image.url} alt={image.alt} height={213} width={341} />
            <MobileCardTitleSection>
              <div className="title-section">
                <CardTitle>{title || tourData?.name}</CardTitle>
                <Rating>
                  {ratings.avg} {CANDY_STAR} <span>({ratings.count})</span>
                </Rating>
              </div>
              {tourData?.listingPrice && show_price ? (
                <Pricing
                  floatRight
                  currentLanguage={currentLanguage}
                  listingPrice={tourData.listingPrice}
                />
              ) : null}
            </MobileCardTitleSection>
          </div>
        ) : (
          // @ts-expect-error TS(2769): No overload matches this call.
          <CardTop onClick={() => setIsOpen((c) => !c)} isActive={isOpen}>
            <Image url={image.url} alt={image.alt} height={192} width={300} />
            <div>
              <div className="title-section">
                <CardTitle>{title || tourData?.name}</CardTitle>
                <Rating>
                  {ratings.avg} {CANDY_STAR} <span>({ratings.count})</span>
                </Rating>
              </div>
              <Tags
                tags={finalTags}
                color={COLORS.GRAY.G3}
                backgroundColor={COLORS.GRAY.G7}
              />
              <div className="price-section">
                {tourData?.listingPrice && show_price ? (
                  <Pricing
                    currentLanguage={currentLanguage}
                    listingPrice={tourData.listingPrice}
                  />
                ) : null}
                <ChevronWrapper>
                  <Chevron isActive={isOpen} />
                </ChevronWrapper>
              </div>
            </div>
          </CardTop>
        )}
        {/* @ts-expect-error TS(2769): No overload matches this call. */}
        <CardBottom isOpen={isOpen}>
          <CardBottomContent>
            <div className="tags">
              {isMobile ? (
                <Tags
                  tags={finalTags}
                  color={COLORS.GRAY.G3}
                  backgroundColor={COLORS.GRAY.G7}
                />
              ) : null}
            </div>
            <div className="summary">
              <PrismicRichText
                field={summary}
                components={shortCodeSerializer}
              />
            </div>
            {duration ? (
              <DurationInfo>
                <div>{strings.DURATION}</div>
                {duration}
              </DurationInfo>
            ) : null}
            {theatre_name ? (
              <TheatreInfo>
                <div>{strings.THEATRE}</div>
                {theatre_name}
                <br />
                {seating_chart_link?.url ? (
                  <StyledLink href={seating_chart_link.url}>
                    Seating Chart
                  </StyledLink>
                ) : null}
              </TheatreInfo>
            ) : null}
            {isMobile ? null : (
              <div className="pricing">
                {tourData?.listingPrice && show_price ? (
                  <Pricing
                    currentLanguage={currentLanguage}
                    listingPrice={tourData.listingPrice}
                  />
                ) : null}
              </div>
            )}
            <div className="cta">
              {read_more_link?.url ? (
                <a
                  href={read_more_link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {/* @ts-expect-error TS(2769): No overload matches this call. */}
                  <ReadMore fullWidth={!book_now_link?.url} paddingSides="0px">
                    {strings.READ_MORE}
                  </ReadMore>
                </a>
              ) : null}
              {book_now_link?.url ? (
                <a
                  href={book_now_link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <BookNow
                    // @ts-expect-error TS(2769): No overload matches this call.
                    fullWidth={!read_more_link?.url}
                    fillType="fillGradient"
                    paddingSides="0px"
                  >
                    {strings.BOOK_NOW_CTA}
                  </BookNow>
                </a>
              ) : null}
            </div>
          </CardBottomContent>
        </CardBottom>
      </CardWrapper>
    </>
  );
};

export default MediumListicle;
