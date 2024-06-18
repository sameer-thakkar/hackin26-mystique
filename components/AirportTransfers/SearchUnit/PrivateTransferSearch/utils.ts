import dayjs from 'dayjs';
import { strings } from 'const/strings';
import { TIME_FORMAT } from '../constants';
import { TTransferDirection } from '../interface';
import { TPrivateAirportTransferSearchFormStep } from '../state';

export const getPaxFieldText = (
  pax: number,
  localisedStrings: typeof strings
) => {
  if (pax === 0) return '';

  return `${pax} ${
    pax > 1
      ? localisedStrings.AIRPORT_TRANSFER.GUESTS
      : localisedStrings.AIRPORT_TRANSFER.GUEST
  }`;
};

export const getPrivateTransferDrawerTitle = (
  currentStep: TPrivateAirportTransferSearchFormStep,
  localisedStrings: typeof strings
) => {
  if (currentStep === null) return null;

  return {
    PICKUP: localisedStrings.AIRPORT_TRANSFER.SELECT_PICKUP,
    DROPOFF: localisedStrings.AIRPORT_TRANSFER.SELECT_DROPOFF,
    DATE: localisedStrings.AIRPORT_TRANSFER.SELECT_DATE,
    TIME: localisedStrings.AIRPORT_TRANSFER.SELECT_TIME,
    PAX: localisedStrings.AIRPORT_TRANSFER.ADD_GUESTS,
  }[currentStep];
};

export const isCurrentStepComplete = (
  currentStep: TPrivateAirportTransferSearchFormStep,
  direction: TTransferDirection,
  form: {
    airport: string;
    location: {
      addressText: string;
      lat: number;
      long: number;
    };
    pickupDate: string;
    pickupTime: string;
    pax: number;
  }
) => {
  switch (currentStep) {
    case 'PICKUP':
      return direction === 'FROM_AIRPORT'
        ? form.airport !== ''
        : form.location.addressText !== '';
    case 'DROPOFF':
      return direction === 'TO_AIRPORT'
        ? form.airport !== ''
        : form.location.addressText !== '';
    case 'DATE':
      return form.pickupDate !== '';
    case 'TIME':
      return form.pickupTime !== '';
    case 'PAX':
      return form.pax > 0;
    default:
      return false;
  }
};
/*
 * This function returns a list of times for the given day.
 * If the day is not today, it returns a list of all the times in 15 minute increments.
 *  If the day is today, it returns a list of all the times from now until the end of the day, also in 15 minute increments.
 */
export const getDayTimes = (isToday: boolean) => {
  const times = [];

  if (isToday) {
    let nextTime = dayjs().add(15, 'minute');

    while (dayjs().isSame(nextTime, 'day')) {
      if (nextTime.minute() % 15 === 0) {
        times.push(nextTime.format(TIME_FORMAT));
      }
      nextTime = nextTime.add(1, 'minute');
    }
  } else {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const dt = dayjs().hour(h).minute(m).second(0);
        times.push(dt.format(TIME_FORMAT));
      }
    }
  }

  return times;
};
