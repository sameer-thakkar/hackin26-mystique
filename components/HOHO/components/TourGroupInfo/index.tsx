import { useContext, useRef } from 'react';
import dynamic from 'next/dynamic';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import { TourGroupInfoProps } from 'components/HOHO/components/TourGroupInfo/interface';
import {
  ButtonWrapper,
  DetailsPill,
  RouteInfoContainer,
  SidePanelImageContainer,
  SwiperControls,
  TourInfo,
  TourInfoContainer,
  TourRouteInfo,
} from 'components/HOHO/components/TourGroupInfo/styles';
import { FILTERED_HIGHLIGHTS } from 'components/HOHO/constants';
import {
  extractAccordionsFromHighlights,
  getObject,
} from 'components/HOHO/utils';
import AccordionGroup from 'components/slices/AccordionGroup';
import TabWrapper from 'components/slices/TabWrapper';
import Image from 'UI/Image';
import { MBContext } from 'contexts/MBContext';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import { filterFromHighlights } from 'utils/productUtils';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  SIDEBAR_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import {
  CHEVRON_RIGHT,
  DROPDOWN_TRIANGLE,
  LTT_CHEVRON_LEFT,
  LTT_CHEVRON_RIGHT,
} from 'assets/SvgIcons';

const MediaCarousel = dynamic(() =>
  import(/* webpackChunkName: "MediaCarousel" */ 'UI/MediaCarousel')
);

const CAROUSEL_SLIDE_NUMBER = 3;

