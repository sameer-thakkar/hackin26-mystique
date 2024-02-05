import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import {
  ProductDetails,
  Wrapper,
} from 'components/MicrositeV2/LttLandingPageV2/ProductCards/HorizontalProductCard//style';
import { THorizontalProductCardProps } from 'components/MicrositeV2/LttLandingPageV2/ProductCards/HorizontalProductCard/interface';
import { ExclusivePricesBooster } from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard/style';
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
import VerticalProductImagePlaceholder from 'assets/verticalProductImagePlaceholder';
import WalletSvg from 'assets/walletSvg';

const HorizontalProductCard = ({
  product,
  background = 'LIGHT',
  isTopLttShow = false,
}: THorizontalProductCardProps) => {
  const { lang, nakedDomain, redirectToHeadoutBookingFlow, isDev, host } =
    useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);

  if (!product) return null;

  const {
    title,
    ratingCount,
    averageRating,
    descriptors: descriptorsFromProduct,
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

  const { percentageSaved, shouldShowcashbackElement, cashbackValue } =
    getBoosterValueFromListingPrice(listingPrice);

  const { localisedOpeningDate, OPENING_ON } =
    getOpeningDate({
      categoryId: primaryCategory.id,
      lang,
      reopeningDate,
    }) ?? {};

  let descriptors: string[] =
    descriptorsFromProduct.length === 1
      ? descriptorsFromProduct[0].split('\n')
      : descriptorsFromProduct;
  descriptors = [primarySubCategoryName, ...descriptors];
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
      window.open(destinationUrl, '_self', 'noopener,noreferrer');
    } else {
      window.open(destinationUrl, '_self', 'noopener,noreferrer');
    }
  };

  return (
    <Wrapper
      hoverEffect={!isTopLttShow}
      onClick={onProductCardClick}
      isVerticalImageUrlPresent={!!verticalImageUrl}
    >
      <Image
        url={verticalImageUrl}
        alt={`${title} product image`}
        autoCrop={true}
        className={`pinned-card-image`}
        fitCrop={true}
        height={162}
        width={108}
      />
      <div className="image-placeholder">
        <VerticalProductImagePlaceholder $width={108} $height={162} />
      </div>
      <ProductDetails darkTheme={background === 'DARK'}>
        <p className="show-title">{title}</p>
        <Conditional if={descriptors && descriptors.length > 0}>
          <div className="descriptors">
            {descriptors
              .slice(0, 3)
              .map((descriptor: string, index: number) => (
                <>
                  {descriptor}
                  <Conditional
                    if={index < 2 && index !== descriptors.length - 1}
                  >
                    <svg
                      width="3"
                      height="4"
                      viewBox="0 0 3 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="1.5" cy="2" r="1.5" fill="#888888" />
                    </svg>
                  </Conditional>
                </>
              ))}
          </div>
        </Conditional>
        <Conditional
          if={shouldDisplayCollectionRatings({
            averageRating,
            ratingsCount: ratingCount,
          })}
        >
          <Ratings
            averageRating={averageRating}
            reviewCount={ratingCount}
            showReviewsText={true}
          />
        </Conditional>
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
            {WalletSvg}
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

export default HorizontalProductCard;
