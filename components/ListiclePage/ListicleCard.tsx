import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import { PIN } from '../../assets/SvgIcons';
import { Client } from '../../config/prismic-config';
import { CUSTOM_TYPES } from '../../constants';
import { shortCodeSerializer } from '../../utils/shortCodes';
import Button from '../UI/Button';
import Chevron from '../UI/Chevron';
import Rating from '../UI/Rating';
import Tags from '../UI/Tags';

const Popup = dynamic(() => import('components/common/Popup'), { ssr: false });

const CardWrapper = styled.div`
  border: 1px solid #ebebeb;
  max-width: 792px;
  display: grid;
  color: #545454;
  font-family: ${HALYARD.FONT_STACK};
  margin-top: 24px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CardTop = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 160px;
  display: grid;
  grid-template-columns: 290px auto auto;
  grid-column-gap: 24px;
  cursor: pointer;
  ${({ isActive }) => (isActive ? `  border-bottom: 1px solid #ebebeb;` : ``)}
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .title-section {
    display: grid;
    padding-top: 24px;
    grid-template-rows: repeat(3, max-content);
    grid-row-gap: 8px;
    .rating {
      margin-bottom: 8px;
    }
  }
  .price-section {
    justify-self: flex-end;
    padding: 24px 24px 0 0;
    display: grid;
    grid-template-rows: repeat(2, max-content);
    grid-row-gap: 40px;
  }
`;

const MobileCardTop = styled.div<{ imageUrl: string }>`
  background-image: url(${(props) => props.imageUrl});
  background-repeat: no-repeat;
  background-size: cover;
  height: 223px;
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  .rating {
    height: max-content;
    padding: 5px 7px 7px 7px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 2px;
    justify-self: flex-end;
  }
`;

const MobileCardTitleSection = styled.div`
  display: grid;
  grid-auto-flow: column;
  padding: 16px;
`;

const CardTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 18px;
  }
`;

const Pricing = styled.div`
  div {
    color: #939393;

    font-size: 14px;
    line-height: 16px;
    display: flex;
    justify-content: flex-end;
    font-weight: 400;
  }
  width: max-content;
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  @media (max-width: 768px) {
    display: flex;
    justify-self: flex-end;
    align-items: center;
    div {
      align-items: center;
      margin-right: 6px;
    }
  }
`;

const ChevronWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CardBottom = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => {
    if (isOpen) return `grid`;
    return `none`;
  }};
  padding: 24px;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const CardBottomContent = styled.div`
  display: grid;
  grid-template-areas: 'descriptor tags' 'summary summary' 'location cta';
  grid-row-gap: 16px;
  .descriptor {
    grid-area: descriptor;
    font-size: 14px;
  }
  .tags {
    grid-area: tags;
    justify-self: flex-end;
  }
  .summary {
    grid-area: summary;
    font-size: 16px;
    line-height: 160%;
    p {
      margin: 0;
    }
  }
  .location {
    grid-area: location;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-template-rows: max-content;
    grid-gap: 8px;
    margin-top: 16px;
    .location-text {
      font-size: 16px;
      line-height: 27px;
      margin-top: -6px;
    }
    .seatmap-chart {
      font-size: 14px;
      color: ${COLORS.BRAND.PURPS};
      cursor: pointer;
    }
  }
  .cta {
    grid-area: cta;
    justify-self: flex-end;
    margin-top: 16px;
    width: 350px;
    a {
      margin-right: 16px;
      :last-child {
        margin-right: 0;
      }
    }
  }
  @media (max-width: 768px) {
    padding: 16px;
    border-top: 1px solid #ebebeb;
    grid-template-areas: 'descriptor' 'tags' 'summary' 'location' 'cta';
    grid-row-gap: 8px;
    margin-top: 0;
    .tags {
      justify-self: flex-start;
    }
    .summary {
      margin-top: 8px;
      font-size: 14px;
    }
    .location {
      margin-top: 24px;
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

type ListicleCardProps = {
  isOpen?: boolean;
  isMobile: boolean;
  tour: any;
  currentLanguage: string;
};

const ListicleCard: React.FC<ListicleCardProps> = ({
  isOpen: cardOpen = false,
  isMobile,
  tour,
}) => {
  const [isOpen, setIsOpen] = useState(cardOpen || false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});
  const {
    name: tourName,
    data: {
      tags,
      listicle_categories: listicleCategories,
      tour_summary: tourSummary,
      tour_descriptor: tourDescriptor,
      know_more_link: knowMoreLink,
      tgid,
      seating_chart_popup: seatingChartPopup,
    },
    imageUploads,
    city,
    listingPrice,
    currency,
    averageRating,
    bookingUrl,
  } = tour;
  const tourCategories = listicleCategories.map(
    (category: any) => category.category
  );
  const tourTags = tags.map((tag: any) => tag.tag);
  const price = `${currency?.localSymbol}${listingPrice?.originalPrice}`;

  useEffect(() => {
    if (seatingChartPopup?.uid) {
      Client()
        .getByUID(CUSTOM_TYPES.POPUP, seatingChartPopup.uid, {
          lang: 'en-us',
        })
        .then((res: any) => {
          if (res.data) {
            setPopupData(res.data);
          }
        });
    }
  }, [seatingChartPopup, setPopupData]);

  return (
    <>
      {popupOpen ? (
        <Popup togglePopup={() => setPopupOpen((c) => !c)} data={popupData} />
      ) : null}
      <CardWrapper>
        {isMobile ? (
          <div onClick={() => setIsOpen((c) => !c)} role="button" tabIndex={0}>
            <MobileCardTop imageUrl={imageUploads[0].url}>
              <Tags
                tags={tourCategories}
                color="white"
                backgroundColor="#4fc3f7"
                bordered={false}
              />
              <div className="rating">
                <Rating value={averageRating} starSize="11px" />
              </div>
            </MobileCardTop>
            <MobileCardTitleSection>
              <CardTitle>{tourName}</CardTitle>
              <Pricing>
                <div>{strings.FROM.toLowerCase()}</div>
                {price}
              </Pricing>
            </MobileCardTitleSection>
          </div>
        ) : (
          <CardTop onClick={() => setIsOpen((c) => !c)} isActive={isOpen}>
            <img src={imageUploads[0].url} alt={imageUploads[0].alt} />
            <div className="title-section">
              <CardTitle>{tourName}</CardTitle>
              <Rating value={averageRating} className="rating" />
              <Tags
                tags={tourCategories}
                color="white"
                backgroundColor="#4fc3f7"
              />
            </div>
            <div className="price-section">
              {listingPrice ? (
                <Pricing>
                  <div>{strings.FROM.toLowerCase()}</div>
                  {price}
                </Pricing>
              ) : null}
              <ChevronWrapper>
                <Chevron isActive={isOpen} />
              </ChevronWrapper>
            </div>
          </CardTop>
        )}
        <CardBottom isOpen={isOpen}>
          <CardBottomContent>
            <div className="descriptor">{tourDescriptor}</div>
            <div className="tags">
              <Tags tags={tourTags} />
            </div>
            <div className="summary">
              <RichText
                render={tourSummary}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
            <div className="location">
              {PIN}
              <div>
                <div className="location-text">
                  {city.displayName}, {city.country.displayName}
                </div>
                {seatingChartPopup?.uid ? (
                  <div
                    className="seatmap-chart"
                    role="button"
                    tabIndex={0}
                    onClick={() => setPopupOpen(true)}
                  >
                    {strings.LISTICLES.SEATING_CHART}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="cta">
              <a href={knowMoreLink?.url} target={knowMoreLink?.target}>
                <Button paddingSides="40px">Know More</Button>
              </a>
              <a
                href={`${bookingUrl}${tgid}`}
                rel="noopener noreferrer"
                target={isMobile ? '' : '_blank'}
              >
                <Button fillType="fillGradient" paddingSides="41px">
                  {strings.BOOK_NOW_CTA}
                </Button>
              </a>
            </div>
          </CardBottomContent>
        </CardBottom>
      </CardWrapper>
    </>
  );
};

export default ListicleCard;
