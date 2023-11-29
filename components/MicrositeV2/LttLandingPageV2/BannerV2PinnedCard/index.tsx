import { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import { TPinnedCardProps } from 'components/MicrositeV2/LttLandingPageV2/BannerV2PinnedCard/interface';
import {
  Container,
  Gradient,
  ProductDetails,
  SecondaryDescriptors,
  Wrapper,
  YourPickHeader,
} from 'components/MicrositeV2/LttLandingPageV2/BannerV2PinnedCard/style';
import HorizontalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/HorizontalProductCard';
import { ExclusivePricesBooster } from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard/style';
import Ratings from 'components/MicrositeV2/LttLandingPageV2/Ratings';
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
  BUTTON_LOADING_DURATION,
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
  const [isButtonLoading, setButtonLoading] = useState(false);

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
    ...secondaryDescriptors?.map(
      ({ code, name }: { code: string; name: string }) => ({
        code,
        name: (strings.DESCRIPTORS as Record<string, string>)[code] ?? name,
      })
    ),
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
    setButtonLoading(false);
  };

  return (
    <Container ref={pinnedCard} isVerticalImageUrlPresent={!!verticalImageUrl}>
      <Conditional if={isMobile}>
        <h2>{strings.LTT_LANDING_PAGE.YOUR_PICK}</h2>
      </Conditional>
      <Conditional if={!isMobile}>
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

        <Wrapper onClick={onCheckavAilabilityClicked}>
          <YourPickHeader>
            <span className="star">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
              >
                <path
                  d="M5.11958 0.670821C5.23932 0.302297 5.76068 0.302296 5.88042 0.67082L6.86954 3.715C6.92309 3.8798 7.07667 3.99139 7.24996 3.99139H10.4508C10.8383 3.99139 10.9994 4.48724 10.6859 4.715L8.09638 6.5964C7.95618 6.69826 7.89752 6.87881 7.95107 7.04361L8.94018 10.0878C9.05992 10.4563 8.63813 10.7628 8.32465 10.535L5.73511 8.6536C5.59492 8.55174 5.40508 8.55174 5.26489 8.6536L2.67536 10.535C2.36187 10.7628 1.94008 10.4563 2.05982 10.0878L3.04893 7.04361C3.10248 6.87881 3.04382 6.69826 2.90362 6.5964L0.314093 4.715C0.000607252 4.48724 0.161717 3.99139 0.549206 3.99139H3.75004C3.92333 3.99139 4.07691 3.87981 4.13046 3.715L5.11958 0.670821Z"
                  fill="white"
                />
              </svg>
            </span>
            <h2>{strings.LTT_LANDING_PAGE.YOUR_PICK}</h2>
          </YourPickHeader>
          <ProductDetails>
            <div className="left">
              <Ratings
                averageRating={averageRating}
                reviewCount={reviewCount}
                showReviewsText={false}
              />
              <h3>{title}</h3>

              <div className="primary-descriptors">
                {descriptors.map((descriptor: string, index: number) => (
                  <>
                    <div className="descriptor" key={descriptor}>
                      {descriptor.toUpperCase()}
                    </div>
                    <Conditional if={index !== descriptors?.length - 1}>
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
              {/* <Button
                className={`banner-cta-button`}
                fillType="fill"
                onClick={onCheckavAilabilityClicked}
                role="button"
                tabIndex={0}
              >
                {strings.CHECK_AVAIL}
              </Button> */}
              <Button
                tabIndex={0}
                size="medium"
                color="purps"
                variant="primary"
                isLoading={isButtonLoading}
                disabled={!listingPrice}
                onClick={() => {
                  if (isButtonLoading) return;
                  setButtonLoading(true);
                  setTimeout(
                    () => setButtonLoading(false),
                    BUTTON_LOADING_DURATION
                  );
                  onCheckavAilabilityClicked();
                }}
                text={listingPrice ? strings.CHECK_AVAIL : strings.UNAVAILABLE}
              />
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
      <Conditional if={isMobile}>
        <Gradient />
      </Conditional>
    </Container>
  );
};

export default PinnedCard;
