import React, { useContext, useRef } from 'react';
import { scroller } from 'react-scroll';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Conditional from 'components/common/Conditional';
import { ISideNavModalProps } from 'UI/SideNav/interface';
import {
  BorderHighlight,
  SideNavButton,
  StyledIcon,
  StyledItem,
} from 'UI/SideNav/styles';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { generateSidenavId } from 'utils/helper';
import renderShortCodes from 'utils/shortCodes';
import { appAtom } from 'store/atoms/app';
import { lazyLoadOverrideAtom } from 'store/atoms/lazy';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
  SIDEBAR_TYPES,
} from 'const/index';
import { strings } from 'const/strings';
import DoubleChevron from 'assets/doubleChevron';
import ListIcon from 'assets/listIcon';
import TickSvg from 'assets/tickSvg';

const SideNavModal: React.FC<React.PropsWithChildren<ISideNavModalProps>> = ({
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
  const setLazyLoadOverride = useSetRecoilState(lazyLoadOverrideAtom);
  const container = useRef(null);

  const onSideNavClick = (e: any) => {
    e.stopPropagation();
    setLazyLoadOverride(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.TOC_OPENED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.CONTENT_PAGE,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
      [ANALYTICS_PROPERTIES.COLLECTION_NAME]: collectionName,
      [ANALYTICS_PROPERTIES.PAGE_TITLE]: pageTitle,
    });
    addToAside({
      width: '282px',
      children: <div>{getSideNavItems(items)}</div>,
      type: SIDEBAR_TYPES.SIDE_NAV,
      title: strings.TABLE_OF_CONTENTS,
    });
  };

  const scrollToElement = async (
    id: string,
    index: number,
    headingItem: string
  ) => {
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
                {renderShortCodes(headingItem)}
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
        <StyledIcon className="list-icon">{ListIcon}</StyledIcon>
      </Conditional>
      <span>{strings.TABLE_OF_CONTENTS}</span>
      <Conditional if={!isMobile}>
        <StyledIcon className="double-chevron">{DoubleChevron}</StyledIcon>
      </Conditional>
    </SideNavButton>
  );
};

export default SideNavModal;
