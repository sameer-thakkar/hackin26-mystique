import { strings } from 'const/strings';

export const getTravelModes = (
  localisedStrings: typeof strings,
  hasPrivateTransfers: boolean
) => {
  const TRAVEL_MODES_ALL = [
    localisedStrings.AIRPORT_TRANSFER.BUSES,
    localisedStrings.AIRPORT_TRANSFER.TRAINS,
    localisedStrings.AIRPORT_TRANSFER.PRIVATE_TAXIS,
  ];
  const TRAVEL_MODES_ONLY_SHARED = [
    localisedStrings.AIRPORT_TRANSFER.BUSES,
    localisedStrings.AIRPORT_TRANSFER.TRAINS,
  ];

  return hasPrivateTransfers ? TRAVEL_MODES_ALL : TRAVEL_MODES_ONLY_SHARED;
};
