import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { THorizontalProductCardProps } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/HorizontalProductCard/interface';
import {
  ProductDetails,
  Wrapper,
} from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/HorizontalProductCard/style';
import { ExclusivePricesBooster } from 'components/MicrositeV2/EntertainmentMBLandingPageV2/ProductCards/VerticalProductCard/style';
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
}: THorizontalProductCardProps) => {
  const { lang, nakedDomain, redirectToHeadoutBookingFlow, isDev, host } =
    useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);

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
    const { destinationUrl, showPageExists } = getProductCardDestination({
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

    if (showPageExists) {
      window.open(destinationUrl, '_self', 'noopener');
    } else {
      window.open(destinationUrl, '_self', 'noopener');
    }
  };

  return (
    <Wrapper
      hoverEffect={!isTopShowsSection}
      onClick={onProductCardClick}
      isVerticalImageUrlPresent={!!verticalImageUrl}
    >
      <Image
        url={verticalImageUrl}
        alt={`${title} product image`}
        className={`pinned-card-image`}
        height={140}
        width={88}
        fitCrop
        autoCrop
      />
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
        <div className="price-wrapper">
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
        </div>
      </ProductDetails>
    </Wrapper>
  );
};

export default HorizontalProductCard;
