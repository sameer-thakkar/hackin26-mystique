import React from 'react';
import styled from 'styled-components';
import { convertUidToUrl } from 'utils/urlUtils';
import PriceBlock, { SavedTag } from 'UI/PriceBlock';
import { SEE_SAFETY } from 'assets/SvgIcons';

const CategoryCardWrapper = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .tour-scratch-price {
    color: #888888;
    font-size: 12px;
  }

  .tour-price {
    color: #444444;
    font-weight: 600;
    font-size: 16px;
  }

  ${SavedTag} {
    color: #088943;
    background: #dbfddb;
    padding: 2px 6px;
    border-radius: 2px;
    font-size: 11px;
  }

  p {
    margin: 0;
  }

  h3 {
    margin: 0;
    font-size: 16px;
  }

  .category-name {
    font-size: 12px;
    color: #888888;
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
  filter: drop-shadow(0px -1px 2px rgba(0, 0, 0, 0.08)), drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.12));
  margin: 8px 0 0 8px;
  max-height: 32px;
  max-width: 52px;
  svg{
    width: 100%;
    height: 100%;
  }
`;

const CategoryCard = ({
  allShowPagesDocuments,
  element,
  currentLanguage,
  currencySymbol,
  categoryName,
}) => {
  const { listingPrice, name, imageUrl, id, tourGroupUrl } = element;

  const { currencyCode } = listingPrice;

  let cardDocument = allShowPagesDocuments.filter(
    (element) => element.data.tgid === id
  );
  const redirectURL = cardDocument.length
    ? convertUidToUrl(cardDocument[0].uid)
    : `https://www.headout.com${tourGroupUrl}`;

  const isSafe = element.microBrandsHighlight.search("###### Safety Banner\r\nYES") >= 0;

  return (
    <CategoryCardWrapper>
      <a href={redirectURL} target="blank">
        {isSafe ?
          <SeeSafetyWrapper>
            {SEE_SAFETY}
          </SeeSafetyWrapper>
          : null}
        <img src={imageUrl} alt={name} />
        <div className="category-name">{categoryName}</div>
        <h3>{name}</h3>
        <div>
          <PriceBlock
            price={listingPrice}
            lang={currentLanguage}
            showSavings={true}
            showScratchPrice={true}
            currencySymbolOverride={
              currencySymbol?.[currencyCode] || currencyCode
            }
            prefix={true}
          />
        </div>
      </a>
    </CategoryCardWrapper>
  );
};

export default CategoryCard;
