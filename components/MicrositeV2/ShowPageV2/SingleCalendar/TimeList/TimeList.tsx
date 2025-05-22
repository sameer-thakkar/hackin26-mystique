import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import { Box, Text } from '@headout/eevee';
import { getIntlTime } from '@headout/espeon/utils/time';
import { css } from '@headout/pixie/css';
import DiscountTag from 'components/Product/components/DiscountTag';
import { BoosterType } from 'components/Product/interface';
import { getToursAgainstDates } from 'components/SeatMapPage/components/SideBar/utils';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { getLocalisedPrice } from 'utils/currency';
import { currencyAtom } from 'store/atoms/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  HARRY_POTTER_CURSED_CHILD_UID,
} from 'const/index';
import { strings } from 'const/strings';
import { LIMITED_AVAILABILITY } from '../constants';
import { HpccShowTimingsSection } from '../customHarryPotter';
import { useFetchTourAvailabilities } from '../hooks/useFetchTourAvailabilities';
import { formatTimeSuffix } from '../utils';
import {
  discountTagStyles,
  listingPriceStrikeStyles,
  listingPriceStyles,
  skeletonContainer,
  skeletonStyles,
  timeSlotBoostStyles,
  timeSlotStyles,
  timeSlotTextStyles,
} from './styles';

interface TTimeListProps {
  tgid: string;
  tourStartDate: string;
  activeCurrencyCode: string;
  loading?: boolean;
  selectedTourDate: string;
  selectedTimeSlotIndex: number;
  setSelectedTimeSlotIndex: (index: number) => void;
  setSelectedTimeSlot: (timeSlot: string) => void;
  onTimeSlotClick: (index: number) => void;
  defaultSelectedTimeSlotIndex?: number;
}

export const TimeList = (props: TTimeListProps) => {
  const {
    tgid,
    tourStartDate,
    activeCurrencyCode,
    loading = false,
    selectedTourDate,
    selectedTimeSlotIndex,
    setSelectedTimeSlotIndex,
    setSelectedTimeSlot,
    onTimeSlotClick,
    defaultSelectedTimeSlotIndex,
  } = props;

  const currencyList = useRecoilValue(currencyListAtom);
  const currencyCode = useRecoilValue(currencyAtom);
  const { lang, uid } = useContext(MBContext);

  const [isTimeSelectionLoading, setIsTimeSelectionLoading] = useState(true);
  const [toursAgainstDates, setToursAgainstDates] = useState<any>({});

  const { tourAvailabilities, isValidating } = useFetchTourAvailabilities({
    loading,
    tgid,
    tourStartDate,
    activeCurrencyCode,
  });

  useEffect(() => {
    const { availabilities } = tourAvailabilities ?? {};
    setIsTimeSelectionLoading(true);

    if (availabilities) {
      const availableToursAgainstDates = getToursAgainstDates(availabilities);

      setToursAgainstDates(availableToursAgainstDates);

      setSelectedTimeSlot(
        availableToursAgainstDates[selectedTourDate]?.[
          defaultSelectedTimeSlotIndex ?? 0
        ]?.startTime
      );

      const timeout = setTimeout(() => {
        setIsTimeSelectionLoading(false);
      }, 400);

      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tourAvailabilities,
    setToursAgainstDates,
    setIsTimeSelectionLoading,
    selectedTourDate,
    setSelectedTimeSlot,
  ]);

  if (
    isTimeSelectionLoading ||
    loading ||
    isValidating ||
    !toursAgainstDates[selectedTourDate]
  ) {
    const length = toursAgainstDates[selectedTourDate]?.length ?? 1;

    if (uid === HARRY_POTTER_CURSED_CHILD_UID) {
      return (
        <Skeleton
          count={length}
          borderRadius={8}
          className={skeletonStyles}
          wrapper={Box}
          height="10rem"
        />
      );
    }

    return (
      <Skeleton
        count={length}
        borderRadius={8}
        className={classNames(
          skeletonStyles,
          css({
            marginBottom: length > 1 ? 'space.8' : 'space.4',
          })
        )}
        wrapper={Box}
        height="4.0625rem"
        containerClassName={skeletonContainer}
      />
    );
  }

  if (uid === HARRY_POTTER_CURSED_CHILD_UID) {
    return (
      <HpccShowTimingsSection
        startTime={toursAgainstDates[selectedTourDate]?.[0]?.startTime}
      />
    );
  }

  return toursAgainstDates[selectedTourDate]?.map(
    (availableTour: any, index: number) => {
      const { startTime, priceProfile, paxAvailability } = availableTour ?? {};

      const formattedStartTime = formatTimeSuffix(
        getIntlTime({
          time: startTime,
          lang,
        })
      );
      const { persons } = priceProfile ?? {};
      const price = persons[0]?.retailPrice;
      const listingPrice = persons[0]?.listingPrice;
      const discount = persons[0]?.discount;
      const availability = paxAvailability[0]?.availability;
      const localizedPrice = getLocalisedPrice({
        price,
        currencyCode: currencyCode ?? 'USD',
        lang,
        currencyList: currencyList,
      });
      const localizedListingPrice = getLocalisedPrice({
        price: listingPrice,
        currencyCode: currencyCode ?? 'USD',
        lang,
        currencyList: currencyList,
      });

      const discountPercentage = Number(discount);

      return (
        <Box
          key={index}
          role="option"
          tabIndex={0}
          onClick={() => {
            onTimeSlotClick(index);
            setSelectedTimeSlotIndex?.(index);
            setSelectedTimeSlot(startTime);
            trackEvent({
              eventName: ANALYTICS_EVENTS.SHOW_PAGE.EXPERIENCE_TIME_SELECTED,
              [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: selectedTourDate,
              [ANALYTICS_PROPERTIES.TRIGGERED_BY]: 'User',
              [ANALYTICS_PROPERTIES.EXPERIENCE_TIME]: formattedStartTime,
            });
          }}
          aria-selected={selectedTimeSlotIndex === index}
          className={timeSlotStyles}
        >
          <Box>
            <Text className={timeSlotTextStyles}>{formattedStartTime}</Text>
            <Text className={timeSlotBoostStyles}>
              {availability === LIMITED_AVAILABILITY &&
                `🔥 ${BoosterType.SELLING_OUT_FAST}`}
            </Text>
          </Box>
          <Box>
            <Text className={listingPriceStyles}>
              {listingPrice && discountPercentage > 0 && (
                <Text as="span" className={listingPriceStrikeStyles}>
                  {localizedListingPrice}
                </Text>
              )}
              {localizedPrice}
            </Text>
            {discountPercentage > 0 && (
              <Text className={discountTagStyles}>
                <DiscountTag
                  discount={
                    strings.formatString(
                      strings.OFF_PERCENT,
                      discountPercentage
                    ) as string
                  }
                />
              </Text>
            )}
          </Box>
        </Box>
      );
    }
  );
};
