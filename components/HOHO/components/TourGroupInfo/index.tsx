import { useContext, useRef } from 'react';
import dynamic from 'next/dynamic';
import { PrismicRichText } from '@prismicio/react';
import Button from '@headout/aer/src/atoms/Button';
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
import { ProductDescriptors } from 'components/Product/components/ProductDescriptors';
import AccordionGroup from 'components/slices/AccordionGroup';
import TabWrapper from 'components/slices/TabWrapper';
import Image from 'UI/Image';
import { Paginator } from 'UI/Paginator';
import { MBContext } from 'contexts/MBContext';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import { filterFromHighlights } from 'utils/productUtils';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  SIDEBAR_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import DropdownTriangle from 'assets/dropdownTriangle';
import { InfoIconWrapperComponent } from 'assets/infoIconWrapped';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';
import Map from 'assets/map';

const MediaCarousel = dynamic(
  () => import(/* webpackChunkName: "MediaCarousel" */ 'UI/MediaCarousel')
);

const CAROUSEL_SLIDE_NUMBER = 3;

const TourGroupInfo: React.FC<React.PropsWithChildren<TourGroupInfoProps>> = (
  props
) => {
  const {
    tourGroupImage,
    tourGroupName,
    tourGroupId,
    tourGroupHighlights,
    isMobile,
    swipeNext,
    swipePrev,
    activeIndex = 0,
    totalCards,
    tgidRouteData,
    images,
    index,
    descriptorsArray = [],
    minDuration,
    maxDuration,
    isCombo,
  } = props;

  const {
    lang,
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
            <PrismicRichText
              field={route_intro}
              components={shortCodeSerializer}
            />
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
        <PrismicRichText field={intro_text} components={shortCodeSerializer} />
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
    addToAside({
      width: '50vw',
      children: <TourGroupMoreDetails />,
      type: SIDEBAR_TYPES.TOUR_GROUP_INFO,
      sidePadding: 40,
      title: tourGroupName,
    });
  };

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
          <h2>{tourGroupName}</h2>
          <Conditional if={!isMobile}>
            <ProductDescriptors
              descriptorArray={descriptorsArray}
              minDuration={minDuration}
              maxDuration={maxDuration}
              lang={lang}
              isCombo={isCombo}
              horizontal={true}
            />
          </Conditional>
          <div className="details-container">
            <Conditional if={!isMobile}>
              <Conditional if={finalTimings}>
                <DetailsPill>
                  <div className="title">{strings.HOHO.TIMINGS}</div>
                  <div className="info">{finalTimings}</div>
                </DetailsPill>
              </Conditional>
              <Conditional if={finalFrequecy}>
                <DetailsPill>
                  <div className="title">{strings.HOHO.FREQUENCY}</div>
                  <div className="info">{finalFrequecy}</div>
                </DetailsPill>
              </Conditional>
              <Conditional if={tgidRouteData}>
                <DetailsPill onClick={onRouteDetailsClick} isClickable={true}>
                  <div className="title">{strings.HOHO.BUS_ROUTES}</div>
                  <div className="info">
                    {strings.HOHO.VIEW_ROUTES}
                    {ChevronRight({
                      fillColor: COLORS.GRAY.G3,
                      height: 8,
                      width: 8,
                      strokeWidth: 2,
                    })}
                  </div>
                </DetailsPill>
              </Conditional>
              <Conditional if={finalHighlights?.length}>
                <DetailsPill onClick={onMoreDetailsClick} isClickable={true}>
                  <div className="title">{strings.HOHO.BUS_DETAILS}</div>
                  <div className="info">
                    {strings.HOHO.VIEW_TOUR_DETAILS}
                    {ChevronRight({
                      fillColor: COLORS.GRAY.G3,
                      height: 8,
                      width: 8,
                      strokeWidth: 2,
                    })}
                  </div>
                </DetailsPill>
              </Conditional>
            </Conditional>

            <Conditional if={isMobile}>
              <Conditional if={finalTimings || finalFrequecy}>
                <div className="timings">
                  <span>{finalTimings}</span>
                  <Conditional if={finalFrequecy}>
                    <span className="dot-separator" />
                    <span>{finalFrequecy}</span>
                  </Conditional>
                </div>
              </Conditional>
            </Conditional>
          </div>
        </div>
        <Conditional if={isMobile}>
          <div className="pills-container">
            <Conditional if={tgidRouteData}>
              <DetailsPill
                className="details-pill first"
                onClick={onRouteDetailsClick}
              >
                <Map className="pill-icon" width={12} height={12} />
                {strings.HOHO.BUS_ROUTES_DETAILS}

                {DropdownTriangle}
              </DetailsPill>
            </Conditional>
            <Conditional if={finalHighlights?.length}>
              <DetailsPill
                className="details-pill second"
                onClick={onMoreDetailsClick}
              >
                <InfoIconWrapperComponent className="pill-icon" />
                {strings.HOHO.TOUR_DETAILS}
                {DropdownTriangle}
              </DetailsPill>
            </Conditional>
          </div>
        </Conditional>
      </TourInfo>
      <Conditional if={!isMobile && totalCards > CAROUSEL_SLIDE_NUMBER}>
        <SwiperControls>
          <span className="prev-pill">
            <LttChevronLeft onClick={swipePrev} disabled={activeIndex <= 0} />
          </span>
          <span className="next-pill">
            <LttChevronRight
              onClick={swipeNext}
              disabled={activeIndex + CAROUSEL_SLIDE_NUMBER >= totalCards}
            />
          </span>
        </SwiperControls>
      </Conditional>
      <Conditional if={isMobile && totalCards > 1}>
        <div className="pagination">
          <div>{strings.HOHO.SELECT_TOUR}</div>
          <Paginator
            tabSize={1}
            dotSize={0.5}
            totalCount={totalCards}
            activeIndex={activeIndex}
            activeColor={COLORS.BRAND.PURPS}
            inactiveColor={COLORS.GRAY.G6}
            activeSlideTimer={0.1}
            margin={0.125}
          />
        </div>
      </Conditional>
    </TourInfoContainer>
  );
};

export default TourGroupInfo;
