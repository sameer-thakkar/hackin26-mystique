export const TIME_FORMAT_DISPLAY = 'h:mm A';

export const TIME_FORMAT = 'HH:mm:ss';

export const getFieldErrors = (strings: Record<string, any>) => ({
  PICKUP: strings.AIRPORT_TRANSFER.ADD_PICKUP_LOCATION,
  DROP_OFF: strings.AIRPORT_TRANSFER.ADD_DROPOFF_LOCATION,
  PICKUP_TIME: strings.AIRPORT_TRANSFER.SELECT_TIME,
  PICKUP_DATE: strings.AIRPORT_TRANSFER.SELECT_A_DATE,
  PAX: strings.AIRPORT_TRANSFER.ADD_GUESTS,
  DATE_TIME: strings.AIRPORT_TRANSFER.SELECT_PICKUP_DATE_AND_TIME,
});

export const ANALYTICS_STEP_FIELD_TEXT_MAP = {
  PICKUP: 'Pickup Location',
  DROPOFF: 'Dropoff Location',
  TIME: 'Pickup Time',
  DATE: 'Pickup Date',
  PAX: 'Passengers',
};
