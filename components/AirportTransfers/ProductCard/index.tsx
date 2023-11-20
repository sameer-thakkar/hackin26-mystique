import { useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import parse from 'url-parse';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import { HighlightTabs } from 'components/Product/components/ProductHighlightTabs';
import { PRODUCT_CARD_IMAGE_DIMENSIONS } from 'components/Product/styles';
import MediaCarousel from 'UI/MediaCarousel';
import { MBContext } from 'contexts/MBContext';
import { useAirportsList } from 'hooks/useAirportsList';
import { createBookingURL } from 'utils';
import { extractTabsFromHighlights } from 'utils/productUtils';
import { currencyAtom } from 'store/atoms/currency';
import COLORS from 'const/colors';
import { ClockSvg, StarIcon } from 'const/descriptorIcons';
import { MEDIA_CAROUSEL_IMAGE_LIMIT } from 'const/index';
import { strings } from 'const/strings';
import {
  BoltSVG,
  CarIconSVG,
  CircleSVG,
  LocationPinPurpleSVG,
  ShieldTickSVG,
  SwapArrowsSVG,
  TailedArrowSVG,
} from 'assets/airportTransfers';
import { TPrivateAirportTransferProductCardProps } from './interface';
import { MoreDetailsSideDrawer } from './MoreDetailsSideDrawer';
import {
  DescriptorsContainer,
  LineSeparator,
  LocationFromAndToMobile,
  LocationFromToDesktop,
  mobileDrawerStyles,
  MoreDetailsButton,
  PricingAndCTASection,
  RatingAndDurationContainer,
  StyledDescriptorContainer,
  StyledProductCardContainer,
  StyledProductCardContent,
  StyledProductTitle,
  VeritcalDashedSeparator,
} from './styles';

export const PrivateAirportTranferProductCard = ({
  isMobile,
  scorpioData,
  tour,
  uid,
  currentLanguage,
  cityCode,
}: TPrivateAirportTransferProductCardProps) => {
  const [isMoreDetailsSidebarOpen, setIsMoreDetailsSidebarOpen] = useState(
    false
  );

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const {
    title,
    averageRating,
    ratingCount,
    images,
    listingPrice,
  } = scorpioData;

  const {
    biLink,
    bookSubdomain,
    isDev,
    host,
    redirectToHeadoutBookingFlow,
  } = useContext(MBContext);

  const currency = useRecoilValue(currencyAtom);

  const [isLoading, setIsLoading] = useState(false);

  const { data: airportsList } = useAirportsList(cityCode);

  const airportName =
    airportsList?.find((a) => a.tourGroupId === tour.tgid)?.name ?? 'Airport';

  let url = host || window.location.host;
  const currentHost = !isDev ? url : parse(uid, true).pathname;

  const hostName = currentHost.includes('stage')
    ? currentHost.replace('stage-', '')
    : currentHost;
  let hostSplit = hostName.split('.');
  hostSplit.shift();
  const bookingUrl = hostSplit.join('.');

  const productBookingUrl = createBookingURL({
    nakedDomain: bookingUrl,
    lang: currentLanguage,
    currency,
    tgid: tour.tgid,
    promoCode: null,
    tourId: String(listingPrice.tourId),
    biLink,
    date: null,
    isMobile,
    bookSubdomain,
    redirectToHeadoutBookingFlow,
    ctaSuffix: tour.cta_url_suffix ?? '',
    flowType: tour.flowType,
  });

  const { finalPrice, localSymbol } = listingPrice;

  const { highlights, tabs } = isMobile
    ? extractTabsFromHighlights(scorpioData.highlights)
    : { highlights: scorpioData.highlights, tabs: [] };

  useEffect(() => {
    if (!isMobile) return;

    const removeLoading = () => setIsLoading(false);

    window.addEventListener('pagehide', removeLoading);
  }, []);

  const handleCTAClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 6000);
  };

  return (
    <StyledProductCardContainer>
      <div className="card-images-carousel">
        <MediaCarousel
          imageList={images?.slice(0, MEDIA_CAROUSEL_IMAGE_LIMIT)}
          imageId="card-img"
          imageAspectRatio={isMobile ? '21:9' : '1.186'}
          backgroundColor={COLORS.GRAY.G7}
          imageWidth={
            isMobile ? PRODUCT_CARD_IMAGE_DIMENSIONS.MOBILE.width : undefined
          }
          imageHeight={PRODUCT_CARD_IMAGE_DIMENSIONS.DESKTOP.height}
          isFirstProduct={false}
          tgid={String(tour.tgid)}
          isMobile={isMobile}
        />
      </div>

      <StyledProductCardContent>
        <StyledProductTitle>{title}</StyledProductTitle>

        <RatingAndDurationContainer>
          <StarIcon />
          <span className="rating">{averageRating}</span>
          <span className="ratings-count">({ratingCount})</span>

          <LineSeparator />

          <Descriptor icon={<ClockSvg />} text="30 mins" />
        </RatingAndDurationContainer>

        <Conditional if={!isMobile}>
          <LocationFromToDesktop>
            <CircleSVG />
            <span>{airportName}</span>

            <div className="dotted-line"></div>

            <LocationPinPurpleSVG />
            <span className="anywhere-chip">
              {strings.AIRPORT_TRANSFER.ANYWHERE_IN_THE_CITY}
            </span>
          </LocationFromToDesktop>
        </Conditional>

        <Conditional if={isMobile}>
          <LocationFromAndToMobile>
            <LocationPinPurpleSVG />
            <span>{airportName}</span>

            <SwapArrowsSVG className="swap" />

            <LocationPinPurpleSVG />

            <span>{strings.AIRPORT_TRANSFER.ANYWHERE_IN_THE_CITY}</span>
          </LocationFromAndToMobile>
        </Conditional>

        <DescriptorsContainer>
          <Descriptor
            icon={<CarIconSVG />}
            text={strings.AIRPORT_TRANSFER.DESCRIPTORS.MULTIPLE_VEHICLE}
          />

          <LineSeparator />

          <Descriptor
            icon={<ShieldTickSVG />}
            text={strings.AIRPORT_TRANSFER.DESCRIPTORS.FREE_CANCELLATION}
          />

          <LineSeparator />

          <Descriptor
            icon={<BoltSVG />}
            text={strings.DESCRIPTORS.INSTANT_CONFIRMATION}
          />

          <LineSeparator />

          <MoreDetailsButton onClick={() => setIsMoreDetailsSidebarOpen(true)}>
            More Details
            <TailedArrowSVG />
          </MoreDetailsButton>
        </DescriptorsContainer>
      </StyledProductCardContent>

      <VeritcalDashedSeparator />

      <PricingAndCTASection>
        <div className="scratch-price">
          {/* from <span className="scratch-price-amount">$ 83</span> */}
        </div>

        <div className="price">
          <span>
            {localSymbol} {finalPrice}
          </span>
        </div>

        <a
          target={isMobile ? '_self' : '_blank'}
          href={productBookingUrl}
          rel="nofollow noreferrer"
          className="booking-link"
        >
          <Button
            width={isMobile ? '100%' : '15.75rem'}
            size="medium"
            color="purps"
            variant="primary"
            isLoading={isLoading}
            onClick={isMobile ? handleCTAClick : undefined}
            tabIndex={0}
            text={strings.CHECK_AVAIL}
          />
        </a>

        <Conditional if={isMobile}>
          <Button
            className="more-details"
            width={'100%'}
            size="medium"
            color="purps"
            variant="tertiary"
            isLoading={false}
            onClick={() => setIsMoreDetailsSidebarOpen(true)}
            tabIndex={0}
            text={strings.MORE_DETAILS}
          />
        </Conditional>
      </PricingAndCTASection>

      <Conditional if={isMoreDetailsSidebarOpen && !isMobile}>
        <MoreDetailsSideDrawer
          onClose={() => setIsMoreDetailsSidebarOpen(false)}
          title={title}
          averageRating={averageRating}
          ratingsCount={ratingCount}
          listingPrice={listingPrice}
          productBookingUrl={productBookingUrl}
          highlights={scorpioData.highlights}
        />
      </Conditional>

      <Conditional if={isMoreDetailsSidebarOpen && isMobile}>
        <Drawer
          className="product-details-drawer"
          hideSeparator
          $drawerStyles={mobileDrawerStyles}
          heading={title}
          closeHandler={() => setIsMoreDetailsSidebarOpen(false)}
        >
          <RatingAndDurationContainer>
            <StarIcon />
            <span className="rating">{averageRating}</span>
            <span className="ratings-count">({ratingCount})</span>
          </RatingAndDurationContainer>

          <HighlightTabs
            className="product-highlight-tabs"
            isLoading={false}
            onTabChange={({ index }: { index: number }) =>
              setActiveTabIndex(index)
            }
            hasRegularHighlights={highlights.length > 0}
            tabs={tabs}
            pageType={''}
            activeTabIndex={activeTabIndex}
            showCard={true}
          />

          <PricingAndCTASection>
            <div className="scratch-price"></div>

            <div className="price">
              <span>
                {localSymbol} {finalPrice}
              </span>
            </div>

            <a
              target={isMobile ? '_self' : '_blank'}
              href={productBookingUrl}
              rel="nofollow noreferrer"
              className="booking-link"
            >
              <Button
                width={isMobile ? '100%' : '15.75rem'}
                size="medium"
                color="purps"
                variant="primary"
                isLoading={isLoading}
                onClick={isMobile ? handleCTAClick : undefined}
                tabIndex={0}
                text={'Check availability'}
              />
            </a>
          </PricingAndCTASection>
        </Drawer>
      </Conditional>
    </StyledProductCardContainer>
  );
};

const Descriptor = ({ icon, text }: { icon: any; text: string }) => (
  <StyledDescriptorContainer className="descriptor">
    {icon}
    <span className="descriptor-text">{text}</span>
  </StyledDescriptorContainer>
);
