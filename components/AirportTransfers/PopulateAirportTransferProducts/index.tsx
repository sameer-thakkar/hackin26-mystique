import { ReactNode, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { TransferTypeTabs } from 'components/AirportTransfers/TransferTypeTabs';
import Conditional from 'components/common/Conditional';
import { ConditionallyLazyComponent } from 'components/common/LazyComponent';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { debounce } from 'utils/gen';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import { TScorpioData, TTour } from '../interface';
import { TPrivateAirportTransferProductCardProps } from '../PrivateAirportTransferProductCard/interface';
import { TPopulateAirportTransferProductsProps } from './interface';
import {
  StyledContainer,
  StyledProductCardsContainer,
  StyledSectionInfo,
  StyledSectionTitle,
} from './styles';

const PrivateAirportTranferProductCard =
  dynamic<TPrivateAirportTransferProductCardProps>(() =>
    import(
      /* webpackChunkName: "PrivateAirportTransferProductCard" */
      'components/AirportTransfers/PrivateAirportTransferProductCard/index'
    ).then((mod) => mod.PrivateAirportTranferProductCard)
  );

const TAB_ORDER_MAP = {
  private: ['private', 'shared'],
  shared: ['shared', 'private'],
} as const;

let isFirstLoad = true;

export const PopulateAirportTransfersProducts = ({
  isMobile,
  uncategorizedTours,
  scorpioData,
  city,
  sharedTransferProducts,
  uid,
  currentLanguage,
}: TPopulateAirportTransferProductsProps) => {
  const cityCode = city.cityCode;

  const availableToursList = uncategorizedTours?.filter((tour: any) => {
    const checkIfScorpioHighlightsExist =
      scorpioData[tour.tgid]?.isMBHighlightsExist;

    return (
      !!scorpioData[tour.tgid]?.available &&
      (checkIfScorpioHighlightsExist || tour?.tour_description_override?.length)
    );
  });

  const cityCountryString = `${city.city}, ${city.country}`;

  const privateTransfersProductsList =
    availableToursList?.filter(
      (tour) => tour?.flowType === BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER
    ) ?? [];

  const hasSharedTransferProducts =
    availableToursList.length - privateTransfersProductsList.length > 0;

  const router = useRouter();
  const { airport_transfer_type } = router.query;

  const firstTransferTypeToShowFromQuery =
    airport_transfer_type === 'private' ? 'private' : 'shared';

  const [activeTab, setActiveTab] = useState<'private' | 'shared'>(
    firstTransferTypeToShowFromQuery
  );

  const tabOrder = TAB_ORDER_MAP[firstTransferTypeToShowFromQuery];

  const sharedTransfersHeadingRef = useRef<HTMLDivElement>(null);

  const privateTransfersHeadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const sharedTransfersHeading = sharedTransfersHeadingRef?.current;
      const privateTransfersHeading = privateTransfersHeadingRef?.current;

      const firstHeading =
        tabOrder[0] === 'private'
          ? privateTransfersHeading
          : sharedTransfersHeading;

      if (!firstHeading) return;

      const isSharedTranfersVisible =
        firstHeading.getBoundingClientRect().top >= 100;

      if (isSharedTranfersVisible) {
        setActiveTab(tabOrder[0]);
        return;
      }
    }, 50);

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tab: 'private' | 'shared') => {
    if (
      !privateTransfersHeadingRef?.current ||
      !sharedTransfersHeadingRef?.current
    )
      return;

    const targetRef =
      tab === 'private'
        ? privateTransfersHeadingRef
        : sharedTransfersHeadingRef;

    if (!targetRef?.current) return;

    const isSecondTab = tabOrder.indexOf(tab) === 1;

    const scrollToTarget = (offset = 90) => {
      window.scrollTo({
        top: targetRef?.current?.offsetTop! - offset,
        behavior: 'smooth',
      });
    };

    // Some components are not loaded on first render (lazy), so we need to scroll again after they are loaded
    if (isFirstLoad && isSecondTab) {
      scrollToTarget(-100);

      window.addEventListener('scrollend', () => scrollToTarget(75), {
        once: true,
      });

      isFirstLoad = false;
    } else {
      scrollToTarget();
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_TAB_CLICKED,
      Label:
        tab === 'private'
          ? en.AIRPORT_TRANSFER.PRIVATE_TRANSFERS
          : en.AIRPORT_TRANSFER.SHARED_TRANSFERS,
    });
  };

  const sharedTransfersVisibilityTrackingRef = useRef(null);

  const privateTransfersVisibilityTrackingRef = useRef(null);

  const isSharedTransfersVisible = useOnScreen({
    ref: sharedTransfersVisibilityTrackingRef,
    unobserve: true,
  });

  const isPrivateTransfersVisible = useOnScreen({
    ref: privateTransfersVisibilityTrackingRef,
    unobserve: true,
  });

  useEffect(() => {
    if (isSharedTransfersVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: en.AIRPORT_TRANSFER.SHARED_TRANSFERS,
        [ANALYTICS_PROPERTIES.RANKING]: tabOrder.indexOf('shared') + 1,
      });
    }
  }, [isSharedTransfersVisible]);

  useEffect(() => {
    if (isPrivateTransfersVisible) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: en.AIRPORT_TRANSFER.PRIVATE_TRANSFERS,
        [ANALYTICS_PROPERTIES.RANKING]: tabOrder.indexOf('private') + 1,
      });
    }
  }, [isPrivateTransfersVisible]);

  return (
    <StyledContainer>
      <Conditional
        if={privateTransfersProductsList.length && hasSharedTransferProducts}
      >
        <TransferTypeTabs
          tabOrder={tabOrder}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTabClick={handleTabClick}
        />
      </Conditional>

      {tabOrder.map((tab) => {
        if (tab === 'shared') {
          return (
            <SharedTransfersSection
              key={tab}
              sharedTransferProducts={sharedTransferProducts}
              cityCountryString={cityCountryString}
              hasSharedTransferProducts={hasSharedTransferProducts}
              sharedTransfersHeadingRef={sharedTransfersHeadingRef}
            />
          );
        }

        return (
          <PrivateTransfersSection
            isFirst={tab === tabOrder[0]}
            key={tab}
            privateTransfersProductsList={privateTransfersProductsList}
            cityCountryString={cityCountryString}
            cityCode={cityCode}
            isMobile={isMobile}
            uid={uid}
            scorpioData={scorpioData}
            currentLanguage={currentLanguage}
            privateTransfersHeadingRef={privateTransfersHeadingRef}
          />
        );
      })}
    </StyledContainer>
  );
};

