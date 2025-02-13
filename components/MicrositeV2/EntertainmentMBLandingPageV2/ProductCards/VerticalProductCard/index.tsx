import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { TVerticalProductCardProps } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/VerticalProductCard/interface';
import {
  ExclusivePricesBooster,
  ProductDetails,
  Wrapper,
} from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/VerticalProductCard/style';
import Ratings from 'components/MicrositeV2/EntertainmentMBLandingPageV2/Ratings';
import DiscountTag from 'components/Product/components/DiscountTag';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { shouldDisplayCollectionRatings } from 'utils';
import { trackEvent } from 'utils/analytics';
import {
  getBoosterValueFromListingPrice,
  getEntertainmentMbProductCardDiscountTagString,
  getOpeningDate,
  getProductCardDestination,
} from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CASHBACK_TYPES,
} from 'const/index';
import VerticalProductImagePlaceholder from 'assets/verticalProductImagePlaceholder';

const VerticalProductCard = ({
  product,
  background = 'LIGHT',
  isMobile,
  isTopShowsSection = false,
}: TVerticalProductCardProps) => {
  const { lang, nakedDomain, redirectToHeadoutBookingFlow, isDev, host } =
    useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);

  const hsid = useRecoilValue(hsidAtom);

  if (!product) return null;

  const {
    title,
    name,
    ratingCount,
    averageRating,
    listingPrice,
    showPageUid,
    reopeningDate,
    primaryCategory,
    primarySubCategory,
    tgid,
    flowType,
    urlSlugs,
    verticalImage,
  } = product;

  const { cashbackType } = listingPrice ?? {};
  const { url: verticalImageUrl } = verticalImage ?? {};
  const {
    percentageSaved,
    shouldShowcashbackElement,
    cashbackValue,
    bestDiscount,
  } = getBoosterValueFromListingPrice(listingPrice);

  const { displayName: subCategoryName, id: subCategoryId } =
    primarySubCategory ?? {};

  const { localisedOpeningDate, OPENING_ON } =
    getOpeningDate({
      categoryId: subCategoryId,
      lang,
      reopeningDate,
    }) ?? {};

  const onProductCardClick = () => {
    const { destinationUrl } = getProductCardDestination({
      nakedDomain,
      lang,
      tgid,
      redirectToHeadoutBookingFlow,
      currency,
      flowType,
      urlSlugs,
      showPageUid,
      isDev,
      host,
      hsid,
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.EXPERIENCE_CARD_CLICKED,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CATEGORY_ID]: primaryCategory?.id,
      [ANALYTICS_PROPERTIES.CATEGORY_NAME]: primaryCategory?.displayName,
      [ANALYTICS_PROPERTIES.SUB_CAT_ID]: primarySubCategory?.id,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: primarySubCategory?.displayName,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: 167,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: title ?? name,
      [ANALYTICS_PROPERTIES.CARD_TYPE]: 'Product Card',
      [ANALYTICS_PROPERTIES.DIV_TYPE]: 'Product List',
      [ANALYTICS_PROPERTIES.CASHBACK_SHOWN]:
        cashbackValue > 0 && cashbackType === CASHBACK_TYPES.PERCENTAGE,
      [ANALYTICS_PROPERTIES.DISCOUNT_SHOWN]:
        percentageSaved > 0 ? 'Scratch Price' : null,
      [ANALYTICS_PROPERTIES.L1_BOOSTER_SHOWN]: false,
    });

    if (isMobile) {
      window.open(destinationUrl, '_self', 'noopener');
    } else {
      window.open(destinationUrl, '_blank');
    }
  };
  return (
    <Wrapper
      darkTheme={background === 'DARK'}
      onClick={onProductCardClick}
      hoverEffect={!isTopShowsSection}
      isVerticalImageUrlPresent={!!verticalImageUrl}
    >
      <Image
        draggable={false}
        url={verticalImageUrl}
        alt={`${title} product image`}
        autoCrop={true}
        className={`pinned-card-vertical-image`}
        fitCrop={true}
        loadHigherQualityImage={true}
        height={isMobile ? 180 : 270}
        width={isMobile ? 120 : 180}
      />
      <span className="image-placeholder">
        <VerticalProductImagePlaceholder
          $width={isMobile ? 120 : 180}
          $height={isMobile ? 180 : 270}
        />
      </span>
      <ProductDetails darkTheme={background === 'DARK'}>
        <div className="row">
          <span className="subcategory-name">
            {subCategoryName?.toUpperCase()}
          </span>
          <Conditional
            if={shouldDisplayCollectionRatings({
              averageRating,
              ratingsCount: ratingCount,
            })}
          >
            <Ratings
              averageRating={averageRating}
              ratingCount={ratingCount}
              showReviewsText={false}
              showCount={!isMobile}
            />
          </Conditional>
        </div>
        <p>{title ?? name}</p>
        <Conditional if={reopeningDate}>
          <Conditional if={localisedOpeningDate}>
            <div className="tags">
              {OPENING_ON} {localisedOpeningDate}
            </div>
          </Conditional>
        </Conditional>
        <PriceBlock
          listingPrice={listingPrice}
          lang="en"
          showScratchPrice={true}
          prefix={true}
        />
        <Conditional if={bestDiscount > 0 || shouldShowcashbackElement}>
          <ExclusivePricesBooster>
            <div className="booster-text">
              <DiscountTag
                discount={getEntertainmentMbProductCardDiscountTagString({
                  bestDiscount,
                  shouldShowcashbackElement,
                  cashbackValue,
                })}
              />
            </div>
          </ExclusivePricesBooster>
        </Conditional>
      </ProductDetails>
    </Wrapper>
  );
};

export default VerticalProductCard;
