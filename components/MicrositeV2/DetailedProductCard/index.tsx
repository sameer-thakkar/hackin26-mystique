import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { useRecoilValue } from 'recoil';
import { greyScheme } from 'style/theme';
import Conditional from 'components/common/Conditional';
import {
  DetailedDescriptionCard,
  IconBoosters,
} from 'components/MicrositeV2/DetailedProductCard/styles';
import IconCTA from 'UI/IconCTA';
import Image from 'UI/Image';
import LocalisedPrice from 'UI/LPrice';
import Split from 'UI/Split';
import { MBContext } from 'contexts/MBContext';
import { createBookingURL, isSafetyIncluded } from 'utils';
import {
  getCommonEventMetaData,
  getProductCommonProperties,
  trackEvent,
} from 'utils/analytics';
import { parseV2ProductDescriptors } from 'utils/dataParsers';
import { checkIfBroadwayMB, checkIfLTTMB } from 'utils/helper';
import { extractContentForProductCard } from 'utils/productUtils';
import {
  shortCodeSerializer,
  shortCodeSerializerWithParentProps,
} from 'utils/shortCodes';
import { convertUidToUrl } from 'utils/urlUtils';
import { metaAtom } from 'store/atoms/meta';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { CLOSE_WHITE, Shield } from 'assets/SvgIcons';

const SafeExperiencesPitch = dynamic(
  () =>
    import(
      /* webpackChunkName: "SafeExperiencesPitch" */ 'UI/SafeExperiencesPitch'
    ),
  {
    ssr: false,
  }
);

