import {
  TLocalizedQuarters,
  TQuickInfo,
} from 'components/ShoulderPages/interface';
import { getHeadoutLanguagecode } from 'utils';
import { getRelatedContentPagesUrl } from 'utils/contentPageUtils';
import {
  formatOperatingDayTimings,
  getCurrentOperatingHours,
  localizeDay,
} from 'utils/dateUtils';
import { convertUidToUrl } from 'utils/urlUtils';
import {
  getLocalizedQuarters,
  LANGUAGE_MAP,
  MB_CATEGORISATION,
} from 'const/index';
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

const getQuartersForTable = ({
  startDate,
  endDate,
  localizedQuarters,
}: {
  startDate: string;
  endDate: string;
  localizedQuarters: TLocalizedQuarters;
}) => {
  const startMonth = new Date(startDate).getMonth() + 1;
  const endMonth = new Date(endDate).getMonth() + 1;

  const quartersForTable: string[] = localizedQuarters
    .filter((quarter: any) => {
      return startMonth <= quarter.end && endMonth >= quarter.start;
    })
    .map((quarter: any) => quarter.label);

  return quartersForTable;
};

export const getPoiTimingsInfo = (
  data: Record<string, any> = {},
  lang: string
) => {
  const { operatingSchedules } = data;
  const { quarters: localizedQuarters } = getLocalizedQuarters(lang);

  const currentOperatingHours = getCurrentOperatingHours(
    operatingSchedules,
    lang
  );

  const today = new Date()
    .toLocaleString('en-US', { weekday: 'long' })
    .toUpperCase();
  const timingTablesData = operatingSchedules?.map?.(
    (schedule: any, scheduleIndex: number) => {
      const startMonth = new Date(schedule.startDate).toLocaleString(lang, {
        day: 'numeric',
        month: 'short',
      });
      const endMonth = new Date(schedule.endDate).toLocaleString(lang, {
        day: 'numeric',
        month: 'short',
      });

      const quartersForTable = getQuartersForTable({
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        localizedQuarters,
      });

      return {
        columns: [
          {
            label: `${startMonth} ${strings.CONTENT_PAGE.TO} ${endMonth}`,
            key: 'day',
            quarters: quartersForTable,
          },
          { label: strings.CONTENT_PAGE.TIMINGS.toUpperCase(), key: 'timing' },
          { label: strings.CONTENT_PAGE.LAST_ADMISSION, key: 'lastAdmission' },
        ],
        rows: schedule.operatingDaySchedules
          ?.map?.((day: any) => {
            const isActive = day.dayOfWeek === today && scheduleIndex === 0;
            const formattedDay = formatOperatingDayTimings({ day, lang });
            return {
              isActive,
              day: localizeDay(day.dayOfWeek, lang),
              lastAdmission: day.closed ? '' : formattedDay.lastAdmission || '',
              timing: day.closed
                ? strings.CONTENT_PAGE.CLOSED
                : formattedDay.hours || '',
            };
          })
          .filter(Boolean),
      };
    }
  );
  return {
    today: currentOperatingHours.hours
      ? currentOperatingHours.hours == strings.CONTENT_PAGE.CLOSED_TODAY
        ? strings.CONTENT_PAGE.CLOSED
        : `${strings.CONTENT_PAGE.OPEN} ${currentOperatingHours.hours}`
      : null,
    lastAdmission: currentOperatingHours.lastAdmission,
    timingTablesData,
  };
};

export const getPoiQuickInfo = (
  data: Record<string, any> = {},
  relatedContentPages?: Record<string, any>[],
  lang?: string
): TQuickInfo => {
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
  const { SHOULDER_PAGE_TYPE } = MB_CATEGORISATION;

  const { entrances } = content?.data || {};

  const { standard: standardTickets, stl_tickets: skipTheLineTickets } =
    expectedWaitTime || {};

  const mappings = {
    ADDRESS: {
      value: location?.address,
      Icon: Address,
      url: getRelatedContentPagesUrl({
        relatedContentPages,
        type: SHOULDER_PAGE_TYPE.DIRECTIONS,
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
        type: SHOULDER_PAGE_TYPE.TIMINGS,
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
        type: SHOULDER_PAGE_TYPE.ENTRANCES,
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
  ) as TQuickInfo;
};
