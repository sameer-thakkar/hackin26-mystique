import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { CARD_SECTION_MARKERS } from 'const/productCard';

export function trackDeadClick(e: any) {
  const cardSection = e.target.getAttribute('data-card-section');

  if (cardSection) {
    switch (cardSection) {
      case CARD_SECTION_MARKERS.ACTION_BTN:
        break;
      case CARD_SECTION_MARKERS.DESCRIPTORS:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.DESCRIPTORS,
        });
        break;
      case CARD_SECTION_MARKERS.REVIEWS:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.REVIEWS,
        });
        break;
      case CARD_SECTION_MARKERS.CATEGORY:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.CATEGORY,
        });
        break;
      case CARD_SECTION_MARKERS.IMAGE:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.IMAGE,
        });
        break;
      case CARD_SECTION_MARKERS.TITLE:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.TITLE,
        });
        break;
      case CARD_SECTION_MARKERS.PRICING:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.PRICING,
        });
        break;
      case CARD_SECTION_MARKERS.AVAILABILITY:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.AVAILABILITY,
        });
        break;
      default:
        trackEvent({
          eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
          [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.WHITESPACE,
        });
    }
  } else {
    trackEvent({
      eventName: ANALYTICS_EVENTS.PRODUCT_CARD_DEADCLICK,
      [ANALYTICS_PROPERTIES.COMPONENT]: CARD_SECTION_MARKERS.WHITESPACE,
    });
  }
}
