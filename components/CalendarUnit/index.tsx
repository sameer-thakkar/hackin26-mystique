import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { TCalendarUnitProps } from 'components/CalendarUnit/interface';
import {
  Calendar,
  CalendarGrid,
  CalendarUnitWrapper,
  Heading,
} from 'components/CalendarUnit/styles';
import Conditional from 'components/common/Conditional';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { getOrderedMonthsBasedOnCurrentMonth } from 'utils/dateUtils';
import { sendLog } from 'utils/logger';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CALENDAR_UNIT,
  MONTH_ON_MONTH_PAGE_SECTIONS,
  TLANGUAGELOCALE,
} from 'const/index';
import { strings } from 'const/strings';
import HoveredMonth from 'assets/hoveredMonth';
import MobileHoveredMonth from 'assets/mobileHoveredMonth';
import Month from 'assets/month';

const CalendarUnit: React.FC<React.PropsWithChildren<TCalendarUnitProps>> = ({
  pageTabsSlice,
  displayMonth,
  isMobile,
}) => {
  const { uid, language } = useRecoilValue(appAtom);
  const calendarUnitRef = useRef(null);
  const isIntersecting = useOnScreen({
    ref: calendarUnitRef,
    unobserve: false,
  });
  const [activeHoveredIndex, setActiveHoveredIndex] = useState(-1);
  const orderedMonths = useMemo(
    () => getOrderedMonthsBasedOnCurrentMonth(language as TLANGUAGELOCALE),
    [language]
  );

  const { SHOWS_CALENDAR } = strings;

  const { items } = pageTabsSlice;
  const sliceDataMap = new Map();
  items.forEach((item: Record<string, any>) => {
    sliceDataMap.set(item.month_label, {
      title: item.title,
      redirect_url: item.tab_link?.url,
    });
  });

  const handleMonthClick = (longFormatMonth: any) => {
    if (longFormatMonth === displayMonth) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.MONTH_ICON_CLICKED,
      [ANALYTICS_PROPERTIES.MONTH_ICON]: longFormatMonth,
      [ANALYTICS_PROPERTIES.MONTH_PAGE]: displayMonth,
    });
  };

  const handleMouseEnter = (index: number) => {
    if (!isMobile) {
      setActiveHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveHoveredIndex(-1);
    }
  };
  useEffect(() => {
    if (isIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]:
          MONTH_ON_MONTH_PAGE_SECTIONS.CALENDARY_MONTH,
      });
    }
  }, [isIntersecting]);

  const getHref = (longFormatMonth: string): string => {
    if (longFormatMonth === displayMonth) {
      return '#';
    } else return sliceDataMap.get(longFormatMonth)?.redirect_url;
  };

  return (
    <CalendarUnitWrapper id={CALENDAR_UNIT} ref={calendarUnitRef}>
      <Heading>{SHOWS_CALENDAR}</Heading>
      <CalendarGrid>
        {orderedMonths.map(
          ({ short_format_month, long_format_month, year }, index) => {
            const monthDetails = sliceDataMap.get(long_format_month);

            if (!monthDetails) {
              sendLog({
                message: `[CalendarUnit]: Month ${long_format_month} not found in slice data map, UID: ${uid}`,
              });
              return null;
            }

            const month = monthDetails.title.toUpperCase();
            const hrefAttribute =
              long_format_month !== displayMonth
                ? { href: getHref(long_format_month) }
                : {};

            return (
              <a
                {...hrefAttribute}
                key={short_format_month}
                onClick={() => handleMonthClick(long_format_month)}
                role="button"
                tabIndex={0}
              >
                <Calendar
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave()}
                >
                  <Conditional if={activeHoveredIndex !== index}>
                    <Conditional if={isMobile}>
                      <MobileHoveredMonth month={month} year={year} />
                    </Conditional>
                    <Conditional if={!isMobile}>
                      <Month month={month} year={year} />
                    </Conditional>
                  </Conditional>
                  <Conditional if={!isMobile}>
                    <Conditional if={activeHoveredIndex === index}>
                      <HoveredMonth month={month} year={year} />
                    </Conditional>
                  </Conditional>
                </Calendar>
              </a>
            );
          }
        )}
      </CalendarGrid>
    </CalendarUnitWrapper>
  );
};

export default CalendarUnit;
