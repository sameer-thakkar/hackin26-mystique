import { useEffect, useReducer, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';
import Button from '@headout/aer/src/atoms/Button';
import { SlideInAnimate } from 'components/AirportTransfers/SlideInAnimate';
import Conditional from 'components/common/Conditional';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { trackEvent } from 'utils/analytics';
import { AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP } from 'const/airportTransfers';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import {
  AirplaneOutlineSVG,
  CalendarSVG,
  LocationPinSVG,
  SwapIconSVG,
} from 'assets/airportTransfers/searchUnitSVGs';
import { BottomDrawer } from '../BottomDrawer';
import { BottomDrawerNavigation } from '../BottomDrawer/navigation';
import { ANALYTICS_STEP_FIELD_TEXT_MAP, getFieldErrors } from '../constants';
import { FieldError } from '../FieldError';
import { TTransferDirection } from '../interface';
import { ReturnToggle } from '../ReturnToggle';
import { SelectField } from '../SelectField';
import {
  sharedAirportTransferSearchFieldsOrder,
  sharedTransferAirport,
  sharedTransferDate,
  sharedTransferDirection,
  sharedTransferSearchData,
  sharedTransfersSearchStepReducer,
  sharedTransferStation,
  TSharedAirportTransferSearchFormStep,
} from '../state';
import {
  DropdownContainer,
  LocationInputsContainer,
  RelativeWrapper,
  SwapButton,
} from '../style';
import { animateSwapLocationFields } from '../utils';
import { DatePicker } from './DatePicker';
import { STATION_TYPE_SVG_MAP } from './iconsMap';
import { SharedTransferAirportsList } from './SharedAirportsList';
import { StationsList } from './StationsList';
import { getSharedTransferDrawerTitle, isCurrentStepComplete } from './utils';

export const SharedTransferSearch = ({
  isMobile,
  uid,
}: {
  isMobile: boolean;
  uid: string;
}) => {
  const [{ currentStep }, dispatch] = useReducer(
    sharedTransfersSearchStepReducer,
    {
      currentStep: null,
    }
  );

  const [hasSearched, setHasSearched] = useState(false);

  const [selectedAirport, setSelectedAirport] = useRecoilState(
    sharedTransferAirport
  );
  const selectedStation = useRecoilValue(sharedTransferStation);
  const [direction, setDirection] = useRecoilState(sharedTransferDirection);
  const selectedDate = useRecoilValue(sharedTransferDate);

  const setSharedTransferSearchData = useSetRecoilState(
    sharedTransferSearchData
  );

  const airportFieldPlaceholderText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_PICKUP,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_DROPOFF,
  }[direction];

  const airportFieldLabelText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.FROM,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.TO,
  }[direction];

  const stationFieldPlaceHolderText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_DROPOFF,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_PICKUP,
  }[direction];

  const stationFieldLabelText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.TO,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.FROM,
  }[direction];

  const isAirportFieldFocused =
    (currentStep === 'PICKUP' && direction === 'FROM_AIRPORT') ||
    (currentStep === 'DROPOFF' && direction === 'TO_AIRPORT');

  const isStationFieldFocused =
    !isAirportFieldFocused && currentStep !== 'DATE' && currentStep !== null;

  const isDateFieldFocused = currentStep === 'DATE';

  const airportFieldError =
    hasSearched && !isAirportFieldFocused && !selectedAirport;

  const stationFieldError =
    hasSearched &&
    !isStationFieldFocused &&
    !isStationFieldFocused &&
    !selectedStation.name;

  const dateFieldError = hasSearched && !isDateFieldFocused && !selectedDate;

  const hasAnyError = airportFieldError || stationFieldError || dateFieldError;

  const airportFieldRef = useRef<HTMLDivElement>(null);
  const stationFieldRef = useRef<HTMLDivElement>(null);
  const dateFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (direction === 'FROM_AIRPORT') {
      airportFieldRef.current?.style.setProperty('order', '1');
      stationFieldRef.current?.style.setProperty('order', '2');
    } else {
      airportFieldRef.current?.style.setProperty('order', '2');
      stationFieldRef.current?.style.setProperty('order', '1');
    }
  }, []);

  const isAirportMB = !!AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP[uid];

  useEffect(() => {
    if (isAirportMB) {
      setSelectedAirport(AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP[uid]);
    }
  }, [isAirportMB, setSelectedAirport, uid]);

  useCaptureClickOutside(airportFieldRef, () => {
    if (isAirportFieldFocused && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  useCaptureClickOutside(stationFieldRef, () => {
    if (isStationFieldFocused && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  useCaptureClickOutside(dateFieldRef, () => {
    if (isDateFieldFocused && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  const FIELD_ERRORS = getFieldErrors(strings);

  useEffect(() => {
    if (!hasAnyError) return;

    const errorTextErrorMap = {
      [FIELD_ERRORS.PICKUP]:
        direction === 'FROM_AIRPORT' ? airportFieldError : stationFieldError,
      [FIELD_ERRORS.DROP_OFF]:
        direction === 'TO_AIRPORT' ? airportFieldError : stationFieldError,
      [FIELD_ERRORS.PICKUP_DATE]: dateFieldError,
    };

    Object.entries(errorTextErrorMap).forEach(([text, error]) => {
      if (error) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.ERROR_VIEWED,
          [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.ERROR_REASON]: text,
        });
      }
    });
  }, [hasAnyError]);

  const handleAirportFieldClick = () => {
    if (isAirportFieldFocused) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({
      type: 'SET',
      payload: direction === 'FROM_AIRPORT' ? 'PICKUP' : 'DROPOFF',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]:
        direction === 'FROM_AIRPORT' ? 'Pickup Location' : 'Drop-off Location',
    });
  };

  const handleSwapButtonClick = () => {
    animateSwapLocationFields(airportFieldRef, stationFieldRef);

    const newDirection =
      direction === 'TO_AIRPORT' ? 'FROM_AIRPORT' : 'TO_AIRPORT';

    setTimeout(() => {
      // Allows the animation to finish before changing the text
      setDirection(newDirection);
    }, 200);

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]: 'Reverse Locations',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: newDirection,
    });
  };

  const handleStationFieldClick = () => {
    if (isStationFieldFocused) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({
      type: 'SET',
      payload: direction === 'FROM_AIRPORT' ? 'DROPOFF' : 'PICKUP',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]:
        direction === 'FROM_AIRPORT' ? 'Drop-off Location' : 'Pickup Location',
    });
  };

  const handleDateFieldClick = () => {
    if (isDateFieldFocused) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'SET', payload: 'DATE' });

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]: 'Date',
    });
  };

  const handleSearchButtonClick = () => {
    setHasSearched(true);
    if (
      selectedAirport &&
      selectedStation.name &&
      selectedDate &&
      !hasAnyError
    ) {
      setSharedTransferSearchData({
        hasSearched: true,
        isLoading: true,
        airport: selectedAirport,
        station: selectedStation.name,
        date: selectedDate,
      });

      setTimeout(() => {
        setSharedTransferSearchData((prev) => ({
          ...prev,
          hasSearched: true,
          isLoading: false,
        }));
      }, 1000);
    }

    trackEvent({
      eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Search',
      [ANALYTICS_PROPERTIES.LABEL]: 'Search',
      [ANALYTICS_PROPERTIES.SECTION]: 'Shared Search',
    });
  };

  const [isAnimating, setIsAnimating] = useState(true);

  const goToPrevStep = () => {
    if (isMobile) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.DRAWER_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.DRAWER_TYPE]:
          ANALYTICS_STEP_FIELD_TEXT_MAP[currentStep!], // todo: add constant
        [ANALYTICS_PROPERTIES.LABEL]: 'Back',
      });
    }

    dispatch({ type: 'PREV' });
  };

  const goToNextStep = async (noDelayInDispatch = false) => {
    await new Promise((resolve) =>
      setTimeout(resolve, noDelayInDispatch ? 0 : 150)
    );
    setIsAnimating(false);

    await new Promise((resolve) => setTimeout(resolve, 0));

    if (isMobile) {
      dispatch({ type: 'NEXT' });
      setIsAnimating(true);

      trackEvent({
        eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.DRAWER_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.DRAWER_TYPE]: 'Next', // todo: add constant
        [ANALYTICS_PROPERTIES.LABEL]:
          ANALYTICS_STEP_FIELD_TEXT_MAP[currentStep!],
      });

      return;
    }

    const nextStep =
      sharedAirportTransferSearchFieldsOrder[
        sharedAirportTransferSearchFieldsOrder.indexOf(currentStep!) + 1
      ];

    if (!nextStep || nextStep === 'DROPOFF') {
      dispatch({ type: 'NEXT' });
      setIsAnimating(true);
      return;
    }

    if (nextStep === 'DATE' && selectedDate) {
      dispatch({ type: 'NEXT' }); // skip date step if date is already selected
    }

    dispatch({ type: 'NEXT' });

    setIsAnimating(true);
  };

  const handleDrawerClose = (reason: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.DRAWER_CLOSED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.DRAWER_TYPE]:
        ANALYTICS_STEP_FIELD_TEXT_MAP[currentStep!],
      [ANALYTICS_PROPERTIES.ACTION]: reason,
      [ANALYTICS_PROPERTIES.SECTION]: 'Shared Search',
    });

    dispatch({ type: 'RESET' });
  };

  return (
    <>
      <LocationInputsContainer
        $direction={direction}
        $hasError={
          isMobile
            ? direction === 'FROM_AIRPORT'
              ? airportFieldError
              : stationFieldError
            : hasAnyError
        }
      >
        <RelativeWrapper ref={airportFieldRef} $hasError={airportFieldError}>
          <SelectField
            icon={<AirplaneOutlineSVG />}
            placeHolderText={airportFieldPlaceholderText}
            topLabel={airportFieldLabelText}
            value={selectedAirport ?? undefined}
            onClick={handleAirportFieldClick}
            isFocused={isAirportFieldFocused && !isAirportMB}
            error={airportFieldError}
          />

          <FieldError
            text={
              direction === 'FROM_AIRPORT'
                ? FIELD_ERRORS.PICKUP
                : FIELD_ERRORS.DROP_OFF
            }
            show={airportFieldError}
          />

          <Conditional if={isAirportFieldFocused && !isMobile && !isAirportMB}>
            <DropdownContainer $hasError={hasAnyError}>
              <SharedTransferAirportsList onValueChange={goToNextStep} />
            </DropdownContainer>
          </Conditional>
        </RelativeWrapper>

        <SwapButton
          className={`${direction === 'TO_AIRPORT' ? 'reverse' : ''}`}
          onClick={handleSwapButtonClick}
        >
          <SwapIconSVG />
        </SwapButton>

        <RelativeWrapper ref={stationFieldRef} $hasError={stationFieldError}>
          <SelectField
            icon={
              selectedStation.name ? (
                STATION_TYPE_SVG_MAP[
                  selectedStation.stationType as keyof typeof STATION_TYPE_SVG_MAP
                ]
              ) : (
                <LocationPinSVG />
              )
            }
            topLabel={stationFieldLabelText}
            placeHolderText={stationFieldPlaceHolderText}
            value={selectedStation.name}
            onClick={handleStationFieldClick}
            isFocused={isStationFieldFocused}
            error={stationFieldError}
          />

          <FieldError
            text={
              direction === 'FROM_AIRPORT'
                ? FIELD_ERRORS.DROP_OFF
                : FIELD_ERRORS.PICKUP
            }
            show={stationFieldError}
          />

          <Conditional if={isStationFieldFocused && !isMobile}>
            <DropdownContainer $hasError={hasAnyError}>
              <StationsList onValueChange={goToNextStep} />
            </DropdownContainer>
          </Conditional>
        </RelativeWrapper>
      </LocationInputsContainer>

      <RelativeWrapper ref={dateFieldRef} $hasError={dateFieldError}>
        <SelectField
          icon={<CalendarSVG />}
          placeHolderText={strings.AIRPORT_TRANSFER.SELECT_DATE}
          topLabel={strings.AIRPORT_TRANSFER.PICKUP_DATE}
          value={
            selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : undefined
          }
          onClick={handleDateFieldClick}
          isFocused={currentStep === 'DATE'}
          error={dateFieldError}
        />
        <FieldError text={FIELD_ERRORS.PICKUP_DATE} show={dateFieldError} />

        <Conditional if={isDateFieldFocused && !isMobile}>
          <DatePicker
            isMobile={false}
            onValueChange={goToNextStep}
            hasError={hasAnyError}
          />
        </Conditional>
      </RelativeWrapper>

      <Button
        onClick={handleSearchButtonClick}
        size={isMobile ? 'medium' : 'large'}
        color="purps"
        variant="primary"
        height="100%"
        text={strings.SEARCH}
        className="shared-search-button"
      />

      <div
        style={{
          marginTop:
            (isMobile && dateFieldError) || (!isMobile && hasAnyError)
              ? '0.5rem'
              : '0',
          order: isMobile ? 3 : 4,
        }}
      >
        <ReturnToggle isMobile={isMobile} />
      </div>

      <Conditional
        if={
          currentStep !== null &&
          isMobile &&
          !(isAirportMB && isAirportFieldFocused)
        }
      >
        <BottomDrawer
          title={getSharedTransferDrawerTitle(currentStep, strings)}
          handleClose={handleDrawerClose}
          height={currentStep === 'DATE' ? '75vh' : '69vh'}
        >
          <SlideInAnimate in={isAnimating} className="slide-animate-drawer">
            {getDrawerContent(currentStep, direction, goToNextStep)}
          </SlideInAnimate>

          <BottomDrawerNavigation
            handleBackClick={goToPrevStep}
            handleNextClick={() => goToNextStep(true)}
            isNextDisabled={
              !isCurrentStepComplete(currentStep, direction, {
                selectedAirport,
                selectedStation: selectedStation.name,
                selectedDate,
              })
            }
            currentStepNumber={
              {
                PICKUP: 0,
                DROPOFF: 1,
                DATE: 2,
              }[currentStep!]
            }
            numberOfSteps={3}
          />
        </BottomDrawer>
      </Conditional>
    </>
  );
};

const getDrawerContent = (
  step: TSharedAirportTransferSearchFormStep,
  direction: TTransferDirection,
  onValueChange: () => void
) => {
  if (step === null) return null;

  const contentMap = {
    PICKUP: {
      FROM_AIRPORT: (
        <SharedTransferAirportsList onValueChange={onValueChange} />
      ),
      TO_AIRPORT: <StationsList onValueChange={onValueChange} />,
    },
    DROPOFF: {
      FROM_AIRPORT: <StationsList onValueChange={onValueChange} />,
      TO_AIRPORT: <SharedTransferAirportsList onValueChange={onValueChange} />,
    },
    DATE: {
      TO_AIRPORT: <DatePicker onValueChange={onValueChange} />,
      FROM_AIRPORT: <DatePicker onValueChange={onValueChange} />,
    },
  };

  return contentMap[step][direction];
};
