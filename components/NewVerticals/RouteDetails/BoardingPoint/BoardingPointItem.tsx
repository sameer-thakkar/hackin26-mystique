import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES, CTA_TYPE } from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import { Container, DirectionCTA, StopName, Title } from './styles';
import { TBoardingPoint } from './types';

const BoardingPointItem = (props: TBoardingPoint) => {
  const {
    stopName,
    stopNumber,
    stopLocation,
    isSideModal = false,
    hideStopNumber = false,
    hideStop = false,
  } = props || {};
  if (hideStop) return null;
  return (
    <Container $isSideModal={isSideModal}>
      <Title>
        {strings.CRUISES.BOARDING_POINT} {!hideStopNumber ? stopNumber : ''}
      </Title>
      <StopName>{stopName}</StopName>
      <DirectionCTA
        href={stopLocation}
        target="_blank"
        rel="nofollow noopener"
        onClick={() => {
          trackEvent({
            eventName: ANALYTICS_EVENTS.ITINERARY_CTA_CLICKED,
            [ANALYTICS_PROPERTIES.CTA_TYPE]: CTA_TYPE.MAP_LINK,
            [ANALYTICS_PROPERTIES.LABEL]: en.CRUISES.GET_DIRECTIONS,
            [ANALYTICS_PROPERTIES.SECTION]: en.CRUISES.BOARDING_POINTS,
            [ANALYTICS_PROPERTIES.STOP_NAME]: stopName,
            [ANALYTICS_PROPERTIES.STOP_NUMBER]: stopNumber,
          });
        }}
      >
        {strings.CRUISES.GET_DIRECTIONS}
      </DirectionCTA>
    </Container>
  );
};
export default BoardingPointItem;