const DetailedProductCard = (props: any) => {
  const closeDescriptionCard = () => {
    props.closeDescription();
  };
  const mbContext = useContext(MBContext);

  const {
    lang,
    nakedDomain,
    biLink,
    sidebarModal: { addToAside },
    host,
    isDev,
    redirectToHeadoutBookingFlow,
  } = mbContext;
  const {
    allTours,
    tgidClicked,
    cardPosition,
    isEntertainmentMb,
    hasCategoryTourList,
    isListicle,
    cardRanking,
    showDescCard = true,
  } = props;
  const pageMetaData = useRecoilValue(metaAtom);
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
    primaryCategory,
    primarySubCategory,
    primaryCollection,
    listicleShowSummary,
    listicleWhyWatch,
    flowType,
  } = activeTour || {};
  const showPageUrl = convertUidToUrl({
    uid: showPageUid,
    isDev,
    hostname: host,
  });
  const rightBlocksCount = contentBlocks?.right?.length;
  const descriptors = parseV2ProductDescriptors({
    hasCategoryTourList,
    descriptors: productDescriptors,
  });

  const { finalPrice, bestDiscount, originalPrice, currencyCode } =
    listingPrice || {};
  const hasSafetyFlag = isSafetyIncluded(allTags);
  const contentBlockForLTT = extractContentForProductCard(
    highlights,
    contentBlocks
  );
  const productCardContent = isEntertainmentMb
    ? contentBlockForLTT
    : activeTour.contentBlocks;
  if (isListicle) {
    productCardContent.left = contentBlocks?.left?.filter(
      (item: any) => item.label === strings.SHOW_PAGE.THEATRE_NAME
    );
    productCardContent.right = contentBlocks?.left?.filter(
      (item: any) => item.label === strings.SHOW_PAGE.DURATION
    );
  }
  const isBroadway = checkIfBroadwayMB(mbContext?.uid); // TODO: Need to handle this via book_now_text.
  const isLTT = checkIfLTTMB(mbContext.uid);
  const experimentEnabled = isLTT;

  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_EXPANDED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.TGID]: tgidClicked,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      [ANALYTICS_PROPERTIES.COUNTRY]: (pageMetaData?.country as any)?.code,
    });
  }, []);

  const onMoreDetailsClick = () => {
    trackEvent({
      eventName: experimentEnabled
        ? ANALYTICS_EVENTS.EXPERIENCE_CARD_BOOK_NOW_CLICKED
        : ANALYTICS_EVENTS.EXPERIENCE_CARD_MORE_DETAILS_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.TGID]: tgidClicked,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      [ANALYTICS_PROPERTIES.COUNTRY]: (pageMetaData?.country as any)?.code,
    });
  };

  const trackBookNowClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_BOOK_NOW_CLICKED,
      ...getCommonEventMetaData(pageMetaData),
      [ANALYTICS_PROPERTIES.TGID]: tgidClicked,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      [ANALYTICS_PROPERTIES.COUNTRY]: (pageMetaData?.country as any)?.code,
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]: originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title,
      [ANALYTICS_PROPERTIES.POSITION]: cardRanking,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.TGID]: tgidClicked,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });
  };

  const openSafeSidebar = () => {
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    addToAside({
      width: '41.06vw',
      children: (
        <SafeExperiencesPitch allTags={allTags} images={safetyImages} />
      ),
      sidePadding: 40,
    });
  };

  const ContentBlock = ({ heading, content, isRightContent = false }: any) => {
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
          <Conditional if={hasCategoryTourList}>
            <p>{content}</p>
          </Conditional>
          <Conditional if={!hasCategoryTourList}>
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
    <div className="desc-cta-wrapper">
      <Conditional if={(isEntertainmentMb && showPageUrl) || experimentEnabled}>
        <a
          className={`cta ${experimentEnabled ? 'primary' : 'secondary'}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onMoreDetailsClick}
          href={showPageUrl}
        >
          <span className="cta-text">
            {experimentEnabled ? strings.CHECK_AVAIL : strings.MORE_DETAILS}
          </span>
        </a>
      </Conditional>
      <Conditional if={!experimentEnabled || !isEntertainmentMb}>
        <div
          role="button"
          tabIndex={0}
          className="cta primary"
          onClick={() => {
            trackBookNowClick();
            window.open(
              createBookingURL({
                nakedDomain,
                lang,
                tgid: tgidClicked,
                biLink,
                redirectToHeadoutBookingFlow,
                flowType,
              }),
              '_blank',
              'noopener, noreferrer'
            );
          }}
        >
          <span className="cta-text">
            {isLTT || isBroadway ? strings.CHECK_AVAIL : strings.BOOK_NOW_CTA}
          </span>
        </div>
      </Conditional>
    </div>
  );

  return (
    <DetailedDescriptionCard
      {...{ cardPosition, rightBlocksCount }}
      isEntertainmentMb={isEntertainmentMb}
      isListicle={isListicle}
      experimentEnabled={experimentEnabled}
      isBroadway={isBroadway}
      showPageUrl={showPageUrl}
      showDescCard={showDescCard}
    >
      <div className="indicator-triangle"></div>
      <Conditional if={isEntertainmentMb}>
        <div className="product-v2-description-left">
          <Image
            url={`${descriptionImage || productImage}`}
            width={1200}
            height={750}
            format="pjpg"
            imageId={tgidClicked}
            alt={title}
          />
        </div>
        <div className="product-v2-description-right">
          <div
            onClick={closeDescriptionCard}
            role="button"
            tabIndex={0}
            className="close-button"
          >
            {CLOSE_WHITE}
          </div>
          <div className="v2-desc-columns heading-price-bar">
            <div className="v2-desc-left">
              <div className="v2-desc-title">{title}</div>
              <Conditional if={hasSafetyFlag}>
                <IconBoosters>
                  <Split count={2} autoWidth={true} mobileLayout={'scroll'}>
                    <IconCTA
                      text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
                      colorScheme={greyScheme}
                      ctaOnClick={openSafeSidebar}
                      icon={Shield}
                    />
                  </Split>
                </IconBoosters>
              </Conditional>
              <Conditional if={descriptors?.length}>
                <div className="v2-descriptors">
                  {descriptors?.map((descriptor: string, index: number) => {
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
            </div>

            <div className="desc-cta-price v2-desc-right">
              <div className="desc-price-wrapper">
                <div className="scratch-price">
                  <span>
                    {isEntertainmentMb
                      ? strings.FROM
                      : strings.FROM?.toLowerCase()}
                  </span>{' '}
                  <Conditional if={originalPrice > finalPrice}>
                    <LocalisedPrice
                      className="l-price"
                      price={originalPrice}
                      currencyCode={currencyCode}
                      lang={lang}
                    />
                  </Conditional>
                </div>
                <div className="price">
                  <LocalisedPrice
                    className="l-price"
                    price={finalPrice}
                    currencyCode={currencyCode}
                    lang={lang}
                  />
                  <Conditional
                    if={isEntertainmentMb && bestDiscount && bestDiscount > 0}
                  >
                    <span className="discount">
                      {bestDiscount}% {strings.OFF}
                    </span>
                  </Conditional>
                </div>
              </div>
            </div>

            <Conditional if={description && description.length}>
              <div className="content-block tour-description">
                <RichText
                  render={description}
                  htmlSerializer={shortCodeSerializer}
                />
              </div>
            </Conditional>
          </div>
          <Conditional if={isListicle}>
            {listicleShowSummary && (
              <div className="show-summary-wrapper">
                <RichText render={[listicleShowSummary.text]} />
              </div>
            )}
            <div>
              <h3>{strings.WHY_WATCH}</h3>
              {listicleWhyWatch && (
                <RichText render={[listicleWhyWatch.text]} />
              )}
            </div>
          </Conditional>
          <div className="v2-desc-columns">
            <div className="v2-desc-left">
              {productCardContent.left.map((block: any, index: number) => {
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
              {productCardContent.right.map((block: any, index: number) => {
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
      </Conditional>

      <Conditional if={!isEntertainmentMb}>
        <div className="product-v2-description-right">
          <div className="full-width-section">
            <div className="v2-desc-title">{title}</div>
            <Conditional if={hasSafetyFlag}>
              <IconBoosters>
                <Split count={2} autoWidth={true} mobileLayout={'scroll'}>
                  <IconCTA
                    text={strings.SAFE_EXPERIENCE.FLAG_TEXT}
                    colorScheme={greyScheme}
                    ctaOnClick={openSafeSidebar}
                    icon={Shield}
                  />
                </Split>
              </IconBoosters>
            </Conditional>
            <Conditional if={descriptors?.length}>
              <div className="v2-descriptors">
                {descriptors?.map((descriptor: any, index: number) => {
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
          <Conditional if={isListicle}>
            {listicleShowSummary && (
              <div className="show-summary-wrapper">
                <RichText render={[listicleShowSummary.text]} />
              </div>
            )}
            <div>
              <h3>{strings.WHY_WATCH}</h3>
              {listicleWhyWatch && (
                <RichText render={[listicleWhyWatch.text]} />
              )}
            </div>
          </Conditional>
          <div className="v2-desc-columns">
            <div className="v2-desc-left">
              {productCardContent.left.map((block: any, index: number) => {
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
              {productCardContent.right.map((block: any, index: number) => {
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
        <div className="product-v2-description-left">
          <Image
            url={`${descriptionImage || productImage}`}
            width={1200}
            height={750}
            format="pjpg"
            imageId={tgidClicked}
            alt={title}
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
      </Conditional>
    </DetailedDescriptionCard>
  );
};

export default DetailedProductCard;
