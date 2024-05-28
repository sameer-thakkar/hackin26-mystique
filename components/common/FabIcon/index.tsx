import { scroller } from 'react-scroll';
import { FabWrapper } from 'components/common/FabIcon/styles';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CALENDAR_UNIT,
} from 'const/index';
import { strings } from 'const/strings';
import CalendarFab from 'assets/calendarFab';

const FabIcon = ({ displayMonth }: { displayMonth: string }) => {
  const { VIEW_CALENDAR } = strings;
  const handleFabIconClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.FAB_ICON_CLICKED,
      [ANALYTICS_PROPERTIES.ICON_TYPE]: 'Calendar',
      [ANALYTICS_PROPERTIES.MONTH_PAGE]: displayMonth,
    });
    scroller.scrollTo(CALENDAR_UNIT, {
      duration: 700,
      offset: -150,
      smooth: 'easeInOutQuart',
    });
  };

  return (
    <FabWrapper onClick={handleFabIconClick}>
      <CalendarFab />
      <p>{VIEW_CALENDAR}</p>
    </FabWrapper>
  );
};
export default FabIcon;
