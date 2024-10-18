import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  MORE_DETAILS_SWIPESHEET,
  PRODUCT_CARD_REVAMP,
} from 'const/index';
import en from 'const/localization/en';
import { strings } from 'const/strings';
import SwipesheetCross from 'assets/swipesheetCross';
import Conditional from '../Conditional';
import FilterPills from './FilterPills';
import { PopupContainer } from './styles';
import { TPdfPopup } from './types';

const PdfViewer = dynamic(() => import('./PageView'));

const PdfPopup = ({
  onHide,
  controller,
  pdfData = [],
  isCTA = false,
  tgid,
  rank,
  isMobile,
}: TPdfPopup) => {
  const [isPopupActive, setisPopupActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const openPopup = (startingIndex = 0) => {
    setisPopupActive(true);
    setActiveIndex(startingIndex);
    document.body.style.overflow = 'hidden';
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY_POPUP_VIEWED,
      [ANALYTICS_PROPERTIES.ITINERARY_TYPE]: en.CRUISES.FOOD_MENU,
      [ANALYTICS_PROPERTIES.PLACEMENT]: isCTA
        ? PRODUCT_CARD_REVAMP.PLACEMENT.PRODUCT_CARD
        : PRODUCT_CARD_REVAMP.PLACEMENT.MORE_DETAILS,
      [ANALYTICS_PROPERTIES.FOOD_MENUS_PRESENT]: pdfData?.map(
        (pdf) => pdf.name
      ),
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.RANKING]: rank,
    });
  };

  const closePopup = (isButton = false) => {
    setisPopupActive(false);
    onHide?.();
    trackEvent({
      eventName: ANALYTICS_EVENTS.ITINERARY_POPUP_CLOSED,
      [ANALYTICS_PROPERTIES.ACTION]: isButton
        ? MORE_DETAILS_SWIPESHEET.ACTION.CLOSE_BUTTON
        : MORE_DETAILS_SWIPESHEET.ACTION.OVERLAY_CLICKED,
    });
  };

  useEffect(() => {
    if (controller) {
      controller.current = {
        open: openPopup,
        close: closePopup,
      };
    }
  }, []);

  useEffect(() => {
    const closeOnKeypress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };
    window.addEventListener('keydown', closeOnKeypress);
    return () => window.removeEventListener('keydown', closeOnKeypress);
  }, []);

  useEffect(() => {
    if (isMobile) {
      window.onpopstate = () => {
        closePopup();
      };
    }
  }, [isPopupActive]);

  const isSinglePdf = pdfData?.length === 1;
  return (
    <PopupContainer
      $isPopupActive={isPopupActive}
      onClick={(e) => e.stopPropagation()}
      $noFilterTabs={isSinglePdf}
    >
      <div
        className="overlay"
        onClick={() => closePopup()}
        role="button"
        tabIndex={0}
      />
      <div className="main-content">
        <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
          <div>
            <h3 className="title">
              {!isSinglePdf ? strings.CRUISES.FOOD_MENU : pdfData?.[0]?.name}
            </h3>
            <Conditional if={!isSinglePdf}>
              <FilterPills
                pdfData={pdfData}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </Conditional>
          </div>
          <button className="close-button" onClick={() => closePopup(true)}>
            {SwipesheetCross}
          </button>
        </div>
        <Conditional if={isPopupActive}>
          <PdfViewer
            documentSrc={pdfData?.[activeIndex]?.url}
            setIsScrolled={setIsScrolled}
          />
        </Conditional>
      </div>
    </PopupContainer>
  );
};

export default PdfPopup;
