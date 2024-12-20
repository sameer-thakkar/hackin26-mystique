import { useEffect, useRef, useState } from 'react';
import { mobileDrawerStyles } from 'components/AirportTransfers/PrivateAirportTransferProductCard/styles';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import ZoomPanPinch from 'components/common/ZoomPanPinch';
import {
  BUFFER_DISTANCE,
  DEFAULT_MAP_SECTION_INFO,
  MAX_VISIBLE_POINT_X_ON_MAP,
  MIN_HEIGHT_OF_HOVERED_INFO_CARD,
  MIN_VISIBLE_POINT_ON_SCREEN,
  SEATING_MAP,
} from 'components/SeatMapPage/constants';
import {
  MapHoveredSectionInfoType,
  THEATRE_SECTION_TYPE,
} from 'components/SeatMapPage/interface';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  THEATRE_TYPES,
} from 'const/index';
import ShiningStarIcon from 'assets/shiningStarIcon';
import MapHoverInfoCard from '../MapHoverInfoCard';
import { TInteractiveMapParams } from './interface';
import {
  IconWrapper,
  InteractiveMapWrapper,
  MagicLabel,
  MagicLabelWrapper,
  MHeaderLeft,
  MHeaderRight,
  MHR,
  MLabel,
  MQuickInfo,
  MQuickInfoContainer,
  MQuickInfoHeader,
  MSectionInfo,
  MSectionInfoContainer,
  MSectionInfoWrapper,
  SVGContainer,
  SvgMapContainer,
} from './styles';

