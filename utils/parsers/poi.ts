import { getHeadoutLanguagecode } from 'utils';
import { getRelatedContentPagesUrl } from 'utils/contentPageUtils';
import { getCurrentOperatingHours } from 'utils/dateUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import { LANGUAGE_MAP, SHOULDER_PAGE_TYPES } from 'const/index';
import { strings } from 'const/strings';
import {
  ADDRESS,
  ARCHITECTURE_STYLE,
  DOOR_ENTRANCE,
  // HEIGHT,
  TICKET,
  TIMER,
  TIMING,
  UNESCO_STATUS,
  USERS,
  WAIT_TIME,
  WAIT_TIME_FAST,
} from 'assets/SvgIcons';

export const getPoiQuickInfo = (
  data: Record<string, any> = {},
  relatedContentPages?: Record<string, any>[],
  lang?: string
) => {
  const {
    location,
    recommendedDuration,
    visitorsPerYear,
    unescoYear,
    expectedWaitTime = {},
    architecturalStyle,
    operatingSchedules,
    content,
    minPrice,
    ticketsUID,
  } = data;
  const { entrances } = content?.data || {};

  const { standard: standardTickets, stl_tickets: skipTheLineTickets } =
    expectedWaitTime || {};

  const mappings = {
    ADDRESS: {
      value: location?.address,
      Icon: ADDRESS,
      url: getRelatedContentPagesUrl({
        relatedContentPages,
        type: SHOULDER_PAGE_TYPES.DIRECTIONS,
        lang,
      }),
    },
    RECOMMENDED_DURATION: {
      value: recommendedDuration,
      Icon: TIMER,
    },
    TIMINGS: {
      value: getCurrentOperatingHours(operatingSchedules, lang ?? 'en').hours,
      Icon: TIMING,
      url: getRelatedContentPagesUrl({
        relatedContentPages,
        type: SHOULDER_PAGE_TYPES.TIMINGS,
        lang,
      }),
    },
    VISITORS_PER_YEAR: {
      value: visitorsPerYear,
      Icon: USERS,
    },
    // SIZE_HEIGHT: {
    //   value: '[ignored for now]',
    //   Icon: HEIGHT,
    // },
    TICKETS: {
      value: minPrice && `${strings.CONTENT_PAGE.FROM} ${minPrice}`,
      Icon: TICKET,
      url: `${convertUidToUrl({
        uid: ticketsUID,
        lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
      })}`,
    },
    NUMBER_OF_ENTRANCES: {
      value: entrances?.length > 1 ? entrances?.length : null,
      Icon: DOOR_ENTRANCE,
      url: getRelatedContentPagesUrl({
        relatedContentPages,
        type: SHOULDER_PAGE_TYPES.ENTRANCES,
        lang,
      }),
    },
    EXPECTED_WAIT_TIME_STANDARD: {
      value:
        (standardTickets?.PEAK_SEASON || standardTickets?.OFF_PEAK_SEASON) &&
        `${standardTickets?.PEAK_SEASON} (${strings.CONTENT_PAGE.PEAK}), ${standardTickets?.OFF_PEAK_SEASON} (${strings.CONTENT_PAGE.OFF_PEAK})`,
      Icon: WAIT_TIME,
    },
    EXPECTED_WAIT_TIME_SKIP_THE_LINE: {
      value:
        (skipTheLineTickets?.PEAK_SEASON ||
          skipTheLineTickets?.OFF_PEAK_SEASON) &&
        `${skipTheLineTickets?.PEAK_SEASON} (${strings.CONTENT_PAGE.PEAK}), ${skipTheLineTickets?.OFF_PEAK_SEASON} (${strings.CONTENT_PAGE.OFF_PEAK})`,
      Icon: WAIT_TIME_FAST,
    },
    UNESCO_YEAR: {
      value: unescoYear,
      Icon: UNESCO_STATUS,
    },
    ARCHITECTURE_STYLE: {
      value: architecturalStyle,
      Icon: ARCHITECTURE_STYLE,
    },
  };

  // filter out empty values
  return Object.fromEntries(
    Object.entries(mappings).filter((child) => child[1].value)
  );
};
