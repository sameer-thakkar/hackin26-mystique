import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import Button from '@headout/aer/src/atoms/Button';
import { css, cx } from '@headout/pixie/css';
import { SlideInAnimate } from 'components/AirportTransfers/SlideInAnimate';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import { useCaptureClickOutside } from 'hooks/ClickOutside';
import { useBookingURL } from 'hooks/useBookingURL';
import { trackEvent } from 'utils/analytics';
import { BOOKING_FLOW_TYPE } from 'const/booking';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import {
  AirplaneOutlineSVG,
  CalendarSVG,
  ClockSVG,
  PassengersIconSVG,
  SwapIconSVG,
} from 'assets/airportTransfers/searchUnitSVGs';
import { BottomDrawer } from '../BottomDrawer';
import { BottomDrawerNavigation } from '../BottomDrawer/navigation';
import {
  ANALYTICS_STEP_FIELD_TEXT_MAP,
  getFieldErrors,
  TIME_FORMAT,
  TIME_FORMAT_DISPLAY,
} from '../constants';
import { FieldError } from '../FieldError';
import { LocationSearch } from '../LocationSearch';
import { PaxSelection } from '../PaxSelection';
import { SelectField } from '../SelectField';
import {
  privateAirportTransferSearchFieldsOrder,
  privateTransferAirportState,
  privateTransferDateState,
  privateTransferDirectionState,
  privateTransferLocationState,
  privateTransferPaxState,
  privateTransfersSearchStepReducer,
  privateTransferTimeState,
  TPrivateAirportTransferSearchFormStep,
} from '../state';
import {
  DropdownContainer,
  FlexContainer,
  LocationInputsContainer,
  RelativeWrapper,
  SwapButton,
} from '../style';
import { animateSwapLocationFields } from '../utils';
import { DatePicker } from './DatePicker';
import { PrivateTransferAirportsList } from './PrivateTransferAirportsList';
import { TimePicker } from './TimePicker';
import {
  getPaxFieldText,
  getPrivateTransferDrawerTitle,
  isCurrentStepComplete,
  isPrivateTransferSearchFormComplete,
} from './utils';

