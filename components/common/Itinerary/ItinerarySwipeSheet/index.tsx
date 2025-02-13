import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Section } from 'types/itinerary.type';
import Button from '@headout/aer/src/atoms/Button';
import Conditional from 'components/common/Conditional';
import { BottomSheet } from 'components/common/DraggableBottomSheet';
import StopLabel from 'components/common/Itinerary/StopLabel';
import { EStopLabelType } from 'components/common/Itinerary/StopLabel/types';
import { getStopLabelText } from 'components/common/Itinerary/StopLabel/utils';
import { useItinerary } from 'contexts/ItineraryContext';
import { trackEvent } from 'utils/analytics';
import {
  checkIfItineraryHasSameStartAndEndPoint,
  sectionDataSanitizer,
} from 'utils/itinerary';
import { ANALYTICS_EVENTS } from 'const/index';
import { strings } from 'const/strings';
import CrossiconSvg from 'assets/crossiconSvg';
import PassByCard from './components/PassByCard';
import StopCard from './components/StopCard';
import { TItinerarySwipeSheetProps } from './interface';
import {
  CloseButtonContainer,
  ContentHeader,
  ItinerarySwipeSheetContainer,
  ItinerarySwipeSheetContentContainer,
  NavigationButtons,
  NavigationButtonWrapper,
  PlaceholderCard,
  SpaceBlock,
  StopsContainer,
  StopsContent,
  StopTypeTagContainer,
} from './styles';

const ItinerarySwipeSheet = ({
  itinerary,
  visible = false,
  onCloseSwipeSheet,
}: TItinerarySwipeSheetProps) => {
  const bottomSheetContentRef = useRef<HTMLDivElement | null>(null);
  const { activeStopIndex } = useItinerary();
  const stopCardProps = useMemo(
    () => sectionDataSanitizer(itinerary.sections as Section[], itinerary.type),
    [itinerary]
  );
  const isEndpointSameAsStartPoint = useMemo(
    () => checkIfItineraryHasSameStartAndEndPoint(stopCardProps),
    [stopCardProps]
  );

  const [currentStop, setCurrentStop] = useState(activeStopIndex ?? 0);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeStopIndex !== null) {
      setCurrentStop(activeStopIndex!);
    }
  }, [activeStopIndex]);

  const handleNext = () => {
    if (currentStop < stopCardProps.length - 1) {
      setCurrentStop(currentStop + 1);
      contentContainerRef.current?.scrollTo({ top: 0, left: 0 });
    }
    trackItineraryDrawerCTAClick();
  };

  const handlePrevious = () => {
    if (currentStop > 0) {
      setCurrentStop(currentStop - 1);
      contentContainerRef.current?.scrollTo({ top: 0, left: 0 });
    }
    trackItineraryDrawerCTAClick();
  };

  const handleCloseSwipeSheet = () => {
    setCurrentStop(0);
    onCloseSwipeSheet?.();
  };

  const handleCloseButtonClick = () => {
    const overlayElement = bottomSheetContentRef.current?.querySelector(
      '#bottomsheet-overlay'
    ) as HTMLElement;
    overlayElement?.click();
  };

  const trackItineraryDrawerCTAClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.ITINERARY_DRAWER_CTA_CLICKED,
    });
  };

  const canShowNavigationButtons = stopCardProps.length > 1;
  const canShowPreviousButton = currentStop > 0;
  const canShowNextButtonBaseCondition = currentStop < stopCardProps.length - 1;
  const canShowNextButton =
    currentStop === stopCardProps.length - 2
      ? !isEndpointSameAsStartPoint && canShowNextButtonBaseCondition
      : canShowNextButtonBaseCondition;
  const stopLabelText = getStopLabelText({
    stopCardProps,
    currentStop,
  });
  const isPassBy = !!stopCardProps?.[currentStop]?.passby;

  return (
    <Conditional if={visible}>
      <ItinerarySwipeSheetContainer
        ref={bottomSheetContentRef}
        data-qa-marker="qaid-itinerary-swipe-sheet-section"
      >
        <BottomSheet
          sheetHeight="80%"
          onCloseCompletion={handleCloseSwipeSheet}
        >
          <ItinerarySwipeSheetContentContainer ref={contentContainerRef}>
            <ContentHeader>
              <StopTypeTagContainer>
                <StopLabel
                  labelText={stopLabelText!}
                  type={isPassBy ? EStopLabelType.PassBy : EStopLabelType.Stop}
                />
              </StopTypeTagContainer>
              <CloseButtonContainer onClick={handleCloseButtonClick}>
                <CrossiconSvg height="0.835rem" width="0.835rem" />
              </CloseButtonContainer>
            </ContentHeader>
            <StopsContainer>
              <StopsContent
                style={{ transform: `translateX(-${currentStop * 100}%)` }}
              >
                {stopCardProps.map(({ stop, passby }, index) => {
                  return (
                    <>
                      <Conditional if={stop}>
                        <Conditional if={currentStop === index}>
                          <StopCard
                            key={`stop-card-${stop?.sectionDetails?.id}`}
                            stop={stop!}
                            isCurrentStop={currentStop === index}
                          />
                        </Conditional>
                        <Conditional if={currentStop !== index}>
                          <PlaceholderCard />
                        </Conditional>
                      </Conditional>
                      <Conditional if={passby}>
                        <Conditional if={currentStop === index}>
                          <PassByCard
                            passby={passby!}
                            isCurrentStop={currentStop === index}
                            key={`passby-card-${passby?.stops?.[0]!.id}`}
                          />
                        </Conditional>

                        <Conditional if={currentStop !== index}>
                          <PlaceholderCard />
                        </Conditional>
                      </Conditional>
                    </>
                  );
                })}
              </StopsContent>

              <Conditional if={canShowNavigationButtons}>
                <SpaceBlock $gap={'4.25rem'} />
                <NavigationButtons>
                  <NavigationButtonWrapper $isVisible={canShowPreviousButton}>
                    <Button
                      size="medium"
                      color="purps"
                      variant="tertiary"
                      onClick={handlePrevious}
                      disabled={currentStop === 0}
                      tabIndex={0}
                      text={strings.PREVIOUS}
                    />
                  </NavigationButtonWrapper>
                  <NavigationButtonWrapper $isVisible={canShowNextButton}>
                    <Button
                      size="medium"
                      color="purps"
                      variant="tertiary"
                      onClick={handleNext}
                      disabled={currentStop === stopCardProps.length - 1}
                      tabIndex={0}
                      text={strings.NEXT}
                    />
                  </NavigationButtonWrapper>
                </NavigationButtons>
              </Conditional>
            </StopsContainer>
          </ItinerarySwipeSheetContentContainer>
        </BottomSheet>
      </ItinerarySwipeSheetContainer>
    </Conditional>
  );
};

export default ItinerarySwipeSheet;
