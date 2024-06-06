import { useContext, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import { Paginator } from 'UI/Paginator';
import { MBContext } from 'contexts/MBContext';
import { useToursWithEarliestAvailability } from 'hooks/useToursWithEarliestAvailability';
import { currencyAtom } from 'store/atoms/currency';
import { CITY_AIRPORT_STATION_TGID_MAP } from 'const/airportTransfers';
import { strings } from 'const/strings';
import { TTGIDScorpioDataMap, TTour } from '../interface';
import { ProductCard } from '../ProductCard';
import {
  sharedTransferDirection,
  sharedTransferReturn,
  sharedTransferSearchData,
} from '../SearchUnit/state';
import { SharedTransferTrustBoosterCard } from '../SharedTransferTrustBoosterCard';
import { TSearchResultsProps } from './interface';
import { LoadingSkeletons } from './LoadingSkeletons';
import { SearchResultsSectionContainer } from './style';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const swiperParams: SwiperProps = {
  spaceBetween: 16,
  centeredSlides: true,
  loop: true,
  slidesPerView: 'auto',
};

export const SearchResults = ({
  isMobile,
  tours,
  tgidScorpioDataMap,
}: TSearchResultsProps) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const { primaryCity } = useContext(MBContext);

  const { hasSearched, airport, isLoading, station, date } = useRecoilValue(
    sharedTransferSearchData
  );
  const direction = useRecoilValue(sharedTransferDirection);
  const isRoundTrip = useRecoilValue(sharedTransferReturn);

  const currency = useRecoilValue(currencyAtom);

  const { toursWithEarliestAvailability } = useToursWithEarliestAvailability({
    tours,
    currency: currency || '',
    shouldFetchEarliestAvailabilities: true,
  });

  const filteredTGIDs =
    hasSearched && airport && station
      ? getTGIDsByCityAirportStation({
          cityCode: primaryCity?.cityCode ?? '',
          airport,
          station,
        })
      : [];

  const availableFilteredTGIDs =
    filteredTGIDs.filter((tgid) =>
      toursWithEarliestAvailability.some((tour) => tour.tgid === tgid)
    ) ?? [];

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (availableFilteredTGIDs.length > 0 && sectionRef.current && isLoading) {
      window.scrollTo({
        top: sectionRef.current.offsetTop - (isMobile ? 48.5 : 76),
        behavior: 'smooth',
      });
    }
  }, [isLoading, availableFilteredTGIDs.length]);

  if (!hasSearched) {
    return null;
  }

  // This should ideally show a message that there are no results -
  // but since there's no design for that, we're just returning null
  if (availableFilteredTGIDs.length === 0) {
    return null;
  }

  const queryParamsForSelectPage = getQueryParamsForSelectPage({
    date,
    station,
    isRoundTrip,
    direction,
  });

  return (
    <SearchResultsSectionContainer
      $hasResults={filteredTGIDs.length > 0}
      ref={sectionRef}
    >
      <div className="title">{strings.AIRPORT_TRANSFER.TRANSFER_OPTIONS}</div>

      <p className="subtext">
        {availableFilteredTGIDs.length > 1
          ? strings.formatString(
              strings.AIRPORT_TRANSFER.TRANSFERS_AVAILABLE_PLURAL,
              availableFilteredTGIDs.length
            )
          : strings.AIRPORT_TRANSFER.TRANSFERS_AVAILABLE_SINGULAR}
      </p>

      {isLoading ? (
        <LoadingSkeletons isMobile={isMobile} />
      ) : (
        <>
          {availableFilteredTGIDs.length > 1 && isMobile ? (
            <Swiper
              {...swiperParams}
              onSlideChange={(swiper) => {
                setActiveSlideIndex(swiper.realIndex);
              }}
            >
              {renderProductCards({
                isMobile,
                availableFilteredTGIDs,
                tgidScorpioDataMap,
                toursWithEarliestAvailability,
                queryParamsForSelectPage,
              })}
            </Swiper>
          ) : (
            <div className="flex">
              <div className="product-cards-container-desktop">
                {renderProductCards({
                  isMobile,
                  availableFilteredTGIDs,
                  tgidScorpioDataMap,
                  toursWithEarliestAvailability,
                  queryParamsForSelectPage,
                })}
              </div>

              <Conditional if={!isMobile}>
                <SharedTransferTrustBoosterCard
                  isSmall={availableFilteredTGIDs.length < 2}
                />
              </Conditional>
            </div>
          )}

          <Conditional if={availableFilteredTGIDs.length > 1 && isMobile}>
            <div className="pagination">
              <Paginator
                tabSize={1.5}
                dotSize={0.375}
                margin={0.1875}
                activeIndex={activeSlideIndex}
                totalCount={availableFilteredTGIDs.length}
                enableTranslate
                inactiveColor="rgba(240, 240, 240, 0.5)"
                enableActiveColor={true}
                showCounter
              />
            </div>
          </Conditional>
        </>
      )}
    </SearchResultsSectionContainer>
  );
};

const renderProductCards = ({
  isMobile,
  availableFilteredTGIDs,
  tgidScorpioDataMap,
  toursWithEarliestAvailability,
  queryParamsForSelectPage,
}: {
  isMobile: boolean;
  availableFilteredTGIDs: number[];
  tgidScorpioDataMap: TTGIDScorpioDataMap;
  toursWithEarliestAvailability: TTour[];
  queryParamsForSelectPage: string;
}) => {
  return availableFilteredTGIDs.map((tgid) => (
    <ProductCard
      isMobile={isMobile}
      key={tgid}
      scorpioData={tgidScorpioDataMap[tgid]}
      tour={
        toursWithEarliestAvailability.find(
          (tour) => tour.tgid === tgid
        ) as TTour
      }
      extraQueryParamsForBookingURL={queryParamsForSelectPage}
    />
  ));
};

const getTGIDsByCityAirportStation = ({
  cityCode,
  airport,
  station,
}: {
  cityCode: string;
  airport: string;
  station: string;
}) => {
  return (
    CITY_AIRPORT_STATION_TGID_MAP[cityCode]?.[airport]?.[station]?.tgids ?? []
  );
};

const getQueryParamsForSelectPage = ({
  date,
  station,
  isRoundTrip,
  direction,
}: {
  date: string | null;
  station: string | null;
  isRoundTrip: boolean;
  direction: 'FROM_AIRPORT' | 'TO_AIRPORT';
}) => {
  const queryParams = new URLSearchParams();

  if (station) queryParams.append('destination', station);

  if (date) queryParams.append('date', date);

  queryParams.append('direction', direction);

  queryParams.append('tripType', isRoundTrip ? 'ROUND_TRIP' : 'ONE_WAY');

  return queryParams.toString();
};