export const PrivateTransferSearch = ({ isMobile }: { isMobile: boolean }) => {
  const [hasSearched, setHasSearched] = useState(false);

  const { lang } = useContext(MBContext);

  const [{ currentStep }, dispatch] = useReducer(
    privateTransfersSearchStepReducer,
    {
      currentStep: null,
    }
  );

  const selectedAirport = useRecoilValue(privateTransferAirportState);
  const selectedLocation = useRecoilValue(privateTransferLocationState);
  const [direction, setDirection] = useRecoilState(
    privateTransferDirectionState
  );
  const selectedDate = useRecoilValue(privateTransferDateState);
  const selectedTime = useRecoilValue(privateTransferTimeState);
  const selectedPax = useRecoilValue(privateTransferPaxState);

  const airportFieldPlaceholderText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_PICKUP,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_DROPOFF,
  }[direction];

  const airportFieldLabelText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.FROM,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.TO,
  }[direction];

  const locationFieldPlaceholderText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_DROPOFF,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.SELECT_PICKUP,
  }[direction];

  const locationFieldLabelText = {
    FROM_AIRPORT: strings.AIRPORT_TRANSFER.TO,
    TO_AIRPORT: strings.AIRPORT_TRANSFER.FROM,
  }[direction];

  const isAirportFieldFocused =
    (currentStep === 'PICKUP' && direction === 'FROM_AIRPORT') ||
    (currentStep === 'DROPOFF' && direction === 'TO_AIRPORT');

  const isLocationFieldFocused =
    !isAirportFieldFocused &&
    (currentStep === 'PICKUP' || currentStep === 'DROPOFF');

  const airportFieldError =
    hasSearched && !isAirportFieldFocused && !selectedAirport.name;

  const locationFieldError =
    hasSearched && !isLocationFieldFocused && !selectedLocation.addressText;

  const dateFieldError = hasSearched && currentStep !== 'DATE' && !selectedDate;

  const timeFieldError = hasSearched && currentStep !== 'TIME' && !selectedTime;

  const dateTimeFieldError = dateFieldError || timeFieldError;

  const paxFieldError = hasSearched && currentStep !== 'PAX' && !selectedPax;

  const hasAnyError =
    airportFieldError ||
    locationFieldError ||
    dateFieldError ||
    timeFieldError ||
    paxFieldError;

  const productBookingURL = useBookingURL({
    tourGroupId: selectedAirport.tgid ?? 0,
    isMobile,
    flowType: BOOKING_FLOW_TYPE.PRIVATE_AIRPORT_TRANSFER,
  });

  const airportFieldRef = useRef<HTMLDivElement>(null);
  const locationFieldRef = useRef<HTMLDivElement>(null);
  const dateFieldRef = useRef<HTMLDivElement>(null);
  const timeFieldRef = useRef<HTMLDivElement>(null);
  const paxFieldRef = useRef<HTMLDivElement>(null);

  useCaptureClickOutside(airportFieldRef, () => {
    if (isAirportFieldFocused && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  useCaptureClickOutside(locationFieldRef, () => {
    if (isLocationFieldFocused && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  useCaptureClickOutside(dateFieldRef, () => {
    if (currentStep === 'DATE' && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  useCaptureClickOutside(timeFieldRef, () => {
    if (currentStep === 'TIME' && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  useCaptureClickOutside(paxFieldRef, () => {
    if (currentStep === 'PAX' && !isMobile) {
      dispatch({ type: 'RESET' });
    }
  });

  useEffect(() => {
    if (direction === 'FROM_AIRPORT') {
      airportFieldRef.current?.style.setProperty('order', '1');
      locationFieldRef.current?.style.setProperty('order', '2');
    } else {
      airportFieldRef.current?.style.setProperty('order', '2');
      locationFieldRef.current?.style.setProperty('order', '1');
    }
  }, []);

  const FIELD_ERRORS = getFieldErrors(strings);

  useEffect(() => {
    if (!hasAnyError) return;

    const errorTextErrorMap = {
      [FIELD_ERRORS.PICKUP]:
        direction === 'FROM_AIRPORT' ? airportFieldError : locationFieldError,
      [FIELD_ERRORS.DROP_OFF]:
        direction === 'TO_AIRPORT' ? airportFieldError : locationFieldError,
      [FIELD_ERRORS.PICKUP_DATE]: dateFieldError,
      [FIELD_ERRORS.PICKUP_TIME]: timeFieldError,
      [FIELD_ERRORS.PAX]: paxFieldError,
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
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.FIELD_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_NAME]:
        direction === 'FROM_AIRPORT'
          ? ANALYTICS_STEP_FIELD_TEXT_MAP.PICKUP
          : ANALYTICS_STEP_FIELD_TEXT_MAP.DROPOFF,
    });
  };

  const handleLocationFieldClick = () => {
    dispatch({
      type: 'SET',
      payload: direction === 'FROM_AIRPORT' ? 'DROPOFF' : 'PICKUP',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.FIELD_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_NAME]:
        direction === 'FROM_AIRPORT'
          ? ANALYTICS_STEP_FIELD_TEXT_MAP.DROPOFF
          : ANALYTICS_STEP_FIELD_TEXT_MAP.PICKUP,
    });
  };

  const handleDateFieldClick = () => {
    if (currentStep === 'DATE' && !isMobile) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({
      type: 'SET',
      payload: 'DATE',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.FIELD_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_NAME]:
        ANALYTICS_STEP_FIELD_TEXT_MAP.DATE,
    });
  };

  const handleTimeFieldClick = () => {
    if (currentStep === 'TIME' && !isMobile) {
      dispatch({ type: 'RESET' });

      return;
    }

    dispatch({
      type: 'SET',
      payload: 'TIME',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.FIELD_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_NAME]:
        ANALYTICS_STEP_FIELD_TEXT_MAP.TIME,
    });
  };

  const handlePaxFieldClick = () => {
    if (currentStep === 'PAX' && !isMobile) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({
      type: 'SET',
      payload: 'PAX',
    });

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.FIELD_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_NAME]: 'Pax',
    });
  };

  const handleSwapButtonClick = () => {
    animateSwapLocationFields(airportFieldRef, locationFieldRef);

    const newDirection =
      direction === 'TO_AIRPORT' ? 'FROM_AIRPORT' : 'TO_AIRPORT';

    setTimeout(() => {
      setDirection(newDirection);
    }, 200);

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.FIELD_ADDED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_NAME]: 'Reverse Locations',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_VALUE]: newDirection,
    });
  };

  const handleSearchButtonClick = () => {
    setHasSearched(true);

    trackEvent({
      eventName: 'Search CTA Clicked',
      [ANALYTICS_PROPERTIES.LABEL]: 'Search',
    });

    if (
      !isPrivateTransferSearchFormComplete({
        airportData: selectedAirport,
        locationData: selectedLocation,
        pickupDate: selectedDate ?? '',
        pickupTime: selectedTime ?? '',
        pax: selectedPax,
      })
    )
      return;

    const privateTransferSearchParams = new URLSearchParams({
      locationData: JSON.stringify(selectedLocation),
      transferType:
        direction === 'FROM_AIRPORT' ? 'AIRPORT_PICKUP' : 'AIRPORT_DROPOFF',
      pickupDate: selectedDate ?? '',
      pickupTime: selectedTime ?? '',
      paxAndLuggage: JSON.stringify({
        PASSENGERS: selectedPax,
        LUGGAGE: 0,
      }),
    });

    const urlWithPrivateTransferSearchQuery = `${productBookingURL}&${privateTransferSearchParams.toString()}`;

    window.open(
      urlWithPrivateTransferSearchQuery,
      isMobile ? '_self' : '_blank'
    );
  };

  const [isAnimating, setIsAnimating] = useState(true);

  const goToNextStep = async (noDelayInDispatch = false) => {
    await new Promise((resolve) =>
      setTimeout(resolve, noDelayInDispatch ? 0 : 200)
    );
    setIsAnimating(false);

    await new Promise((resolve) => setTimeout(resolve, 0));

    if (isMobile) {
      dispatch({ type: 'NEXT' });
      setIsAnimating(true);

      trackEvent({
        eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.DRAWER_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.DRAWER_TYPE]:
          ANALYTICS_STEP_FIELD_TEXT_MAP[currentStep!], // todo: add constant
        [ANALYTICS_PROPERTIES.LABEL]: 'Next',
      });

      return;
    }

    const nextStep =
      privateAirportTransferSearchFieldsOrder[
        privateAirportTransferSearchFieldsOrder.indexOf(currentStep!) + 1
      ];

    if (!nextStep) {
      dispatch({ type: 'NEXT' });
      setIsAnimating(true);

      return;
    }

    const stepStateMap = {
      PICKUP:
        direction === 'FROM_AIRPORT'
          ? !!selectedAirport.name
          : !!selectedLocation.addressText,
      DROPOFF:
        direction === 'TO_AIRPORT'
          ? !!selectedAirport.name
          : !!selectedLocation.addressText,
      DATE: !!selectedDate,
      TIME: !!selectedTime,
      PAX: !!selectedPax,
    };

    const nextIncompleteStep = privateAirportTransferSearchFieldsOrder.find(
      (step) =>
        privateAirportTransferSearchFieldsOrder.indexOf(step) >
          privateAirportTransferSearchFieldsOrder.indexOf(currentStep!) &&
        !stepStateMap[step!]
    );

    if (nextIncompleteStep) {
      dispatch({ type: 'SET', payload: nextIncompleteStep });
      setIsAnimating(true);
      return;
    }

    dispatch({ type: 'RESET' });

    setIsAnimating(true);
  };

  const goToPrevStep = async () => {
    if (isMobile) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.DRAWER_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.DRAWER_TYPE]: 'Back', // todo: add constant
        [ANALYTICS_PROPERTIES.LABEL]:
          ANALYTICS_STEP_FIELD_TEXT_MAP[currentStep!],
      });
    }

    dispatch({ type: 'PREV' });
  };

  const handleDrawerClose = (reason: string) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.DRAWER_CLOSED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.DRAWER_TYPE]:
        ANALYTICS_STEP_FIELD_TEXT_MAP[currentStep!],
      [ANALYTICS_PROPERTIES.ACTION]: reason,
    });

    dispatch({ type: 'RESET' });
  };

  const DrawerContent = getDrawerContent(currentStep, direction);

  return (
    <>
      <LocationInputsContainer
        $direction={direction}
        $hasError={
          isMobile
            ? direction === 'FROM_AIRPORT'
              ? airportFieldError
              : locationFieldError
            : hasAnyError
        }
      >
        <RelativeWrapper ref={airportFieldRef} $hasError={airportFieldError}>
          <SelectField
            icon={<AirplaneOutlineSVG />}
            topLabel={airportFieldLabelText}
            placeHolderText={airportFieldPlaceholderText}
            value={selectedAirport.name ?? undefined}
            onClick={handleAirportFieldClick}
            isFocused={isAirportFieldFocused}
            error={airportFieldError}
          />

          <FieldError
            text={
              direction === 'FROM_AIRPORT'
                ? FIELD_ERRORS.PICKUP
                : FIELD_ERRORS.DROP_OFF
            }
            show={airportFieldError}
            className="location-fields-error"
          />

          <Conditional if={isAirportFieldFocused && !isMobile}>
            <DropdownContainer
              $hasError={hasAnyError}
              className={cx(
                css({
                  width: '21.25rem !important',
                  padding: '0.5rem 0!',
                }),
                direction === 'TO_AIRPORT' &&
                  css({
                    '& li': {
                      paddingLeft: '1.25rem!',
                    },
                  })
              )}
            >
              <PrivateTransferAirportsList onValueChange={goToNextStep} />
            </DropdownContainer>
          </Conditional>
        </RelativeWrapper>

        <SwapButton
          className={`${direction === 'TO_AIRPORT' ? 'reverse' : ''}`}
          onClick={handleSwapButtonClick}
        >
          <SwapIconSVG />
        </SwapButton>

        <RelativeWrapper ref={locationFieldRef} $hasError={locationFieldError}>
          <LocationSearch
            onClick={handleLocationFieldClick}
            topText={locationFieldLabelText}
            placeholder={
              isLocationFieldFocused
                ? direction === 'FROM_AIRPORT'
                  ? strings.AIRPORT_TRANSFER.ENTER_DESTINATION
                  : strings.AIRPORT_TRANSFER.ENTER_PICKUP
                : locationFieldPlaceholderText
            }
            onValueChange={goToNextStep}
            inputOnlyMode={isMobile}
            error={locationFieldError}
            isFocused={isLocationFieldFocused}
          />

          <FieldError
            text={
              direction === 'FROM_AIRPORT'
                ? FIELD_ERRORS.DROP_OFF
                : FIELD_ERRORS.PICKUP
            }
            show={locationFieldError}
            className="location-fields-error"
          />
        </RelativeWrapper>
      </LocationInputsContainer>

      <FlexContainer
        $isFocused={
          (currentStep === 'DATE' || currentStep === 'TIME') && !isMobile
        }
        $hasError={dateFieldError || timeFieldError}
      >
        <RelativeWrapper ref={dateFieldRef}>
          <SelectField
            icon={<CalendarSVG />}
            placeHolderText={strings.AIRPORT_TRANSFER.SELECT_DATE}
            topLabel={strings.AIRPORT_TRANSFER.PICKUP_DATE}
            onClick={handleDateFieldClick}
            isFocused={currentStep === 'DATE'}
            value={
              selectedDate
                ? dayjs(selectedDate).locale(lang).format('MMM DD, YYYY')
                : undefined
            }
            error={dateFieldError}
            className="pvt-date-field"
          />

          <Conditional if={currentStep === 'DATE' && !isMobile}>
            <DatePicker isMobile={false} onValueChange={goToNextStep} />
          </Conditional>
        </RelativeWrapper>

        <RelativeWrapper ref={timeFieldRef} className="pvt-time-field">
          <SelectField
            icon={<ClockSVG />}
            placeHolderText={strings.AIRPORT_TRANSFER.SELECT_TIME}
            topLabel={strings.AIRPORT_TRANSFER.PICKUP_TIME}
            onClick={handleTimeFieldClick}
            isFocused={currentStep === 'TIME'}
            value={
              selectedTime
                ? dayjs(selectedTime, TIME_FORMAT).format(TIME_FORMAT_DISPLAY)
                : ''
            }
            error={timeFieldError}
            className="pvt-time-field"
          />

          <Conditional if={currentStep === 'TIME' && !isMobile}>
            <DropdownContainer>
              <TimePicker isMobile={false} onValueChange={goToNextStep} />
            </DropdownContainer>
          </Conditional>
        </RelativeWrapper>

        <FieldError
          text={
            dateFieldError && timeFieldError
              ? FIELD_ERRORS.DATE_TIME
              : timeFieldError
              ? FIELD_ERRORS.PICKUP_TIME
              : dateFieldError
              ? FIELD_ERRORS.PICKUP_DATE
              : ''
          }
          show={
            currentStep !== 'DATE' &&
            currentStep !== 'TIME' &&
            dateTimeFieldError
          }
          className="pvt-date-time-error"
        />
      </FlexContainer>

      <RelativeWrapper ref={paxFieldRef} $hasError={paxFieldError}>
        <SelectField
          icon={<PassengersIconSVG />}
          placeHolderText={strings.AIRPORT_TRANSFER.ADD_GUESTS}
          topLabel={strings.AIRPORT_TRANSFER.GUESTS}
          onClick={handlePaxFieldClick}
          isFocused={currentStep === 'PAX'}
          value={getPaxFieldText(selectedPax, strings)}
          error={paxFieldError}
          className="pvt-pax-field"
        />

        <FieldError text={FIELD_ERRORS.PAX} show={paxFieldError} />

        <Conditional if={currentStep === 'PAX' && !isMobile}>
          <DropdownContainer
            style={{
              width: 'max-content',
              ...(hasAnyError ? { top: 'calc(100% - 0.25rem)' } : {}),
            }}
          >
            <PaxSelection />
          </DropdownContainer>
        </Conditional>
      </RelativeWrapper>

      <div
        style={{
          marginTop: paxFieldError && isMobile ? '0.5rem' : '0',
        }}
      >
        <Button
          onClick={handleSearchButtonClick}
          size={isMobile ? 'medium' : 'large'}
          color="purps"
          variant="primary"
          text={strings.SEARCH}
          className="private-search-button"
        />
      </div>

      <Conditional if={currentStep !== null && isMobile}>
        <BottomDrawer
          title={getPrivateTransferDrawerTitle(currentStep, strings) ?? ''}
          handleClose={handleDrawerClose}
          height={currentStep === 'DATE' ? '75vh' : '69vh'}
        >
          <SlideInAnimate in={isAnimating} className="slide-animate-drawer">
            {isLocationFieldFocused ? (
              <LocationSearch
                onClick={() => {
                  direction === 'FROM_AIRPORT'
                    ? dispatch({ payload: 'DROPOFF', type: 'SET' })
                    : dispatch({ type: 'SET', payload: 'PICKUP' });
                }}
                topText=""
                placeholder={locationFieldPlaceholderText}
                onValueChange={goToNextStep}
              />
            ) : (
              <DrawerContent onValueChange={goToNextStep} />
            )}
          </SlideInAnimate>

          <BottomDrawerNavigation
            handleBackClick={goToPrevStep}
            handleNextClick={() => goToNextStep(true)}
            isNextDisabled={
              !isCurrentStepComplete(currentStep, direction, {
                airport: selectedAirport.name ?? '',
                location: selectedLocation,
                pickupDate: selectedDate ?? '',
                pickupTime: selectedTime ?? '',
                pax: selectedPax,
              })
            }
            currentStepNumber={privateAirportTransferSearchFieldsOrder.indexOf(
              currentStep
            )}
            numberOfSteps={privateAirportTransferSearchFieldsOrder.length}
          />
        </BottomDrawer>
      </Conditional>
    </>
  );
};

const getDrawerContent = (
  step: TPrivateAirportTransferSearchFormStep,
  direction: 'TO_AIRPORT' | 'FROM_AIRPORT'
) => {
  if (!step) return () => null;

  const componentMap = {
    PICKUP: {
      FROM_AIRPORT: PrivateTransferAirportsList,
      TO_AIRPORT: () => null,
    },
    DROPOFF: {
      FROM_AIRPORT: () => null,
      TO_AIRPORT: PrivateTransferAirportsList,
    },
    DATE: {
      FROM_AIRPORT: DatePicker,
      TO_AIRPORT: DatePicker,
    },
    TIME: {
      FROM_AIRPORT: TimePicker,
      TO_AIRPORT: TimePicker,
    },
    PAX: {
      FROM_AIRPORT: PaxSelection,
      TO_AIRPORT: PaxSelection,
    },
  };

  return componentMap[step!][direction];
};
