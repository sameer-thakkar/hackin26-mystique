import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { trackEvent } from './analytics';

export const getRichtextElements = ({
  type,
  element,
  children,
  parentProps,
}: any) => {
  const { sectionName, sliceType } = parentProps || {};
  const { text, data } = element || {};
  switch (type) {
    case 'hyperlink':
      return (
        <a
          href={data?.url}
          rel="nofollow"
          target="_blank"
          onClick={() => {
            trackEvent({
              eventName: ANALYTICS_EVENTS.CONTENT_SECTION_LINK_CLICKED,
              [ANALYTICS_PROPERTIES.SECTION]: sectionName,
              [ANALYTICS_PROPERTIES.SLICE_TYPE]: sliceType,
              [ANALYTICS_PROPERTIES.LABEL]: text,
              [ANALYTICS_PROPERTIES.HYPERLINK]: data?.url,
            });
          }}
        >
          {children}
        </a>
      );

    default:
      return null;
  }
};
