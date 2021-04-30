import { SOLEIL, COLORS } from 'const/ui-constants';
import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { CLOSE_WHITE, Shield } from 'assets/SvgIcons';
import {
  shortCodeSerializerWithParentProps,
  shortCodeSerializer,
} from 'utils/shortCodes';
import { MBContext } from 'contexts/MBContext';
import IconCTA from 'UI/IconCTA';
import { greenScheme } from 'style/theme';
import Split, { StlyedSplit } from 'UI/Split';
import { isSafetyIncluded, createBookingURL } from 'utils';
import PriceBlock from 'UI/PriceBlock';

import { extractContentForProductCard } from './../../utils/productUtils';

const SafeExperiencesPitch = dynamic(() => import('UI/SafeExperiencesPitch'), {
  ssr: false,
});

const DetailedDescriptionCard = styled.div`
  grid-column: 1 / 5;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  grid-column-gap: 24px;
  border: 1px solid #757575;
  color: ${COLORS.FOUR_BLACK};
  border-left: none;
  border-right: none;
  position: relative;
  ${StlyedSplit} {
    margin: 0;
    max-width: unset;
    padding: 0;
  }
  .v2-desc-title {
    font-size: 24px;
    line-height: 1.37;
    color: ${COLORS.TWO_BLACK};
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
  }
  .product-v2-description-left {
    padding: 24px 0;
  }
  .product-v2-description-left,
  .product-v2-description-right {
    display: grid;
    grid-gap: 24px;
  }
  .product-v2-description-right {
    z-index: 1;
    display: flex;
  }
  .v2-desc-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 24px;
    grid-auto-flow: row;
    grid-auto-rows: max-content;
  }
  .v2-desc-blocks .left {
    grid-column: 1;
  }
  .v2-desc-blocks .right {
    grid-column: 2;
  }
  .description-label {
    font-size: 16px;
    line-height: 1.4;
    color: ${COLORS.TWO_BLACK};
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
  }
  .full-width-section {
    display: grid;
    grid-row-gap: 8px;
  }
  .v2-descriptors {
    display: grid;
    grid-template-columns: repeat(5, auto);
    font-family: ${SOLEIL.FONT_STACK};
    grid-gap: 12px;
    justify-content: left;
    height: max-content;
  }
  .v2-descriptor {
    background: ${COLORS.GREY_FO};
    border-radius: 2px;
    font-size: 12px;
    padding: 8px 12px;
    color: ${COLORS.TWO_BLACK};
    font-weight: 400;
    line-height: 1;
    text-transform: capitalize;
  }
  .tour-description {
    font-family: ${SOLEIL.FONT_STACK};
    margin-top: 4px;
  }

  .description-content {
    font-size: 16px;
    line-height: 1.37;
    color: ${COLORS.FOUR_BLACK};
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
  }

  .desc-cta-price {
    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    align-self: end;
    grid-column-gap: 30px;
  }

  .v2-desc-right,
  .v2-desc-left {
    display: grid;
    grid-gap: 24px;
    align-items: start;
  }

  .v2-desc-left {
    grid-auto-flow: row;
    grid-auto-rows: max-content;
  }
  .v2-desc-right {
    grid-template-rows:
      repeat(${({ rightBlocksCount }) => rightBlocksCount}, max-content)
      auto;
  }

  .v2-desc-left .full-width {
    grid-column: 1 / 3;
  }

  .desc-cta-price {
    .tour-scratch-price {
      font-size: 14px;
      line-height: 18px;
    }
    .tour-price {
      font-size: 20px;
      line-height: 20px;
    }
  }

  .desc-book-now-cta {
    background: #ec1943;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 150px;
    padding: 16px;
  }

  .desc-book-now-text {
    font-family: SOLEIL;
    font-size: 16px;
    line-height: 16px;
    color: #ffffff;
    font-weight: 600;
  }

  .close-button {
    position: absolute;
    top: 0;
    background-color: #000;
    right: 0;
    padding: 16px;
    cursor: pointer;
    display: flex;
  }
  .close-button img {
    height: 11px;
    width: 11px;
  }
  .indicator-triangle::after,
  .indicator-triangle::before {
    border-width: 0;
    transition: all 0.5s ease;
  }
  .indicator-triangle {
    display: grid;
  }
  .indicator-triangle::after,
  .indicator-triangle::before {
    border-color: transparent transparent #75757596 transparent;
    border-style: solid;
    border-width: 13px;
    content: '';
    grid-row: 1;
    grid-column: 1;
    align-self: end;
    justify-self: center;
  }
  .indicator-triangle::after {
    border-color: transparent transparent #fff transparent;
    border-width: 12px;
    transform: translateY(2px);
  }
  .indicator-triangle {
    position: absolute;
    transform: translateY(-100%) translateX(-50%);
    top: 0;
    z-index: 0;
    left: ${({ cardPosition }) => 25 * cardPosition - 12.5}%;
  }
  .product-v2-description-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .description-content p {
    margin: 0;
  }
  .tour-description p {
    margin: 0;
  }
  .description-content li,
  .description-content p {
    line-height: 1.37;
  }

  .tour-description svg {
    margin-top: 8px;
  }

  .description-content ul {
    padding-left: 1em;
  }
  .description-content p {
    line-height: 1.4;
  }

  .product-v2-description-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .description-content p {
    margin: 0;
  }
  .tour-description p {
    margin: 0;
  }

  .left,
  .right {
    .description-content {
      li,
      p {
        line-height: 1.37;
      }
      svg {
        margin-top: 8px;
      }
    }
  }

  .description-content ul {
    padding-left: 1em;
  }
  .description-content p {
    line-height: 1.4;
  }
`;

