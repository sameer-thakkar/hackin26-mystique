import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import { greenScheme } from 'style/theme';
import { MBContext } from 'contexts/MBContext';
import Image from 'UI/Image';
import IconCTA from 'UI/IconCTA';
import Split, { StlyedSplit } from 'UI/Split';
import LocalisedPrice from 'UI/LPrice';
import Conditional from 'components/common/Conditional';
import { strings } from 'const/strings';
import { CLOSE_WHITE, Shield } from 'assets/SvgIcons';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { CURRENCY_SYMBOL_MAP } from 'const/index';
import { isSafetyIncluded, createBookingURL } from 'utils';
import {
  shortCodeSerializerWithParentProps,
  shortCodeSerializer,
} from 'utils/shortCodes';
import { extractContentForProductCard } from 'utils/productUtils';
import { convertUidToUrl } from 'utils/urlUtils';

const SafeExperiencesPitch = dynamic(() => import('UI/SafeExperiencesPitch'), {
  ssr: false,
});

const DetailedDescriptionCard = styled.div`
  grid-column: 1 / 5;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  grid-column-gap: 24px;
  border: 1px solid
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GREY_G6 : '#757575'};
  color: ${COLORS.FOUR_BLACK};
  border-left: none;
  border-right: none;
  position: relative;
  ${({ isEntertainmentMb }) =>
    isEntertainmentMb &&
    `
      background-color: ${COLORS.GREY.G8}
      `};
  ${StlyedSplit} {
    margin: 0;
    max-width: unset;
    padding: 0;
  }
  .v2-desc-title {
    font-size: 24px;
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '28px' : '1.37'};
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GREY.G2 : COLORS.TWO_BLACK};
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.SEMIBOLD};
  }
  .product-v2-description-left {
    padding: 24px 0;
  }
  .product-v2-description-left,
  .product-v2-description-right {
    display: grid;
    grid-gap: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '32px' : '24px'};
  }
  .product-v2-description-right {
    z-index: 1;
    display: flex;
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb && `padding: 24px 0; position: relative;`};
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
    background: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GREY_G6 : COLORS.GREY_FO};
    border-radius: 2px;
    font-size: 12px;
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '6px 8px' : '8px 12px'};
    color: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? COLORS.GREY.G3 : COLORS.TWO_BLACK};
    font-weight: 400;
    line-height: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '16px' : 1)};
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
    grid-gap: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '16px' : '24px'};
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
  .desc-cta-wrapper {
    display: grid;
    align-items: center;
    grid-template-columns: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? 'max-content max-content' : 'max-content'};
    grid-column-gap: 12px;
    justify-content: end;
  }

  .cta {
    border-radius: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '4px' : '2px'};
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '181px' : '150px'};
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '12px 0' : '16px'};
  }
  .cta .cta-text {
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    line-height: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '20px' : '16px'};
    font-weight: ${SOLEIL.SEMIBOLD};
    ${({ isEntertainmentMb }) =>
      isEntertainmentMb && `letter-spacing: 0.6px; width: max-content;`}
  }
  .cta.primary {
    background: ${COLORS.RHAPSODY};
  }
  .cta.secondary {
    background: ${COLORS.WHITE};
    border: 1px solid ${COLORS.GREY.G2};
  }
  .cta.primary .cta-text {
    color: ${COLORS.WHITE};
  }
  .cta.secondary .cta-text {
    color: ${COLORS.GREY.G2};
  }

  .desc-price-wrapper {
    .scratch-price {
      span {
        color: ${COLORS.GREY.G4};
        font-weight: ${SOLEIL.REGULAR};
        font-size: 14px;
        line-height: ${({ isEntertainmentMb }) =>
          isEntertainmentMb ? '16px' : '18px'};
      }
      .l-price {
        text-decoration: line-through;
      }
    }
    .price {
      display: grid;
      grid-template-columns: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? 'max-content max-content' : 'max-content'};
      .l-price {
        font-family: ${SOLEIL.FONT_STACK};
        font-weight: ${SOLEIL.SEMIBOLD};
        color: ${COLORS.FOUR_BLACK};
        font-size: ${({ isEntertainmentMb }) =>
          isEntertainmentMb ? '24px' : '20px'};
        line-height: ${({ isEntertainmentMb }) =>
          isEntertainmentMb ? '28px' : '20px'};
      }
      .discount {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${COLORS.SOOTHING_GREEN};
        color: ${COLORS.OKAY_GREEN};
        padding: 2px 4px;
        border-radius: 2px;
        line-height: 16px;
        font-size: 12px;
        font-family: ${SOLEIL.FONT_STACK};
        font-style: normal;
        font-weight: ${SOLEIL.REGULAR};
        margin-left: 8px;
      }
    }
  }

  .close-button {
    position: absolute;
    top: ${({ isEntertainmentMb }) => (isEntertainmentMb ? '24px' : '0')};
    background-color: #000;
    right: 0;
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '12px' : '16px'};
    cursor: pointer;
    display: flex;
    ${({ isEntertainmentMb }) => isEntertainmentMb && `border-radius: 0 4px;`}
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
    border-color: transparent transparent
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GREY_G6 : '#757575'}
      transparent;
    border-style: solid;
    border-width: 13px;
    content: '';
    grid-row: 1;
    grid-column: 1;
    align-self: end;
    justify-self: center;
  }
  .indicator-triangle::after {
    border-color: transparent transparent
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? COLORS.GREY.G8 : COLORS.WHITE}
      transparent;
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
    ${({ isEntertainmentMb }) => isEntertainmentMb && `border-radius: 4px`};
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
  const {
    lang,
    nakedDomain,
    biLink,
    sidebarModal: { addToAside },
  } = mbContext;
  const {
    allTours,
    tgidClicked,
    cardPosition,
    isEntertainmentMb,
    hasCategoryTourList,
  } = props;
  const activeTour = allTours[tgidClicked];
  const {
    allTags = [],
    listingPrice,
    highlights,
    contentBlocks,
    descriptors: productDescriptors,
    description,
    descriptionImage,
    productImage,
    safetyImages,
    title,
    showPageUid,
  } = activeTour || {};
  const showPageUrl = showPageUid ? convertUidToUrl(showPageUid) : null;

  const rightBlocksCount = contentBlocks?.right?.length;
  const descriptors = hasCategoryTourList
    ? productDescriptors
    : productDescriptors
        ?.split(',')
        ?.filter((d) => d.length)
        ?.map((d) => d.trim());

  const { finalPrice, bestDiscount, originalPrice, currencyCode } =
    listingPrice || {};
  const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode];
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const productCardContent = extractContentForProductCard(
    highlights,
    contentBlocks
  );

  const openSafeSidebar = () => {
    addToAside({
      width: '41.06vw',
      children: (
        <SafeExperiencesPitch allTags={allTags} images={safetyImages} />
      ),
      sidePadding: 40,
    });
  };

  const ContentBlock = ({ heading, content, isRightContent = false }) => {
    return (
      <div
        className={`${
          isRightContent
            ? 'description-content-block right'
            : 'description-content-block'
        }`}
      >
        <span className="description-label">{heading}</span>
        <span className="description-content">
          <Conditional if={isEntertainmentMb && hasCategoryTourList}>
            <p>{content}</p>
          </Conditional>
          <Conditional if={!isEntertainmentMb && !hasCategoryTourList}>
            <RichText
              render={content}
              htmlSerializer={(...defaultArgs: any) =>
                shortCodeSerializerWithParentProps(defaultArgs, activeTour)
              }
            />
          </Conditional>
        </span>
      </div>
    );
  };

  const CTABlock = () => (
    <div className="desc-cta-price">
      <div className="desc-price-wrapper">
        <Conditional if={originalPrice > finalPrice}>
          <div className="scratch-price">
            <span>{strings.FROM}</span>{' '}
            <LocalisedPrice
              className="l-price"
              price={originalPrice}
              currencySymbol={currencySymbol}
              lang={lang}
            />
          </div>
        </Conditional>
        <div className="price">
          <LocalisedPrice
            className="l-price"
            price={finalPrice}
            currencySymbol={currencySymbol}
            lang={lang}
          />
          <Conditional if={bestDiscount && bestDiscount > 0}>
            <span className="discount">
              {bestDiscount}% {strings.OFF}
            </span>
          </Conditional>
        </div>
      </div>

      <div className="desc-cta-wrapper">
        <Conditional if={isEntertainmentMb && showPageUrl}>
          <a
            className="cta secondary"
            target="_blank"
            rel="noopener noreferrer"
            href={showPageUrl}
          >
            <span className="cta-text">{strings.MORE_DETAILS}</span>
          </a>
        </Conditional>
        <a
          className="cta primary"
          target="_blank"
          rel="noopener noreferrer"
          href={createBookingURL({
            nakedDomain,
            lang,
            tgid: tgidClicked,
            biLink,
          })}
        >
          <span className="cta-text">{strings.BOOK_NOW_CTA}</span>
        </a>
      </div>
    </div>
  );

  return (
    <DetailedDescriptionCard
      {...{ cardPosition, rightBlocksCount }}
      isEntertainmentMb={isEntertainmentMb}
    >
      <div className="indicator-triangle"></div>
      <div className="product-v2-description-left">
        <div className="full-width-section">
          <div className="v2-desc-title">{title}</div>
          <Conditional if={hasSafetyFlag}>
            <IconBoosters>
              <Split count={2} autoWidth={true} mobileLayout={'scroll'}>
                <IconCTA
                  text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
                  colorScheme={greenScheme}
                  ctaOnClick={openSafeSidebar}
                  icon={Shield}
                />
              </Split>
            </IconBoosters>
          </Conditional>
          <Conditional if={descriptors?.length}>
            <div className="v2-descriptors">
              {descriptors.map((descriptor, index) => {
                if (descriptor) {
                  return (
                    <div className="v2-descriptor" key={index}>
                      {descriptor.trim()}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </Conditional>
          <Conditional if={description && description.length}>
            <div className="content-block tour-description">
              <RichText
                render={description}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          </Conditional>
        </div>
        <div className="v2-desc-columns">
          <div className="v2-desc-left">
            {productCardContent.left.map((block, index) => {
              const { heading, label, contents, content } = block;
              if (heading || label) {
                return (
                  <ContentBlock
                    content={contents || content}
                    heading={heading || label}
                    key={index}
                  />
                );
              }
              return null;
            })}
          </div>
          <div className="v2-desc-right">
            {productCardContent.right.map((block, index) => {
              const { heading, label, contents, content } = block;
              if (heading || label) {
                return (
                  <ContentBlock
                    content={contents || content}
                    heading={heading || label}
                    isRightContent={true}
                    key={index}
                  />
                );
              }
              return null;
            })}
            <Conditional if={!isEntertainmentMb}>
              <CTABlock />
            </Conditional>
          </div>
        </div>
        <Conditional if={isEntertainmentMb}>
          <CTABlock />
        </Conditional>
      </div>
      <div className="product-v2-description-right">
        {/* <Image url={descriptionImage} width={1200} height={750} format="pjpg" /> */}
        <Image
          url={`${descriptionImage || productImage}`}
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