const SharedTransfersSection = ({
  sharedTransferProducts,
  cityCountryString,
  hasSharedTransferProducts,
  sharedTransfersHeadingRef,
}: {
  sharedTransferProducts: ReactNode;
  cityCountryString: string;
  hasSharedTransferProducts: boolean;
  sharedTransfersHeadingRef: React.RefObject<HTMLDivElement>;
}) => {
  if (!hasSharedTransferProducts) return null;

  return (
    <>
      <StyledSectionTitle ref={sharedTransfersHeadingRef}>
        {strings.formatString(
          strings.AIRPORT_TRANSFER.SHARED_TRANSFERS_IN,
          cityCountryString
        )}
      </StyledSectionTitle>

      <StyledSectionInfo>
        {strings.AIRPORT_TRANSFER.SHARED_TRANSFERS_DESCRIPTION}
      </StyledSectionInfo>

      <div className="shared-transfer-products">{sharedTransferProducts}</div>
    </>
  );
};

const PrivateTransfersSection = ({
  privateTransfersProductsList,
  cityCountryString,
  cityCode,
  isMobile,
  uid,
  scorpioData,
  currentLanguage,
  privateTransfersHeadingRef,
  isFirst,
}: {
  privateTransfersProductsList: TTour[];
  cityCountryString: string;
  cityCode: string;
  isMobile: boolean;
  uid: string;
  scorpioData: TScorpioData[];
  currentLanguage: string;
  privateTransfersHeadingRef: React.RefObject<HTMLDivElement>;
  isFirst: boolean;
}) => {
  if (privateTransfersProductsList.length === 0) return null;

  return (
    <>
      <StyledSectionTitle ref={privateTransfersHeadingRef}>
        {strings.formatString(
          strings.AIRPORT_TRANSFER.PRIVATE_TRANSFERS_IN,
          cityCountryString
        )}
      </StyledSectionTitle>

      <StyledSectionInfo>
        {strings.AIRPORT_TRANSFER.PRIVATE_TRANSFERS_DESCRIPTION}
      </StyledSectionInfo>

      <StyledProductCardsContainer>
        {privateTransfersProductsList.map((tour, index) => (
          <ConditionallyLazyComponent
            key={tour.tgid}
            isLazy={!isFirst}
            placeholderHeight="13rem"
          >
            <PrivateAirportTranferProductCard
              index={index}
              cityCode={cityCode}
              isMobile={isMobile}
              key={tour.tgid}
              tour={tour}
              uid={uid}
              scorpioData={scorpioData[tour.tgid]}
              currentLanguage={currentLanguage}
            />
          </ConditionallyLazyComponent>
        ))}
      </StyledProductCardsContainer>
    </>
  );
};