const IconBoosters = styled.div`
  margin-bottom: 16px;
  margin-left: 16px;
  ${StlyedSplit} {
    grid-column-gap: 29px;
  }
`;

const DetailedProductCard = (props) => {
  const closeDescriptionCard = () => {
    props.closeDescription();
  };
  const mbContext = useContext(MBContext);
  const { lang, nakedDomain, biLink } = mbContext;
  const { allTours, tgidClicked, cardPosition } = props;
  const activeTour = allTours[tgidClicked];
  const rightBlocksCount = activeTour.contentBlocks.right.length;
  const descriptors = activeTour.descriptors
    .split(',')
    .filter((d) => d.length)
    .map((d) => d.trim());

  const { allTags = [], listingPrice } = activeTour;
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const {
    sidebarModal: { addToAside },
  } = useContext(MBContext);

  const productCardContent = extractContentForProductCard(
    activeTour.highlights,
    activeTour.contentBlocks
  );

  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: (
        <SafeExperiencesPitch
          allTags={allTags}
          images={activeTour.safetyImages}
        />
      ),
      sidePadding: 40,
    });
  };

  return (
    <DetailedDescriptionCard {...{ cardPosition, rightBlocksCount }}>
      <div className="indicator-triangle"></div>
      <div className="product-v2-description-left">
        <div className="full-width-section">
          <div className="v2-desc-title">{activeTour.title}</div>
          <IconBoosters>
            <Split count={2} autoWidth={true} mobileLayout={'scroll'}>
              {hasSafetyFlag ? (
                <IconCTA
                  text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
                  colorScheme={greenScheme}
                  ctaOnClick={openSafeSidebar}
                  icon={Shield}
                />
              ) : null}
            </Split>
          </IconBoosters>

          {descriptors.length > 0 ? (
            <div className="v2-descriptors">
              {descriptors.map((descriptor, index) => {
                return (
                  <div className="v2-descriptor" key={index}>
                    {descriptor.trim()}
                  </div>
                );
              })}
            </div>
          ) : null}
          {activeTour.description && activeTour.description.length ? (
            <div className="content-block tour-description">
              <RichText
                render={activeTour.description}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          ) : null}
        </div>
        <div className="v2-desc-columns">
          <div className="v2-desc-left">
            {productCardContent.left.map((block, index) => {
              return (
                <div className="description-content-block" key={index}>
                  <span className="description-label">{block.heading} </span>
                  <span className="description-content">
                    <RichText
                      render={block.contents}
                      htmlSerializer={(...defaultArgs: any) =>
                        shortCodeSerializerWithParentProps(
                          defaultArgs,
                          activeTour
                        )
                      }
                    />
                  </span>
                </div>
              );
            })}
          </div>
          <div className="v2-desc-right">
            {productCardContent.right.map((block, index) => {
              return (
                <div className="description-content-block right" key={index}>
                  <span className="description-label">{block.heading} </span>
                  <span className="description-content">
                    <RichText
                      render={block.contents}
                      htmlSerializer={(...defaultArgs: any) =>
                        shortCodeSerializerWithParentProps(
                          defaultArgs,
                          activeTour
                        )
                      }
                    />
                  </span>
                </div>
              );
            })}
            <div className="desc-cta-price">
              <PriceBlock
                prefix={true}
                showScratchPrice={true}
                lang={lang}
                price={listingPrice}
              />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={createBookingURL({
                  nakedDomain,
                  lang,
                  tgid: tgidClicked,
                  biLink,
                })}
              >
                <div className="desc-book-now-cta">
                  <span className="desc-book-now-text">
                    {strings.BOOK_NOW_CTA}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="product-v2-description-right">
        {/* <Image url={activeTour.descriptionImage} width={1200} height={750} format="pjpg" /> */}
        <Image
          url={`${activeTour.descriptionImage || activeTour.productImage}`}
          width={1200}
          height={750}
          format="pjpg"
          imageId={tgidClicked}
        />
        <div
          onClick={closeDescriptionCard}
          role="button"
          tabIndex={0}
          className="close-button"
        >
          {CLOSE_WHITE}
        </div>
      </div>
    </DetailedDescriptionCard>
  );
};

export default DetailedProductCard;
