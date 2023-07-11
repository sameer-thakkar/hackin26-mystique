import React, { useContext } from 'react';
import styled from 'styled-components';
import Image from 'components/UI/Image';
import PriceBlock, { SavedTag, StyledPriceBlock } from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { convertUidToUrl } from 'utils/urlUtils';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { expandFontToken } from 'const/typography';

const CategoryCardWrapper = styled.div`
  cursor: pointer;

  ${StyledPriceBlock} {
    grid-row-gap: 2px;
    grid-column-gap: 6px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .tour-price {
    color: ${COLORS.GRAY.G2};
    ${expandFontToken(FONTS.SUBHEADING_REGULAR)}
    display: flex;
    flex-direction: column;
    .prefix {
      text-align: left;
      ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    }
  }

  .tour-scratch-price {
    color: ${COLORS.GRAY.G4};
    ${expandFontToken(FONTS.UI_LABEL_SMALL)}
    text-align: left;
  }

  ${SavedTag} {
    color: #088943;
    background: #dbfddb;
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 10px;
    font-style: normal;
    font-weight: normal;
    line-height: 12px;
  }

  p {
    margin: 0;
  }

  h3 {
    margin: 0;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    margin-top: 2px;
  }

  .priceBlockWrapper {
    margin-top: 12px;
  }

  .category-name {
    font-size: 12px;
    color: #888888;
    font-style: normal;
    font-weight: normal;
    line-height: 16px;
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 14px;
    }

    .category-name {
      font-size: 10px;
      color: #888888;
    }
  }
`;

const CategoryCard = ({
  allShowPagesDocuments,
  element,
  currentLanguage,
  categoryName,
  isMobile,
}: any) => {
  const { listingPrice, name, imageUrl, id } = element;
  const { isDev, host } = useContext(MBContext);

  let cardDocument = allShowPagesDocuments.find(
    (element: any) => element.data.tgid === id
  );

  const redirectURL = cardDocument
    ? convertUidToUrl({
        uid: cardDocument.uid,
        isDev,
        hostname: host,
        lang: currentLanguage,
      })
    : undefined;

  const trackClickEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: id,
    });
  };

  const openCategoryPage = () => {
    window.open(redirectURL, '_blank');
    trackClickEvent();
  };

  return (
    <CategoryCardWrapper onClick={openCategoryPage}>
      <Image
        url={imageUrl}
        alt={name}
        width={isMobile ? 164 : 282}
        height={isMobile ? 102 : 176}
      />
      <div className="category-name">{categoryName}</div>
      <a href={redirectURL} target="_blank" rel="noreferrer">
        <h3>{name}</h3>
      </a>
      <div className="priceBlockWrapper">
        <PriceBlock
          listingPrice={listingPrice}
          lang={currentLanguage}
          showSavings
          showScratchPrice
          prefix
        />
      </div>
    </CategoryCardWrapper>
  );
};

export default CategoryCard;
