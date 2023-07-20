import { useContext } from 'react';
import Conditional from 'components/common/Conditional';
import LinkResolver from 'components/LinkResolver';
import { IFilteredDescriptorProps } from 'components/PinnedCard/interface';
import { PinnedCardWrapper } from 'components/PinnedCard/styles';
import { getObject } from 'components/ShowPages/parseShowPage';
import Button from 'UI/Button';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { getTagPageMap } from 'utils';
import { trackEvent } from 'utils/analytics';
import { formatDateToString } from 'utils/dateUtils';
import { generateDescriptor, parseDescriptors } from 'utils/productUtils';
import { convertUidToUrl, getTagPageLink } from 'utils/urlUtils';
import COLORS from 'const/colors';
import { descriptorIcons } from 'const/descriptorIcons';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { STAR } from 'assets/SvgIcons';

const DescriptorList = (props: IFilteredDescriptorProps) => {
  const { filteredDescriptor } = props;

  return (
    <>
      {filteredDescriptor?.map((descriptor: Record<string, string>) => {
        const { code, name } = descriptor;
        if (name && code) {
          const DiscSvgElm = descriptorIcons[code];
          return (
            <div key={name} className="descriptors">
              <DiscSvgElm className="descSvg" />
              <span>{name}</span>
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

const PinnedCard = (props: any) => {
  const { lang, host, isDev, isStage } = useContext(MBContext);

  const { productInfo, uid, showPageUid } = props;

  const filterHighlights = [
    strings.OPENING_DATE,
    strings.SHOW_PAGE.CLOSING_DATE,
  ];

  const { detailsObjects = {} } = getObject(
    productInfo.microBrandsHighlight,
    filterHighlights
  );

  const openingDate = formatDateToString(
    new Date(detailsObjects[strings.OPENING_DATE]),
    lang,
    'MMM D, YYYY'
  );

  const isBeforeToday = new Date().getTime() > new Date(openingDate)?.getTime();

  const {
    descriptors,
    id: tgid,
    listingPrice,
    name,
    imageUrl,
    primaryCategory,
    primarySubCategory,
    microBrandsDescriptor,
  } = productInfo;

  const updatedDescriptors = generateDescriptor({
    v2Descriptors: microBrandsDescriptor,
    lang,
    isShowPage: true,
  });
  const LTT_TAG_PAGE_MAP = getTagPageMap();

  const tagsArray = [primarySubCategory.name, ...updatedDescriptors];
  const filteredDescriptors = parseDescriptors(descriptors);
  const showPageUrl = convertUidToUrl({
    uid: showPageUid,
    isDev,
    hostname: host,
    lang,
  });

  const ratingCount = (reviewCount: number) => {
    return reviewCount > 999
      ? `${(reviewCount / 1000).toFixed(1)}k`
      : reviewCount;
  };

  const clickHandler = () => {
    window.open(showPageUrl);
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        listingPrice?.originalPrice > listingPrice?.finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: listingPrice?.currencyCode,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: listingPrice?.finalPrice,
      [ANALYTICS_PROPERTIES.RANKING]: 1,
      [ANALYTICS_PROPERTIES.IS_PINNED_CARD]: 'Yes',
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: name,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
    });
  };

  return (
    <PinnedCardWrapper>
      <div className="product-image">
        <Image url={imageUrl} alt={name} />
      </div>
      <div className="product-description">
        <div className="tags-wrapper">
          {tagsArray.slice(0, 3).map((tag) => {
            if (tag) {
              return (
                <LinkResolver
                  key={tag}
                  url={getTagPageLink({
                    url: LTT_TAG_PAGE_MAP[tag],
                    lang,
                    uid,
                    isProd: !isDev && !isStage,
                  })}
                >
                  <span key={tag}>{tag.toUpperCase()}</span>
                </LinkResolver>
              );
            }
          })}
        </div>
        <div className="product-name">
          <h3>{name}</h3>
        </div>
        <Conditional if={productInfo?.averageRating}>
          <div className="rating">
            <span className="avg-rating">
              <span className="rating-number">
                {productInfo.averageRating.toFixed?.(1)}
              </span>
              {STAR(COLORS.PRIMARY.JOY_MUSTARD)}
            </span>
            <Conditional if={productInfo?.reviewCount}>
              <span className="total-rating">
                ({ratingCount(productInfo.reviewCount)})
              </span>
            </Conditional>
          </div>
        </Conditional>
        <Conditional if={!isBeforeToday && openingDate !== 'Invalid Date'}>
          <span className="date">
            {strings.OPENING_ON} {openingDate}
          </span>
        </Conditional>
        <div className="descriptors-list">
          <DescriptorList filteredDescriptor={filteredDescriptors} />
        </div>
      </div>
      <div className="divider" />
      <div className="cta-container">
        <PriceBlock
          lang={lang}
          listingPrice={productInfo?.listingPrice}
          showScratchPrice
          showCashback
          showCashbackBlock
        />
        <Button
          className={`tour-book-now-cta`}
          fillType="fill"
          role="button"
          tabIndex={0}
          onClick={clickHandler}
          widthProp="100%"
        >
          {strings.MORE_DETAILS}
        </Button>
      </div>
    </PinnedCardWrapper>
  );
};
export default PinnedCard;
