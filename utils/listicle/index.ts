import { IDataEventProps } from 'components/slices/ListicleV2/interfaces';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  EXPERIENCES,
} from 'const/index';

const getTrackingData = (
  cardSize: string,
  eventName: string,
  experienceType: string,
  experienceId: string,
  listicleSectionTitle: string,
  heading: string,
  experienceName: string,
  index: number
) => {
  const eventData = {
    eventName,
    [ANALYTICS_PROPERTIES.CARD_SIZE]: cardSize,
    [ANALYTICS_PROPERTIES.SECTION]: listicleSectionTitle,
    [ANALYTICS_PROPERTIES.CARD_TYPE]:
      experienceType === EXPERIENCES.SUBCATEGORY
        ? 'Sub Category'
        : experienceType,
    [ANALYTICS_PROPERTIES.RANKING]: index + 1,
  };
  switch (experienceType) {
    case EXPERIENCES.COLLECTION:
      return {
        ...eventData,
        [ANALYTICS_PROPERTIES.COLLECTION_ID]: experienceId,
        [ANALYTICS_PROPERTIES.COLLECTION_NAME]: heading,
      };
    case EXPERIENCES.CATEGORY:
      return {
        ...eventData,
        [ANALYTICS_PROPERTIES.CATEGORY_ID]: experienceId,
        [ANALYTICS_PROPERTIES.CATEGORY_NAME]: experienceName,
      };
    case EXPERIENCES.SUBCATEGORY:
      return {
        ...eventData,
        [ANALYTICS_PROPERTIES.SUB_CAT_ID]: experienceId,
        [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: experienceName,
      };
    default:
      return eventData;
  }
};

export const trackReadMoreEvent = ({
  cardSize,
  experienceType,
  experienceId,
  listicleSectionTitle,
  heading,
  experienceName,
  index,
}: IDataEventProps) => {
  const data = getTrackingData(
    cardSize,
    ANALYTICS_EVENTS.LISTICLE_READ_MORE_CLICKED,
    experienceType,
    experienceId,
    listicleSectionTitle,
    heading,
    experienceName,
    index
  );
  trackEvent(data);
};

export const trackCTAClickEvent = ({
  cardSize,
  experienceType,
  experienceId,
  listicleSectionTitle,
  heading,
  experienceName,
  index,
}: IDataEventProps) => {
  const data = getTrackingData(
    cardSize,
    ANALYTICS_EVENTS.LISTICLE_CTA_CLICKED,
    experienceType,
    experienceId,
    listicleSectionTitle,
    heading,
    experienceName,
    index
  );
  trackEvent(data);
};

export const getExperienceType = (experience: Record<any, any>) => {
  if (experience?.collection_id) return EXPERIENCES.COLLECTION;
  else if (experience?.subcategory) return EXPERIENCES.SUBCATEGORY;
  else if (experience?.category) return EXPERIENCES.CATEGORY;
  else return null;
};
