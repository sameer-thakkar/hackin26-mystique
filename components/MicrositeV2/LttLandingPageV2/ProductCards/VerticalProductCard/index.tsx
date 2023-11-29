import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { TVerticalProductCardProps } from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard/interface';
import {
  ExclusivePricesBooster,
  ProductDetails,
  Wrapper,
} from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard/style';
import Ratings from 'components/MicrositeV2/LttLandingPageV2/Ratings';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { shouldDisplayCollectionRatings } from 'utils';
import { trackEvent } from 'utils/analytics';
import {
  getBoosterValueFromListingPrice,
  getOpeningDate,
  getProductCardDestination,
} from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CASHBACK_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import {
  VERTICAL_PRODUCT_IMAGE_PLACEHOLDER,
  WALLET_SVG,
} from 'assets/SvgIcons';

const VerticalProductCard = ({
  product,
  background = 'LIGHT',
  isMobile,
  isTopLttShow = false,
}: TVerticalProductCardProps) => {
  const {
    lang,
    nakedDomain,
    redirectToHeadoutBookingFlow,
    isDev,
    host,
  } = useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);

  if (!product) return null;

  const {
    title,
    reviewCount,
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
  } = getBoosterValueFromListingPrice(listingPrice);

  const { name: subCategoryName, id: subCategoryId } = primarySubCategory ?? {};

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
      window.open(destinationUrl, '_self', 'noopener,noreferrer');
    } else {
      window.open(destinationUrl, '_blank');
    }
  };
  return (
    <Wrapper
      darkTheme={background === 'DARK'}
      onClick={onProductCardClick}
      hoverEffect={!isTopLttShow}
      isVerticalImageUrlPresent={!!verticalImageUrl}
    >
      <Image
        draggable={false}
        url={verticalImageUrl}
        alt={`${title} product image`}
        autoCrop={true}
        className={`pinned-card-vertical-image`}
        fitCrop={true}
        height={isMobile ? 180 : 270}
        width={isMobile ? 120 : 180}
      />
      <span className="image-placeholder">
        <VERTICAL_PRODUCT_IMAGE_PLACEHOLDER
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
              ratingsCount: reviewCount,
            })}
          >
            <Ratings
              averageRating={averageRating}
              reviewCount={reviewCount}
              showReviewsText={false}
              showCount={!isMobile}
            />
          </Conditional>
        </div>
        <p>{title}</p>
        <Conditional if={reopeningDate}>
          <div className="tags">
            <Conditional if={localisedOpeningDate}>
              {OPENING_ON} {localisedOpeningDate}
            </Conditional>
          </div>
        </Conditional>
        <PriceBlock
          listingPrice={listingPrice}
          lang="en"
          showScratchPrice={true}
          prefix={true}
        />
        <Conditional if={percentageSaved > 0 || shouldShowcashbackElement}>
          <ExclusivePricesBooster>
            {WALLET_SVG}
            <div className="booster-text">
              <Conditional if={percentageSaved > 0}>
                {strings.formatString(
                  strings.SAVE_UPTO_PERCENT,
                  `${percentageSaved}`
                )}
              </Conditional>
              <Conditional
                if={percentageSaved <= 0 && shouldShowcashbackElement}
              >
                {strings.formatString(strings.CASHBACK, `${cashbackValue}`)}
              </Conditional>
            </div>
          </ExclusivePricesBooster>
        </Conditional>
      </ProductDetails>
    </Wrapper>
  );
};

export default VerticalProductCard;
