import React, { useContext } from 'react';
import styled from 'styled-components';
import { convertUidToUrl } from 'utils/urlUtils';
import PriceBlock, { SavedTag, StyledPriceBlock } from 'UI/PriceBlock';
import { SEE_SAFETY } from 'assets/SvgIcons';
import { safetyChecker } from 'components/ShowPages/parseShowPage';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';

import Image from '../UI/Image';

const CategoryCardWrapper = styled.div`
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

  .tour-scratch-price {
    color: #888888;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
  }

  .tour-price {
    color: #444444;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
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

const SeeSafetyWrapper = styled.div`
  position: absolute;
  filter: drop-shadow(0px -1px 2px rgba(0, 0, 0, 0.08)),
    drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.12));
  margin: 8px 0 0 8px;
  max-height: 32px;
  max-width: 52px;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const CategoryCard = ({
  allShowPagesDocuments,
  element,
  currentLanguage,
  categoryName,
  isMobile,
}) => {
  const { listingPrice, name, imageUrl, id, tourGroupUrl } = element;
  const { isDev, host } = useContext(MBContext);

  let cardDocument = allShowPagesDocuments.filter(
    (element) => element.data.tgid === id
  );
  const redirectURL = cardDocument.length
    ? convertUidToUrl({ uid: cardDocument[0].uid, isDev, hostname: host })
    : `https://www.headout.com${tourGroupUrl}`;

  const isSafe = safetyChecker(element.microBrandsHighlight);

  return (
    <CategoryCardWrapper>
      <a href={redirectURL} target="blank">
        <Conditional if={isSafe}>
          <SeeSafetyWrapper>{SEE_SAFETY}</SeeSafetyWrapper>
        </Conditional>
        <Image
          url={imageUrl}
          alt={name}
          width={isMobile ? 164 : 282}
          height={isMobile ? 102 : 176}
        />
        <div className="category-name">{categoryName}</div>
        <h3>{name}</h3>
        <div className="priceBlockWrapper">
          <PriceBlock
            listingPrice={listingPrice}
            lang={currentLanguage}
            showSavings={true}
            showScratchPrice={true}
            prefix={true}
          />
        </div>
      </a>
    </CategoryCardWrapper>
  );
};

export default CategoryCard;
