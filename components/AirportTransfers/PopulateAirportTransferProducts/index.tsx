import { useEffect, useRef, useState } from 'react';
import { PrivateAirportTranferProductCard } from 'components/AirportTransfers/ProductCard/index';
import { TransferTypeTabs } from 'components/AirportTransfers/TransferTypeTabs';
import Conditional from 'components/common/Conditional';
import { debounce } from 'utils/gen';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import { strings } from 'const/strings';
import { TPopulateAirportTransferProductsProps } from './interfaces';
import {
  StyledContainer,
  StyledProductCardsContainer,
  StyledSectionInfo,
  StyledSectionTitle,
} from './styles';

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

  const sharedTransfersHeadingRef = useRef<HTMLDivElement>(null);

  const privateTransfersHeadingRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'private' | 'shared'>('shared');

  useEffect(() => {
    const handleScroll = debounce(() => {
      const sharedTransfersHeading = sharedTransfersHeadingRef?.current;

      if (!sharedTransfersHeading) return;

      const isSharedTranfersVisible =
        sharedTransfersHeading.getBoundingClientRect().top >= 100;

      if (isSharedTranfersVisible) {
        setActiveTab('shared');
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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTabClick={handleTabClick}
        />
      </Conditional>

      <Conditional if={hasSharedTransferProducts}>
        <StyledSectionTitle ref={sharedTransfersHeadingRef}>
          {strings.formatString(
            strings.AIRPORT_TRANSFER.SHARED_TRANSFERS_IN,
            cityCountryString
          )}
        </StyledSectionTitle>

        <StyledSectionInfo>
          {strings.AIRPORT_TRANSFER.SHARED_TRANSFERS_DESCRIPTION}
        </StyledSectionInfo>
      </Conditional>

      <div className="shared-transfer-products">
        {!hasSharedTransferProducts ? null : sharedTransferProducts}
      </div>

      <Conditional if={!!privateTransfersProductsList.length}>
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
      </Conditional>
    </StyledContainer>
  );
};
