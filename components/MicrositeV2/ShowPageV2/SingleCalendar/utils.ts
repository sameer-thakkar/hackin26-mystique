import { trackEvent } from 'utils/analytics';

export const formatTimeSuffix = (dateTimeString?: string | null) => {
  if (!dateTimeString) return dateTimeString;
  return dateTimeString
    .replace(' AM', 'am')
    .replace(' PM', 'pm')
    .replace(' am', 'am')
    .replace(' pm', 'pm');
};

export const sendNextClickedEvent = (direction: -1 | 1) => {
  trackEvent({
    eventName: 'Calendar Next Button Clicked',
    Direction: direction === 1 ? 'Next' : 'Previous',
  });
};
