import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { ChildSection, Section } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import type { TItineraryComponentProps } from 'components/common/Itinerary/interface';
import ItineraryMapViewBanner from 'components/common/Itinerary/ItineraryMapViewBanner';
import ItineraryViewSwitch from 'components/common/Itinerary/ItineraryViewSwitch';
import { ItineraryViewMode } from 'components/common/Itinerary/ItineraryViewSwitch/interface';
import { TimelineViewComponentVariant } from 'components/common/Itinerary/TimelineView/interface';
import type { TTabListItemProps } from 'UI/Tabs/interface';
import { useItinerary } from 'contexts/ItineraryContext';
import { trackEvent } from 'utils/analytics';
import { isMobile } from 'utils/helper';
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
  onActiveTabChange,
  showTitle = true,
  isHohoItinerary = false,
}: TItineraryComponentProps) => {
  const isDesktop = !isMobile();
  const { isBot } = useRecoilValue(appAtom);
  const { itineraryViewMode, setItineraryViewMode, setActiveItineraryStopId } =
    useItinerary();
  const [activeTab, setActiveTab] = useState(
    itineraryData[0]?.id.toString() ?? ''
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
    setItineraryViewMode(ItineraryViewMode.TIMELINE);
  }, [activeItineraryData]);

  const itinerariesToRender = (
    isBot ? itineraryData : [activeItineraryData!]
  ).filter((itineraryItem) => itineraryItem);

  const handleTabChange = (tab: TTabListItemProps) => {
    setActiveTab(tab.id);
    trackItineraryTabChange(tab);
    onActiveTabChange?.(tab);
  };

  const handleViewChange = (activeView: ItineraryViewMode) => {
    setItineraryViewMode(activeView);
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
    setActiveItineraryStopId(sectionDetails.id);
  };

  return (
    <>
      <Conditional if={showTitle}>
        <h6 id="itinerary-section-title" data-itinerary-section-title="true">
          {isHohoItinerary ? strings.HOHO.ROUTES : strings.ITINERARY.TAB}
        </h6>
      </Conditional>
      <StyledItinerarySectionContainer>
        <Conditional if={itineraryData?.length > 1}>
          <Tabs
            activeTab={activeTab}
            onChangeTab={handleTabChange}
            tabListItems={tabListItems}
            hideNavigationArrows={!isDesktop}
            autoFocusOnSelectedTab={!isDesktop}
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
        <Conditional if={isDesktop && hasMapView}>
          <ItineraryViewSwitch
            viewMode={itineraryViewMode}
            onChangeViewMode={handleViewChange}
          />
          <SpaceBlock $gap={'2rem'} />
        </Conditional>
        <Conditional if={!isDesktop && hasMapView}>
          <ItineraryMapViewBanner
            onClick={() => handleViewChange(ItineraryViewMode.MAP)}
          />
          <SpaceBlock $gap={'2rem'} />
        </Conditional>
      </StyledItinerarySectionContainer>
      <Conditional
        if={
          activeItineraryData &&
          itineraryViewMode === ItineraryViewMode.TIMELINE
        }
      >
        {itinerariesToRender.map((itineraryItem) => (
          <Block
            $isVisible={itineraryItem.id === activeItineraryData?.id}
            key={itineraryItem.id}
          >
            <TimelineView
              itinerary={itineraryItem}
              variant={
                isDesktop && itineraryViewMode === ItineraryViewMode.TIMELINE
                  ? TimelineViewComponentVariant.DEFAULT
                  : TimelineViewComponentVariant.REDUCED_WIDTH
              }
              onStopSectionClick={handleStopSectionClick}
            />
          </Block>
        ))}
      </Conditional>
      <Conditional if={itineraryViewMode === ItineraryViewMode.MAP}>
        {activeItineraryData && <MapView itinerary={activeItineraryData} />}
      </Conditional>
    </>
  );
};

export default Itinerary;
