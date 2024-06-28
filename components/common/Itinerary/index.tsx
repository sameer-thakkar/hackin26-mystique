import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { ChildSection, Section } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import type { TItineraryComponentProps } from 'components/common/Itinerary/interface';
import ItineraryViewSwitch from 'components/common/Itinerary/ItineraryViewSwitch';
import { ItineraryViewMode } from 'components/common/Itinerary/ItineraryViewSwitch/interface';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import type { TTabListItemProps } from 'UI/Tabs/interface';
import { trackEvent } from 'utils/analytics';
import { getItineraryDescriptorsTypes } from 'utils/itinerary';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import ItineraryDescriptorsCarousel from './ItineraryDescriptorsCarousel';
import { Block, SpaceBlock, StyledItinerarySectionContainer } from './styles';

const TimelineView = dynamic(
  () => import(/* webpackChunkName: "TimelineView" */ './TimelineView')
);
const MapView = dynamic(
  () => import(/* webpackChunkName: "MapView" */ './MapView'),
  { ssr: false }
);
const Tabs = dynamic(() => import(/* webpackChunkName: "Tabs" */ 'UI/Tabs'));

const Itinerary = ({
  itineraryData = [],
  lang,
  isHohoItinerary = false,
}: TItineraryComponentProps) => {
  const { isBot } = useRecoilValue(appAtom);
  const [activeTab, setActiveTab] = useState(
    itineraryData[0]?.id.toString() ?? ''
  );
  const [viewMode, setViewMode] = useState<ItineraryViewMode>(
    ItineraryViewMode.TIMELINE
  );
  const [activeStopSectionId, setActiveStopSectionId] = useState<number | null>(
    null
  );

  const tabListItems: TTabListItemProps[] = itineraryData
    .filter((item) => item)
    .map(({ id, details: { routeName }, name }) => ({
      id: id.toString(),
      label: routeName || name,
    }));
  const activeItineraryData = useMemo(() => {
    return itineraryData
      .filter((item) => item)
      .find(({ id }) => id.toString() === activeTab);
  }, [activeTab]);
  const itineraryDescriptorTypes = useMemo(() => {
    if (activeItineraryData)
      return getItineraryDescriptorsTypes(activeItineraryData);

    return [];
  }, [activeItineraryData]);

  useEffect(() => {
    setViewMode(ItineraryViewMode.TIMELINE);
  }, [activeItineraryData]);

  const itinerariesToRender = (
    isBot ? itineraryData : [activeItineraryData!]
  ).filter((itineraryItem) => itineraryItem);

  const handleTabChange = (tab: TTabListItemProps) => {
    setActiveTab(tab.id);
    trackItineraryTabChange(tab);
  };

  const handleViewChange = () => {
    const activeView =
      viewMode === ItineraryViewMode.TIMELINE
        ? ItineraryViewMode.MAP
        : ItineraryViewMode.TIMELINE;

    setViewMode(activeView);
    trackItineraryViewModeChange(activeView);
  };

  const trackItineraryTabChange = (activeItineraryTab: TTabListItemProps) => {
    const newTab = itineraryData.find(
      ({ id }) => id.toString() === activeItineraryTab.id
    );
    const tabIndex = tabListItems.indexOf(activeItineraryTab);
    if (newTab) {
      const {
        id,
        name,
        details: { routeName },
      } = newTab;
      trackEvent({
        eventName: ANALYTICS_EVENTS.ITINERARY.ITINERARY_VARIANT_CLICKED,
        [ANALYTICS_PROPERTIES.ITINERARY_ID]: id,
        [ANALYTICS_PROPERTIES.ITINERARY_NAME]: routeName ?? name,
        [ANALYTICS_PROPERTIES.RANKING]: tabIndex + 1,
      });
    }
  };

  const trackItineraryViewModeChange = (activeView: ItineraryViewMode) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY.ITINERARY_TOGGLE_CLICKED,
      [ANALYTICS_PROPERTIES.ITINERARY_VIEW]: activeView,
    });
  };

  const hasMapView =
    activeItineraryData?.map &&
    activeItineraryData?.map.active &&
    !!activeItineraryData.map.itineraryRoute.polyline;

  const handleStopSectionClick = (
    sectionDetails: Section | ChildSection | Omit<Section, 'childSections'>
  ) => {
    setActiveStopSectionId(sectionDetails.id);
  };

  return (
    <>
      <h6 data-itinerary-section-title="true">
        {isHohoItinerary ? strings.HOHO.ROUTES : strings.ITINERARY.HEADING}
      </h6>
      <StyledItinerarySectionContainer>
        <Conditional if={itineraryData?.length > 1}>
          <Tabs
            activeTab={activeTab}
            onChangeTab={handleTabChange}
            tabListItems={tabListItems}
          />
        </Conditional>
        <Conditional
          if={
            activeItineraryData &&
            !!Object.keys(activeItineraryData.details)?.length &&
            itineraryDescriptorTypes?.length
          }
        >
          {itinerariesToRender.map((itineraryItem) => (
            <Block
              $isVisible={itineraryItem.id === activeItineraryData?.id}
              key={itineraryItem.id}
              $hasTabs={itineraryData?.length > 1}
            >
              <ItineraryDescriptorsCarousel
                itinerary={itineraryItem}
                lang={lang}
              />
            </Block>
          ))}
        </Conditional>
        <SpaceBlock $gap={'1.5rem'} />
        <Conditional if={hasMapView}>
          <ItineraryViewSwitch
            viewMode={viewMode}
            onChangeViewMode={handleViewChange}
          />
          <SpaceBlock $gap={'2rem'} />
        </Conditional>
      </StyledItinerarySectionContainer>
      <Conditional
        if={activeItineraryData && viewMode === ItineraryViewMode.TIMELINE}
      >
        {itinerariesToRender.map((itineraryItem) => (
          <Block
            $isVisible={itineraryItem.id === activeItineraryData?.id}
            key={itineraryItem.id}
          >
            <TimelineView
              itinerary={itineraryItem}
              variant={
                viewMode === ItineraryViewMode.TIMELINE
                  ? TimelineViewComponentVariant.DEFAULT
                  : TimelineViewComponentVariant.REDUCED_WIDTH
              }
              onStopSectionClick={handleStopSectionClick}
              activeStopSectionId={activeStopSectionId}
            />
          </Block>
        ))}
      </Conditional>
      <Conditional if={viewMode === ItineraryViewMode.MAP}>
        {activeItineraryData && <MapView itinerary={activeItineraryData} />}
      </Conditional>
    </>
  );
};

export default Itinerary;
