import { atom } from 'recoil';
import { TTransferDirection } from './interface';

export type TPrivateAirportTransferSearchFormStep =
  | 'PICKUP'
  | 'DROPOFF'
  | 'DATE'
  | 'TIME'
  | 'PAX'
  | null;

export const privateAirportTransferSearchFieldsOrder: TPrivateAirportTransferSearchFormStep[] =
  ['PICKUP', 'DROPOFF', 'DATE', 'TIME', 'PAX'];

export const privateTransfersSearchStepReducer = (
  state: {
    currentStep: TPrivateAirportTransferSearchFormStep;
  } = {
    currentStep: null,
  },
  action: {
    type: 'NEXT' | 'PREV' | 'RESET' | 'SET';
    payload?: TPrivateAirportTransferSearchFormStep;
  }
) => {
  const currentStepIndex = privateAirportTransferSearchFieldsOrder.indexOf(
    state.currentStep
  );
  switch (action.type) {
    case 'NEXT':
      const nextIndex = currentStepIndex + 1;
      return {
        currentStep:
          nextIndex >= privateAirportTransferSearchFieldsOrder.length
            ? null
            : privateAirportTransferSearchFieldsOrder[currentStepIndex + 1],
      };
    case 'PREV':
      const prevIndex = currentStepIndex - 1;
      return {
        currentStep:
          prevIndex < 0
            ? null
            : privateAirportTransferSearchFieldsOrder[currentStepIndex - 1],
      };
    case 'RESET':
      return { currentStep: null };
    case 'SET':
      return { currentStep: action.payload ?? null };
    default:
      return state;
  }
};

export const privateTransferAirportState = atom<{
  tgid: number | null;
  name: string;
}>({
  key: 'privateTransferAirport',
  default: {
    tgid: null,
    name: '',
  },
});

export const privateTransferLocationState = atom({
  key: 'privateTransferLocation',
  default: {
    addressText: '',
    lat: 0,
    long: 0,
  },
});

export const privateTransferDirectionState = atom<TTransferDirection>({
  key: 'privateTransferDirection',
  default: 'FROM_AIRPORT',
});

export const privateTransferDateState = atom<string | null>({
  key: 'privateTransferDate',
  default: null,
});

export const privateTransferTimeState = atom<string | null>({
  key: 'privateTransferTime',
  default: null,
});

export const privateTransferPaxState = atom<number>({
  key: 'privateTransferPax',
  default: 0,
});
