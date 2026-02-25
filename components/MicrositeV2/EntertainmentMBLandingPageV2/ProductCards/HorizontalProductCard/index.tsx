import { useContext, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { css } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { THorizontalProductCardProps } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/HorizontalProductCard/interface';
import {
  ProductDetails,
  Wrapper,
} from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/HorizontalProductCard/style';
import Ratings from 'components/MicrositeV2/EntertainmentMBLandingPageV2/Ratings';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { shouldDisplayCollectionRatings } from 'utils';
import { trackEvent } from 'utils/analytics';
import {
  getBoosterValueFromListingPrice,
  getCustomDiscountTag,
  getOpeningDate,
  getProductCardDestination,
} from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { hsidAtom } from 'store/atoms/hsid';
import { metaAtom } from 'store/atoms/meta';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CASHBACK_TYPES,
} from 'const/index';
import VerticalProductImagePlaceholder from 'assets/verticalProductImagePlaceholder';

const HorizontalProductCard = ({
  product,
  background = 'LIGHT',
  isTopShowsSection = false,
  handleChildLoaded,
}: THorizontalProductCardProps) => {
  const { lang, nakedDomain, redirectToHeadoutBookingFlow, isDev, host } =
    useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);

  const { collectionId: refererCollectionId } = useRecoilValue(metaAtom);

  const hsid = useRecoilValue(hsidAtom);

  useEffect(() => {
    handleChildLoaded?.();
  }, []);

  if (!product) return null;

  const {
    title,
    ratingCount,
    averageRating,
    listingPrice,
    urlSlugs,
    primarySubCategory,
    primaryCategory,
    reopeningDate,
    tgid,
    flowType,
    showPageUid,
    verticalImage,
  } = product;
  const { displayName: primarySubCategoryName } = primarySubCategory;
  const { cashbackType } = listingPrice ?? {};
  const { url: verticalImageUrl } = verticalImage ?? {};

  const {
    percentageSaved,
    shouldShowcashbackElement,
    cashbackValue,
    bestDiscount,
  } = getBoosterValueFromListingPrice(listingPrice);

  const { localisedOpeningDate, OPENING_ON } =
    getOpeningDate({
      categoryId: primaryCategory.id,
      lang,
      reopeningDate,
    }) ?? {};

  const onProductCardClick = () => {
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
  };

  const { destinationUrl, showPageExists } = getProductCardDestination({
    nakedDomain,
    lang,
    tgid,
    refererCollectionId,
    redirectToHeadoutBookingFlow,
    currency,
    flowType,
    urlSlugs,
    showPageUid,
    isDev,
    host,
    hsid,
  });
  const hrefAttribute = showPageExists ? { href: destinationUrl } : {};
  const customDiscountTag = getCustomDiscountTag({
    bestDiscount,
    cashbackValue,
    shouldShowcashbackElement,
  });

  return (
    <Wrapper
      hoverEffect={!isTopShowsSection}
      isVerticalImageUrlPresent={!!verticalImageUrl}
      target="_blank"
      onClick={onProductCardClick}
      {...hrefAttribute}
      rel="nofollow noopener"
    >
      <div
        className={css({
          position: 'relative',
          marginRight: '0.75rem',
        })}
      >
        <Image
          url={verticalImageUrl}
          alt={`${title} product image`}
          className={`pinned-card-image`}
          height={140}
          width={88}
          fitCrop
          autoCrop
          loadHigherQualityImage={true}
        />
      </div>
      <div className="image-placeholder">
        <VerticalProductImagePlaceholder $width={88} $height={131} />
      </div>
      <ProductDetails darkTheme={background === 'DARK'}>
        <div className="descriptors">{primarySubCategoryName}</div>
        <p className="show-title">{title}</p>
        <Conditional
          if={shouldDisplayCollectionRatings({
            averageRating,
            ratingsCount: ratingCount,
          })}
        >
          <Ratings
            averageRating={averageRating}
            ratingCount={ratingCount}
            showReviewsText={true}
          />
        </Conditional>
        <Conditional if={localisedOpeningDate}>
          <div className="tags">
            <Conditional if={localisedOpeningDate}>
              {OPENING_ON} {localisedOpeningDate}
            </Conditional>
          </div>
        </Conditional>
        <PriceBlock
          listingPrice={listingPrice}
          lang={lang}
          showScratchPrice={true}
          prefix={true}
          customDiscountTag={customDiscountTag}
        />
      </ProductDetails>
    </Wrapper>
  );
};

export default HorizontalProductCard;