const TourGroupInfo: React.FC<TourGroupInfoProps> = (props) => {
  const {
    tourGroupImage,
    tourGroupName,
    tourGroupId,
    tourGroupHighlights,
    isMobile,
    swipeNext,
    swipePrev,
    activeIndex,
    totalCards,
    tgidRouteData,
    images,
    index,
  } = props;

  const {
    sidebarModal: { addToAside, closeAside },
  } = useContext(MBContext);
  const container = useRef(null);

  const { detailsObjects = {} } = getObject(
    tourGroupHighlights,
    FILTERED_HIGHLIGHTS()
  );
  const finalTimings = detailsObjects[strings.HOHO.TOUR_TIMINGS];
  const finalFrequecy = detailsObjects[strings.HOHO.TOUR_FREQUENCY];

  const closeModal = () => {
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    closeAside();
    // @ts-expect-error TS(2322): Type 'HTMLElement' is not assignable to type 'null... Remove this comment to see the full error message
    if (!container.current) container.current = document.body;
    // @ts-expect-error TS(2721): container.current is possibly 'null'.
    container.current.classList.remove('scroll-lock');
  };

  const finalHighlights = filterFromHighlights(tourGroupHighlights);
  const TourGroupMoreDetails = () => {
    const { accordions } =
      extractAccordionsFromHighlights(finalHighlights) || {};
    return (
      <>
        <Conditional if={isMobile}>
          <SidePanelImageContainer>
            <MediaCarousel
              imageList={images}
              tgid={String(tourGroupId)}
              imageAspectRatio="16:9"
              imageWidth={327}
              imageHeight={202}
              isMobile={isMobile}
            />
          </SidePanelImageContainer>
        </Conditional>
        <AccordionGroup
          accordions={accordions.map((element: any) => {
            const { heading, contents: content } = element || {};
            return { heading, content };
          })}
          useSchema={false}
          openAll={true}
          isSideModal={true}
        />
        <Conditional if={isMobile}>
          <ButtonWrapper>
            <Button
              tabIndex={0}
              size="medium"
              color="purps"
              variant="primary"
              onClick={closeModal}
              text={strings.HOHO.GOT_IT}
            />
          </ButtonWrapper>
        </Conditional>
      </>
    );
  };

  const TourGroupRouteDetails = () => {
    const { intro_text, route_tab } = tgidRouteData || {};

    let tabsArray: any = [];
    route_tab?.forEach((tabItem: Record<string, any>) => {
      const {
        route_intro,
        route_name,
        list_of_attractions,
        route_map_image_link,
      } = tabItem || {};
      tabsArray.push({
        children: (
          <TourRouteInfo key={genUniqueId()}>
            <RichText render={route_intro} />
            <Image
              url={route_map_image_link?.url}
              alt={route_name}
              height={400}
              aspectRatio="16:9"
              fitCrop={true}
              onClick={() => window.open(route_map_image_link?.url)}
            />
            <h3>{strings.HOHO.TOP_ATTRACTIONS}</h3>
            <ul className="attraction-list">
              {list_of_attractions?.map(
                (attraction: Record<string, any>, index: number) => {
                  return (
                    <li className="container" key={genUniqueId()}>
                      <Conditional if={index == 0}>
                        <div className="starting-text">
                          {strings.HOHO.STARTING_LOCATION}:
                        </div>
                      </Conditional>
                      <div className="attraction-name">{attraction?.text}</div>
                    </li>
                  );
                }
              )}
            </ul>
          </TourRouteInfo>
        ),
        heading: route_name,
      });
    });

    return (
      <RouteInfoContainer>
        <RichText render={intro_text} className="intro-text" />
        <TabWrapper tabElements={tabsArray} renderTabElements={true} />
        <Conditional if={isMobile}>
          <ButtonWrapper>
            <Button
              tabIndex={0}
              size="medium"
              color="purps"
              variant="primary"
              onClick={closeModal}
              text={strings.HOHO.GOT_IT}
            />
          </ButtonWrapper>
        </Conditional>
      </RouteInfoContainer>
    );
  };

  const onRouteDetailsClick = (e: any) => {
    e?.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.HOHO.ROUTE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tourGroupId,
    });
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    addToAside({
      width: '50vw',
      children: <TourGroupRouteDetails />,
      type: SIDEBAR_TYPES.TOUR_GROUP_INFO,
      title: strings.HOHO.ROUTES_SCHEDULES,
    });
  };

  const onMoreDetailsClick = (e: any) => {
    e?.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.HOHO.MORE_DETAILS_VIEWED,
      [ANALYTICS_PROPERTIES.TGID]: tourGroupId,
    });
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    addToAside({
      width: '50vw',
      children: <TourGroupMoreDetails />,
      type: SIDEBAR_TYPES.TOUR_GROUP_INFO,
      sidePadding: 40,
      title: tourGroupName?.split(':')?.[0],
    });
  };

  const DROPDOWN_SVG = isMobile ? (
    DROPDOWN_TRIANGLE
  ) : (
    <CHEVRON_RIGHT fillColor={COLORS.GRAY.G2} width={12} height={12} />
  );

  return (
    <TourInfoContainer lessMargin={index === 0}>
      <TourInfo>
        <Image
          url={tourGroupImage?.url}
          alt={tourGroupImage?.altText}
          width={256}
          height={256}
          fitCrop={true}
        />
        <div className="textinfo-container">
          <h2>{tourGroupName?.split(':')?.[0]}</h2>
          <div className="details-container">
            <Conditional if={finalTimings || finalFrequecy}>
              <div className="timings">
                <span>{finalTimings}</span>
                <Conditional if={finalFrequecy}>
                  <span className="vertical-divider" />
                  <span>{finalFrequecy}</span>
                </Conditional>
              </div>
            </Conditional>
            <div className="pills-container">
              <Conditional if={tgidRouteData}>
                <DetailsPill onClick={onRouteDetailsClick}>
                  {strings.HOHO.ROUTE_DETAILS} {DROPDOWN_SVG}
                </DetailsPill>
              </Conditional>
              <Conditional if={finalHighlights?.length}>
                <DetailsPill onClick={onMoreDetailsClick}>
                  {strings.HOHO.MORE_DETAILS}
                  {DROPDOWN_SVG}
                </DetailsPill>
              </Conditional>
            </div>
          </div>
        </div>
      </TourInfo>
      <Conditional if={!isMobile && totalCards > CAROUSEL_SLIDE_NUMBER}>
        <SwiperControls>
          <span className="prev-pill">
            <LTT_CHEVRON_LEFT onClick={swipePrev} disabled={activeIndex <= 0} />
          </span>
          <span className="next-pill">
            <LTT_CHEVRON_RIGHT
              onClick={swipeNext}
              disabled={activeIndex + CAROUSEL_SLIDE_NUMBER >= totalCards}
            />
          </span>
        </SwiperControls>
      </Conditional>
    </TourInfoContainer>
  );
};

export default TourGroupInfo;
