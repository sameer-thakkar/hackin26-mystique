import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
  SIDEBAR_TYPES,
} from 'const/index';
import { MBContext } from 'contexts/MBContext';
import React, { useContext, useRef } from 'react';
import { scroller } from 'react-scroll';
import Conditional from 'components/common/Conditional';
import { generateSidenavId } from 'utils/helper';
import { strings } from 'const/strings';
import COLORS from 'const/colors';
import {
  SideNavButton,
  StyledItem,
  StyledIcon,
  BorderHighlight,
} from 'UI/SideNav/styles';
import { DOUBLE_CHEVRON, LIST_ICON, TickSvg } from 'assets/SvgIcons';
import { useRecoilState } from 'recoil';
import { appAtom } from 'store/atoms/app';
import { trackEvent } from 'utils/analytics';
import { ISideNavModalProps } from 'UI/SideNav/interface';

const SideNavModal: React.FC<ISideNavModalProps> = ({
  items = [],
  isMobile = false,
  collectionId,
  collectionName,
  pageTitle = '',
  visibleHeading = '',
}) => {
  const [appState, setAppState] = useRecoilState(appAtom);
  const {
    sidebarModal: { addToAside, closeAside },
  } = useContext(MBContext);
  const container = useRef(null);

  const onSideNavClick = (e: any) => {
    e.stopPropagation();
    trackEvent({
      eventName: ANALYTICS_EVENTS.TOC_OPENED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionName,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: pageTitle,
    });
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    addToAside({
      width: '282px',
      children: <div>{getSideNavItems(items)}</div>,
      type: SIDEBAR_TYPES.SIDE_NAV,
      title: strings.TABLE_OF_CONTENTS,
    });
  };
  const scrollToElement = (id: string, index: number, headingItem: string) => {
    scroller.scrollTo(id, {
      duration: 1200,
      smooth: 'easeInOutQuart',
      offset: isMobile ? -30 : -100,
    });
    trackEvent({
      eventName: ANALYTICS_EVENTS.TOC_OPTION_SELECTED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionName,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: pageTitle,
      [ANALYTICS_PROPERTIES.OPTION_TEXT]: headingItem,
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
    setAppState({ ...appState, isSidenavScroll: true });
    // @ts-expect-error TS(2721): Cannot invoke an object which is possibly 'null'.
    closeAside();
    // @ts-expect-error TS(2322): Type 'HTMLElement' is not assignable to type 'null... Remove this comment to see the full error message
    if (!container.current) container.current = document.body;
    // @ts-expect-error TS(2721): container.current is possibly 'null'.
    container.current.classList.remove('scroll-lock');
  };

  const isActive = (sidenavID: string) => sidenavID === visibleHeading;

  const getSideNavItems = (items: Array<string>) => {
    return (
      <>
        {items?.map((headingItem, index) => {
          const sidenavID = generateSidenavId(headingItem);
          return (
            <StyledItem
              key={headingItem}
              onClick={() => scrollToElement(sidenavID, index, headingItem)}
              className={isActive(sidenavID) ? 'active' : undefined}
              id={isActive(sidenavID) ? `active-element` : undefined}
            >
              <Conditional if={isActive(sidenavID)}>
                <BorderHighlight />
              </Conditional>
              <span
                className={`sidenav-item ${
                  isActive(sidenavID) ? 'active' : ''
                }`}
              >
                {headingItem}
              </span>
              <Conditional if={isActive(sidenavID)}>
                <TickSvg strokeColor={COLORS.BRAND.PURPS} />
              </Conditional>
            </StyledItem>
          );
        })}
      </>
    );
  };

  return (
    <SideNavButton onClick={onSideNavClick}>
      <Conditional if={isMobile}>
        <StyledIcon className="list-icon">{LIST_ICON}</StyledIcon>
      </Conditional>
      {strings.TABLE_OF_CONTENTS}
      <Conditional if={!isMobile}>
        <StyledIcon className="double-chevron">{DOUBLE_CHEVRON}</StyledIcon>
      </Conditional>
    </SideNavButton>
  );
};

export default SideNavModal;