const InteractiveMap = ({
  isMobile,
  theatreType,
  isFirstScroll,
  theatreShowTgid,
  addVenueSeatsPageSectionViewedDataEvents,
}: TInteractiveMapParams) => {
  const DEFAULT_VIEW_BOX = SEATING_MAP.viewBox[theatreType]?.(isMobile);
  const seatMapSvgs = SEATING_MAP.seatMapSvgs;
  const mapHoverContent = SEATING_MAP.mapHoverContent[theatreType];
  const CurrentSeatMapSvg = seatMapSvgs[theatreType];
  const [svgViewBox, setSvgViewBox] = useState(DEFAULT_VIEW_BOX);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [highlightSvgSection, setHighlightSvgSection] = useState('');
  const [mapHoveredSectionInfo, setMapHoveredSectionInfo] =
    useState<MapHoveredSectionInfoType>(DEFAULT_MAP_SECTION_INFO);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const removeEventListeners = () => {
    svgContainerRef.current?.removeEventListener('mousemove', mapMouseMoveFn);
    svgContainerRef.current?.removeEventListener('mouseleave', closeHoverCard);
    document?.removeEventListener('scroll', closeHoverCard);
  };

  const addEventListeners = () => {
    svgContainerRef.current?.addEventListener('mousemove', mapMouseMoveFn);
    svgContainerRef.current?.addEventListener('mouseleave', closeHoverCard);
    document?.addEventListener('scroll', closeHoverCard);
  };

  const addSeatMapSectionViewedDataEvents = (
    theatreSectionInfo: THEATRE_SECTION_TYPE
  ) => {
    const detailsType = `${isMobile ? 'with images' : ''}${
      !theatreSectionInfo.rows ? '/without rows' : ''
    }`;

    trackEvent({
      eventName: ANALYTICS_EVENTS.SEATMAP_EXPERIMENT.THEATRE_SECTION_VIEWED,
      [ANALYTICS_EVENTS.SEATMAP_EXPERIMENT.SEATMAP_SECTION]:
        theatreSectionInfo.blockName +
        '-' +
        theatreSectionInfo.theatreSectionLabel,
      [ANALYTICS_PROPERTIES.TGID]: theatreShowTgid,
      [ANALYTICS_PROPERTIES.DETAILS_TYPE]: detailsType,
    });
  };

  useEffect(() => {
    addVenueSeatsPageSectionViewedDataEvents({
      sectionName: 'Interactive Map',
      rank: 2,
    });
    if (isMobile) {
      return;
    }
    addEventListeners();

    return () => {
      removeEventListeners();
    };
  }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }

    return () => {
      document.body.classList.remove('scroll-lock');
    };
  }, [isDrawerOpen]);

  const mapMouseMoveFn = (event: MouseEvent) => {
    const targetElement = event.target as SVGElement;
    const sectionId = targetElement?.className?.baseVal;
    const sectionInfo = mapHoverContent[sectionId];

    if (sectionInfo) {
      const targetElementRect = targetElement?.getBoundingClientRect?.();
      const screenHeight = window.innerHeight;

      let hoveredInfoCardTop =
        Math.max(targetElementRect.top, MIN_VISIBLE_POINT_ON_SCREEN) +
        BUFFER_DISTANCE;
      const hoveredInfoCardLeft =
        Math.min(
          targetElementRect.left + targetElementRect.width,
          MAX_VISIBLE_POINT_X_ON_MAP
        ) + BUFFER_DISTANCE;

      if (
        targetElementRect.top + MIN_HEIGHT_OF_HOVERED_INFO_CARD >=
        screenHeight
      ) {
        hoveredInfoCardTop = screenHeight - MIN_HEIGHT_OF_HOVERED_INFO_CARD;
      }

      setMapHoveredSectionInfo((prevState) => {
        if (prevState.sectionId !== sectionId) {
          addSeatMapSectionViewedDataEvents(sectionInfo);
          return {
            isVisible: true,
            sectionInfo: sectionInfo,
            sectionId,
            left: hoveredInfoCardLeft,
            top: hoveredInfoCardTop,
          };
        }
        return prevState;
      });
    } else {
      setMapHoveredSectionInfo(DEFAULT_MAP_SECTION_INFO);
    }
  };

  const handleSvgOnClick = (event: MouseEvent) => {
    if (!isMobile) {
      return;
    }
    const targetElement = event.target;
    if (targetElement instanceof SVGElement) {
      const sectionId = targetElement?.className?.baseVal;
      if (targetElement.nodeName === 'path' && sectionId) {
        const sectionInfo = mapHoverContent[sectionId];
        const graphicsElement = targetElement as SVGGraphicsElement;
        const bbox = graphicsElement.getBBox();
        const padding = 10;

        let x = bbox.x - padding;
        let y = bbox.y - padding;
        let width = bbox.width + 2 * padding;
        let height = bbox.height + 2 * padding;

        const newViewBox = `${x} ${y} ${width} ${height}`;
        setSvgViewBox(newViewBox);
        setIsDrawerOpen(true);
        setHighlightSvgSection(sectionId);
        addSeatMapSectionViewedDataEvents(sectionInfo);
        setMapHoveredSectionInfo({
          isVisible: false,
          sectionInfo: sectionInfo,
          sectionId,
          left: 0,
          top: 0,
        });
      }
    }
  };

  const sectionInfo = mapHoveredSectionInfo.sectionInfo;

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setHighlightSvgSection('');
  };

  const closeHoverCard = () => {
    setMapHoveredSectionInfo((prev) => {
      if (prev.isVisible) {
        return DEFAULT_MAP_SECTION_INFO;
      }

      return prev;
    });
  };

  return (
    <InteractiveMapWrapper>
      <MagicLabelWrapper>
        <MagicLabel isFirstScroll={isFirstScroll}>
          <ShiningStarIcon />
          <p>
            {isMobile
              ? 'Click on any section of the map to see details'
              : 'Hover on any section of the map to read details'}
          </p>
        </MagicLabel>
      </MagicLabelWrapper>
      <SvgMapContainer ref={svgContainerRef}>
        <ZoomPanPinch isMobile={isMobile}>
          <CurrentSeatMapSvg
            svgViewBox={DEFAULT_VIEW_BOX}
            handleSvgOnClick={handleSvgOnClick}
            isMobile={isMobile}
            highlightSvgSection={isMobile ? highlightSvgSection : undefined}
          />
        </ZoomPanPinch>
      </SvgMapContainer>
      <Conditional if={!isMobile && mapHoveredSectionInfo.isVisible}>
        <MapHoverInfoCard
          top={mapHoveredSectionInfo.top}
          left={mapHoveredSectionInfo.left}
          isVisible={mapHoveredSectionInfo.isVisible}
          sectionInfo={sectionInfo}
          theatreType={theatreType}
        />
      </Conditional>

      <Conditional if={isDrawerOpen && isMobile}>
        <Drawer
          className="product-details-drawer"
          hideSeparator
          $drawerStyles={mobileDrawerStyles}
          closeHandler={handleDrawerClose}
          showPanelAnchor={true}
          hideCrossIcon={true}
        >
          <MSectionInfoWrapper>
            <MSectionInfoContainer>
              <SVGContainer>
                <CurrentSeatMapSvg
                  svgViewBox={svgViewBox}
                  highlightSvgSection={highlightSvgSection}
                  disableHover={true}
                  isMobile={isMobile}
                  fadeNearbyElements={true}
                />
              </SVGContainer>

              <MSectionInfo>
                <MQuickInfoHeader>
                  <MHeaderLeft>
                    {theatreType !== THEATRE_TYPES.ABBA_ARENA
                      ? `${sectionInfo?.theatreSectionLabel}`
                      : `${sectionInfo?.blockName} - ${sectionInfo?.theatreSectionLabel}`}
                  </MHeaderLeft>
                  <MHeaderRight>{sectionInfo?.rows}</MHeaderRight>
                </MQuickInfoHeader>
                <MQuickInfoContainer>
                  {sectionInfo?.quickInfo.map((info, index) => (
                    <MQuickInfo key={index}>
                      <IconWrapper>
                        <info.icon />
                      </IconWrapper>

                      <MLabel>{info.label}</MLabel>
                    </MQuickInfo>
                  ))}
                </MQuickInfoContainer>
              </MSectionInfo>

              <MHR />

              <MLabel>{sectionInfo?.description}</MLabel>
            </MSectionInfoContainer>
          </MSectionInfoWrapper>
        </Drawer>
      </Conditional>
    </InteractiveMapWrapper>
  );
};

export default InteractiveMap;
