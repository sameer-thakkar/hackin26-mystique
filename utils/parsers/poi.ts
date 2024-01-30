import { getHeadoutLanguagecode } from 'utils';
import { getRelatedContentPagesUrl } from 'utils/contentPageUtils';
import { getCurrentOperatingHours } from 'utils/dateUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import { LANGUAGE_MAP, SHOULDER_PAGE_TYPES } from 'const/index';
import { strings } from 'const/strings';
import Address from 'assets/address';
import ArchitectureStyle from 'assets/architectureStyle';
import DoorEntrance from 'assets/doorEntrance';
import Ticket from 'assets/ticket';
import Timer from 'assets/timer';
import Timing from 'assets/timing';
import UnescoStatus from 'assets/unescoStatus';
import Users from 'assets/users';
import WaitTime from 'assets/waitTime';
import WaitTimeFast from 'assets/waitTimeFast';

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
      Icon: Address,
      url: getRelatedContentPagesUrl({
        relatedContentPages,
        type: SHOULDER_PAGE_TYPES.DIRECTIONS,
        lang,
      }),
    },
    RECOMMENDED_DURATION: {
      value: recommendedDuration,
      Icon: Timer,
    },
    TIMINGS: {
      value: getCurrentOperatingHours(operatingSchedules, lang ?? 'en').hours,
      Icon: Timing,
      url: getRelatedContentPagesUrl({
        relatedContentPages,
        type: SHOULDER_PAGE_TYPES.TIMINGS,
        lang,
      }),
    },
    VISITORS_PER_YEAR: {
      value: visitorsPerYear,
      Icon: Users,
    },
    // SIZE_HEIGHT: {
    //   value: '[ignored for now]',
    //   Icon: HEIGHT,
    // },
    TICKETS: {
      value: minPrice && `${strings.CONTENT_PAGE.FROM} ${minPrice}`,
      Icon: Ticket,
      url: `${convertUidToUrl({
        uid: ticketsUID,
        lang: getHeadoutLanguagecode(lang ?? LANGUAGE_MAP.en.locale),
      })}`,
    },
    NUMBER_OF_ENTRANCES: {
      value: entrances?.length > 1 ? entrances?.length : null,
      Icon: DoorEntrance,
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
      Icon: WaitTime,
    },
    EXPECTED_WAIT_TIME_SKIP_THE_LINE: {
      value:
        (skipTheLineTickets?.PEAK_SEASON ||
          skipTheLineTickets?.OFF_PEAK_SEASON) &&
        `${skipTheLineTickets?.PEAK_SEASON} (${strings.CONTENT_PAGE.PEAK}), ${skipTheLineTickets?.OFF_PEAK_SEASON} (${strings.CONTENT_PAGE.OFF_PEAK})`,
      Icon: WaitTimeFast,
    },
    UNESCO_YEAR: {
      value: unescoYear,
      Icon: UnescoStatus,
    },
    ARCHITECTURE_STYLE: {
      value: architecturalStyle,
      Icon: ArchitectureStyle,
    },
  };

  // filter out empty values
  return Object.fromEntries(
    Object.entries(mappings).filter((child) => child[1].value)
  );
};
