import { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import { useToursWithEarliestAvailability } from 'hooks/useToursWithEarliestAvailability';
import { legacyBooleanCheck } from 'utils';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import { strings } from 'const/strings';
import { selectedSearchTabState } from '../HeroSection/state';
import { PrivateTransferCTACard } from '../PrivateTransferCTACard';
import { ProductCard } from '../ProductCard';
import {
  getAirportsList,
  getAirportTGIDsMap,
} from '../SearchUnit/SharedTransferSearch/utils';
import { sharedTransferSearchData } from '../SearchUnit/state';
import { SharedTransferTrustBoosterCard } from '../SharedTransferTrustBoosterCard';
import { AirportTabs } from './AirportTabs';
import { TAirportTransfersProductSectionProps } from './interface';
import {
  AirportProductsSection,
  ProductCardsContainer,
  SectionContainer,
  SectionTitle,
} from './style';

export const AirportTransferProductsSection = ({
  isMobile,
  tgidScorpioDataMap,
  uncategorizedTours,
  enableEarliestAvailability,
  currency,
  isSubCategoryPage,
}: TAirportTransfersProductSectionProps) => {
  const { primaryCity } = useContext(MBContext);

  const availableToursList = uncategorizedTours?.filter((tour: any) => {
    const doesScorpioHighlightsExist =
      tgidScorpioDataMap[tour.tgid]?.isMBHighlightsExist;

    return (
      !!tgidScorpioDataMap[tour.tgid]?.available &&
      (doesScorpioHighlightsExist || tour?.tour_description_override?.length)
    );
  });

  const showNextAvailable = legacyBooleanCheck(enableEarliestAvailability);

  const hasSearched = useRecoilValue(sharedTransferSearchData).hasSearched;

  const isSharedTabSelected =
    useRecoilValue(selectedSearchTabState) !== 'PRIVATE_TAB';

  const { toursWithEarliestAvailability } = useToursWithEarliestAvailability({
    tours: availableToursList,
    shouldFetchEarliestAvailabilities: showNextAvailable,
    currency: currency || '',
  });

  const airports = isSubCategoryPage
    ? getAirportsList(primaryCity?.cityCode || '')
    : [];

  const airportTGIDsMap = isSubCategoryPage
    ? getAirportTGIDsMap(primaryCity?.cityCode || '')
    : {};

  const privateTransferTours = toursWithEarliestAvailability.filter(
    (tour) => tour.flowType === BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER
  );

  const allOtherTours = toursWithEarliestAvailability.filter((tour) => {
    const scorpioData = tgidScorpioDataMap[tour.tgid];
    return scorpioData.primarySubCategory.name !== 'Airport Transfers';
  });

  if (allOtherTours.length > 0) {
    airports.push(strings.AIRPORT_TRANSFER.COMBOS_AND_EXTRAS);
    airportTGIDsMap[strings.AIRPORT_TRANSFER.COMBOS_AND_EXTRAS] =
      allOtherTours.map((tour) => tour.tgid);
  }

  const airportSectionsRef = useRef<HTMLDivElement[]>([]);

  const [selectedAirport, setSelectedAirport] = useState(
    () => getAirportsList(primaryCity?.cityCode || '')[0]
  );

  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    const airportSections = airportSectionsRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (
              airportSectionsRef.current.indexOf(
                entry.target as HTMLDivElement
              ) !== -1
            )
              setSelectedAirport(
                airports[
                  airportSectionsRef.current.indexOf(
                    entry.target as HTMLDivElement
                  )
                ]
              );
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: isMobile ? '-40% 0px -50%  0px' : '-20% 0px -70% 0px',
      }
    );

    observerRef.current = observer;

    airportSectionsRef.current.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      airportSections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onSelectAirport = (airport: string) => {
    setSelectedAirport(airport);

    const index = airports.indexOf(airport);

    if (airportSectionsRef.current[index]) {
      // Temporarily disconnect the observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      window.scrollTo({
        top:
          airportSectionsRef.current[index].offsetTop - (isMobile ? 118 : 118),
        behavior: 'smooth',
      });

      // Reconnect the observer when the scrolling has ended
      const handleScrollEnd = () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          if (observerRef.current) {
            airportSectionsRef.current.forEach((section) => {
              observerRef.current?.observe(section);
            });
          }
          window.removeEventListener('scroll', handleScrollEnd);
        }, 350);
      };

      window.addEventListener('scroll', handleScrollEnd);
    }
  };

  let totalIndex = 0;

  return (
    <>
      <SectionContainer>
        <SectionTitle $showSmaller={hasSearched && isSharedTabSelected}>
          {strings.AIRPORT_TRANSFER.EXPLORE_TRANSFERS}
        </SectionTitle>

        <Conditional if={isSubCategoryPage}>
          <AirportTabs
            airportsList={airports}
            selectedAirport={selectedAirport}
            setSelectedAirport={onSelectAirport}
            isMobile={isMobile}
          />
        </Conditional>

        <div className="flex">
          <div className="all-products">
            {airports?.map((airport, airportIndex) => (
              <AirportProductsSection
                key={airport}
                ref={(el) => el && airportSectionsRef.current.push(el)}
              >
                <Conditional
                  if={
                    airports.length > 0 &&
                    airportIndex !== 0 &&
                    isSubCategoryPage
                  }
                >
                  <h6 className="airport-name">{airport}</h6>
                </Conditional>

                <ProductCardsContainer>
                  {airportTGIDsMap[airport]?.map((tgid) => {
                    const tour = toursWithEarliestAvailability.find(
                      (tour) => tour.tgid === tgid
                    );

                    if (!tour) return null;

                    return (
                      <ProductCard
                        key={tgid}
                        tour={tour}
                        scorpioData={tgidScorpioDataMap[tgid]}
                        isMobile={isMobile}
                        position={totalIndex++ + 1} // pass in the true index
                      />
                    );
                  })}
                </ProductCardsContainer>

                <Conditional
                  if={
                    isMobile &&
                    airportIndex === 0 &&
                    privateTransferTours.length
                  }
                >
                  <PrivateTransferCTACard
                    scorpioData={
                      tgidScorpioDataMap[privateTransferTours[0]?.tgid]
                    }
                    tour={privateTransferTours[0]}
                    isMobile={isMobile}
                  />
                </Conditional>
              </AirportProductsSection>
            ))}
          </div>

          <Conditional if={!isMobile}>
            {privateTransferTours?.length ? (
              <PrivateTransferCTACard
                scorpioData={tgidScorpioDataMap[privateTransferTours[0]?.tgid]}
                tour={privateTransferTours[0]}
                isMobile={isMobile}
                hasAirportTabs={isSubCategoryPage}
              />
            ) : (
              <SharedTransferTrustBoosterCard
                hasAirportTabs={isSubCategoryPage}
              />
            )}
          </Conditional>
        </div>
      </SectionContainer>
    </>
  );
};
