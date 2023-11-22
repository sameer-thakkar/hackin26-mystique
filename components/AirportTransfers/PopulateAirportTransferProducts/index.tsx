import { ReactNode, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { PrivateAirportTranferProductCard } from 'components/AirportTransfers/ProductCard/index';
import { TransferTypeTabs } from 'components/AirportTransfers/TransferTypeTabs';
import Conditional from 'components/common/Conditional';
import { debounce } from 'utils/gen';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import { strings } from 'const/strings';
import {
  TPopulateAirportTransferProductsProps,
  TScorpioData,
  TTour,
} from './interfaces';
import {
  StyledContainer,
  StyledProductCardsContainer,
  StyledSectionInfo,
  StyledSectionTitle,
} from './styles';

const TAB_ORDER_MAP = {
  private: ['private', 'shared'],
  shared: ['shared', 'private'],
} as const;

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
      (tour) => tour?.flowType === BOOKING_FLOW_TYPE.AIRPORT_TRANSFER
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

    if (tab === 'private') {
      window.scrollTo({
        top: privateTransfersHeadingRef?.current?.offsetTop - 100,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: sharedTransfersHeadingRef?.current?.offsetTop - 120,
        behavior: 'smooth',
      });
    }
  };

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
}: {
  privateTransfersProductsList: TTour[];
  cityCountryString: string;
  cityCode: string;
  isMobile: boolean;
  uid: string;
  scorpioData: TScorpioData[];
  currentLanguage: string;
  privateTransfersHeadingRef: React.RefObject<HTMLDivElement>;
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
        {privateTransfersProductsList.map((tour) => (
          <PrivateAirportTranferProductCard
            cityCode={cityCode}
            isMobile={isMobile}
            key={tour.tgid}
            tour={tour}
            uid={uid}
            scorpioData={scorpioData[tour.tgid]}
            currentLanguage={currentLanguage}
          />
        ))}
      </StyledProductCardsContainer>
    </>
  );
};
