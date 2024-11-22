import { useRecoilValue } from 'recoil';
import { Itinerary } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { isValidMap } from 'components/common/Itinerary/MapView/Map/utils';
import TabWrapper from 'components/slices/TabWrapper';
import { isCruiseItinerary } from 'utils/itinerary';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PRODUCT_CARD_REVAMP,
} from 'const/index';
import { strings } from 'const/strings';
import AttractionsCarousel from '../AttractionsCarousel';
import BoardingPoints from '../RouteDetails/BoardingPoint';
import HOHORouteMap from '../RouteDetails/RouteMap';
import { Container, Wrapper } from './styles';

const SightsCovered = ({
  itineraryData,
  isCruisesRevamp,
}: {
  itineraryData: Itinerary[];
  isCruisesRevamp: boolean;
}) => {
  const { isMobile } = useRecoilValue(appAtom);

  const tabsArray = itineraryData?.map((itinerary, index: number) => {
    const {
      details: { routeName = '' },
      sections,
      id: itineraryId,
      name: itineraryName,
      type,
      map: routeMapData,
    } = itinerary || {};

    return {
      children: (
        <Container key={itineraryId}>
          <AttractionsCarousel
            isMobile={isMobile}
            routeSectionsData={sections}
            index={itineraryName}
            isSightsCovered={true}
            hideStopName={true}
            excludeStopAsAttraction={
              isCruisesRevamp && !isCruiseItinerary(type)
            }
          />
          <Conditional if={sections?.length && isValidMap(sections)}>
            <HOHORouteMap
              itinerary={itinerary}
              routeMapData={routeMapData}
              routeName={routeName}
              showLegend={true}
              isOnTop={true}
              showOverlay={true}
              sectionName={PRODUCT_CARD_REVAMP.PLACEMENT.MORE_DETAILS}
              isSightsCoveredLayout={!isCruisesRevamp}
            />
          </Conditional>
          <BoardingPoints sectionsData={sections} />
        </Container>
      ),
      heading: routeName || itineraryName,
      trackingObject: {
        eventName: ANALYTICS_EVENTS.ITINERARY_VARIANT_CLICKED,
        [ANALYTICS_PROPERTIES.ITINERARY_ID]: itineraryId,
        [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName || itineraryName,
        [ANALYTICS_PROPERTIES.RANKING]: index + 1,
      },
    };
  });

  return (
    <>
      <h6 className="sights-covered-heading">
        {strings.CRUISES.SIGHTS_COVERED}
      </h6>
      <Wrapper $noTabs={itineraryData?.length < 2}>
        <TabWrapper
          tabElements={tabsArray}
          renderTabElements={true}
          showControls={true}
        />
      </Wrapper>
    </>
  );
};

export default SightsCovered;
