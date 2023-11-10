import { useContext, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { TPinnedCardProps } from 'components/MicrositeV2/LttLandingPageV2/BannerV2PinnedCard/interface';
import {
  Container,
  Gradient,
  ProductDetails,
  SecondaryDescriptors,
  Wrapper,
} from 'components/MicrositeV2/LttLandingPageV2/BannerV2PinnedCard/style';
import HorizontalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/HorizontalProductCard';
import { ExclusivePricesBooster } from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard/style';
import Ratings from 'components/MicrositeV2/LttLandingPageV2/Ratings';
import Button from 'UI/Button';
import Image from 'UI/Image';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import {
  getBoosterValueFromListingPrice,
  getOpeningDate,
  getProductCardDestination,
} from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import { descriptorIcons } from 'const/descriptorIcons';
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

const PinnedCard = ({ pinnedTgidData, isMobile }: TPinnedCardProps) => {
  const {
    lang,
    nakedDomain,
    redirectToHeadoutBookingFlow,
    isDev,
    host,
  } = useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);
  const pinnedCard = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToCenter = () => {
      if (pinnedCard.current && !isMobile) {
        const rect = pinnedCard.current.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height / 2;
        const viewportCenterY = window.innerHeight / 2;
        const scrollTop = cardCenterY - viewportCenterY;

        setTimeout(() => {
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          });
        }, 0);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scrollToCenter);
    } else {
      scrollToCenter();
    }

    return () => {
      window.removeEventListener('DOMContentLoaded', scrollToCenter);
    };
  }, []);

  if (!pinnedTgidData) return null;

  const {
    title,
    reviewCount,
    descriptors: descriptorsFromProduct,
    averageRating,
    reopeningDate,
    secondaryDescriptors,
    listingPrice,
    urlSlugs,
    primaryCategory,
    tgid,
    showPageUid,
    flowType,
    primarySubCategory,
    microBrandsHighlight,
    verticalImage,
  } = pinnedTgidData;

  const { displayName: primarySubCategoryName } = primarySubCategory;
  const { url: verticalImageUrl } = verticalImage ?? {};

  let showDetails: Record<string, any> = {};

  showDetails['DURATION'] = microBrandsHighlight[strings.SHOW_PAGE.DURATION];
  showDetails['USER'] = microBrandsHighlight[strings.SHOW_PAGE.AGE_LIMIT];

  let descriptors: string[] =
    descriptorsFromProduct.length === 1
      ? descriptorsFromProduct[0].split('\n')
      : descriptorsFromProduct;
  descriptors = [primarySubCategoryName, ...descriptors];

  const allSecondaryDescriptors = [
    ...Object.entries(showDetails).map(([key, value]) => ({
      code: key,
      name: value,
    })),
    ...secondaryDescriptors,
  ];

  const {
    percentageSaved,
    shouldShowcashbackElement,
    cashbackValue,
  } = getBoosterValueFromListingPrice(listingPrice);

  const { localisedOpeningDate, OPENING_ON } =
    getOpeningDate({
      categoryId: primaryCategory?.id,
      lang,
      reopeningDate,
    }) ?? {};

  const onCheckavAilabilityClicked = () => {
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
    const { cashbackType } = listingPrice;

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
    window.open(destinationUrl, '_blank');
  };

  return (
    <Container ref={pinnedCard}>
      <h2>{strings.LTT_LANDING_PAGE.YOUR_PICK}</h2>
      <Conditional if={!isMobile}>
        <Wrapper isVerticalImageUrlPresent={!!verticalImageUrl}>
          <Image
            url={verticalImageUrl}
            alt={`${title} product image`}
            autoCrop={true}
            className={`pinned-card-image`}
            fitCrop={true}
            width={180}
            height={260}
          />
          <span className="image-placeholder">
            <VERTICAL_PRODUCT_IMAGE_PLACEHOLDER
              $height={isMobile ? 162 : 260}
              $width={isMobile ? 108 : 180}
            />
          </span>
          <ProductDetails>
            <div className="left">
              <h3>{title}</h3>
              <Ratings
                averageRating={averageRating}
                reviewCount={reviewCount}
                showReviewsText={false}
              />

              <div className="primary-descriptors">
                {descriptors.map((descriptor: string) => (
                  <div className="descriptor" key={descriptor}>
                    {descriptor}
                  </div>
                ))}
              </div>
              <Conditional if={localisedOpeningDate}>
                <div className="tags">
                  {OPENING_ON} {localisedOpeningDate}
                </div>
              </Conditional>

              <Conditional
                if={
                  allSecondaryDescriptors && allSecondaryDescriptors.length > 0
                }
              >
                <SecondaryDescriptors count={allSecondaryDescriptors.length}>
                  {allSecondaryDescriptors.map(
                    ({ code, name }: { code: string; name: string }) => {
                      const Icon = descriptorIcons[code];
                      return (
                        <div key={code} className="descriptor">
                          <Icon /> {name}
                        </div>
                      );
                    }
                  )}
                </SecondaryDescriptors>
              </Conditional>
            </div>
            <div className="right">
              <div className="price-wrapper">
                <PriceBlock
                  listingPrice={listingPrice}
                  lang="en"
                  showScratchPrice={true}
                  prefix={true}
                />
                <Conditional
                  if={percentageSaved > 0 || shouldShowcashbackElement}
                >
                  <ExclusivePricesBooster className="booster">
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
                        {strings.formatString(
                          strings.CASHBACK,
                          `${cashbackValue}`
                        )}
                      </Conditional>
                    </div>
                  </ExclusivePricesBooster>
                </Conditional>
              </div>
              <Button
                className={`banner-cta-button`}
                fillType="fill"
                onClick={onCheckavAilabilityClicked}
                role="button"
                tabIndex={0}
              >
                {strings.CHECK_AVAIL}
              </Button>
            </div>
          </ProductDetails>
        </Wrapper>
      </Conditional>
      <Conditional if={isMobile}>
        <div className="mweb-wrapper">
          <HorizontalProductCard
            product={pinnedTgidData}
            background="DARK"
            isTopLttShow={true}
          />
        </div>
      </Conditional>
      <Gradient />
    </Container>
  );
};

export default PinnedCard;
