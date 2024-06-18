import { CITY_AIRPORT_STATION_TGID_MAP } from 'const/airportTransfers';
import { strings } from 'const/strings';
import { TTransferDirection } from '../interface';
import { TSharedAirportTransferSearchFormStep } from '../state';

export const getSharedTransferDrawerTitle = (
  step: TSharedAirportTransferSearchFormStep,
  localisedStrings: typeof strings
) => {
  if (step === null) return '';
  return {
    PICKUP: localisedStrings.AIRPORT_TRANSFER.SELECT_PICKUP,
    DROPOFF: localisedStrings.AIRPORT_TRANSFER.SELECT_DROPOFF,
    DATE: localisedStrings.AIRPORT_TRANSFER.SELECT_DATE,
  }[step];
};

export function getAirportsList(cityCode: string, station?: string): string[] {
  const airportStationTGIDsMapForCity =
    CITY_AIRPORT_STATION_TGID_MAP[
      cityCode as keyof typeof CITY_AIRPORT_STATION_TGID_MAP
    ];

  if (!airportStationTGIDsMapForCity) {
    return [];
  }

  if (station) {
    const stationFilteredAirports: string[] = [];
    for (const airport in airportStationTGIDsMapForCity) {
      if (airportStationTGIDsMapForCity[airport][station]) {
        stationFilteredAirports.push(airport);
      }
    }
    return stationFilteredAirports;
  }

  const airports: string[] = [];
  for (const airport in airportStationTGIDsMapForCity) {
    airports.push(airport);
  }

  return airports;
}

export function getStationsList(cityCode: string, airportName?: string) {
  const airportStationTGIDsMapForCity = CITY_AIRPORT_STATION_TGID_MAP[cityCode];

  if (!airportStationTGIDsMapForCity) {
    return [];
  }

  if (airportName) {
    return Object.entries(airportStationTGIDsMapForCity[airportName]).map(
      ([station, { stationType }]) => ({
        name: station,
        stationType,
      })
    );
  }

  const stations = [] as { name: string; stationType: string }[];

  for (const airport in airportStationTGIDsMapForCity) {
    for (const station in airportStationTGIDsMapForCity[airport]) {
      if (stations.find((s) => s.name === station)) {
        continue; // Skip if station already exists
      }
      stations.push({
        name: station,
        stationType:
          airportStationTGIDsMapForCity[airport][station].stationType,
      });
    }
  }

  return stations;
}

export const isCurrentStepComplete = (
  currentStep: TSharedAirportTransferSearchFormStep,
  direction: TTransferDirection,
  state: {
    selectedAirport: string | null;
    selectedStation: string | null;
    selectedDate: string | null;
  }
) => {
  if (currentStep === 'PICKUP') {
    return direction === 'FROM_AIRPORT'
      ? !!state.selectedAirport
      : !!state.selectedStation;
  }

  if (currentStep === 'DROPOFF') {
    return direction === 'FROM_AIRPORT'
      ? !!state.selectedStation
      : !!state.selectedAirport;
  }

  return !!state.selectedDate;
};

export function getAirportTGIDsMap(cityCode: string): Record<string, number[]> {
  const airportStationTGIDMap = CITY_AIRPORT_STATION_TGID_MAP[cityCode];
  const airportTgidMap: Record<string, number[]> = {};

  if (!airportStationTGIDMap) {
    return airportTgidMap;
  }

  for (const airportName in airportStationTGIDMap) {
    const stationTGIDMap = airportStationTGIDMap[airportName];
    airportTgidMap[airportName] = [];

    for (const station in stationTGIDMap) {
      airportTgidMap[airportName].push(...stationTGIDMap[station].tgids);
    }

    // Remove duplicates
    airportTgidMap[airportName] = Array.from(
      new Set(airportTgidMap[airportName])
    );
  }

  return airportTgidMap;
}

export const isPrivateTransferSearchFormComplete = (state: {
  airportData: {
    name: string;
    tgid: number | null;
  };
  locationData: {
    addressText: string;
    lat: number;
    long: number;
  };
  pickupDate: string;
  pickupTime: string;
  pax: number;
}) => {
  const { airportData, locationData, pickupDate, pickupTime, pax } = state;

  return Boolean(
    airportData?.name &&
      airportData?.tgid &&
      locationData?.addressText &&
      locationData?.lat &&
      locationData?.long &&
      pickupDate &&
      pickupTime &&
      pax
  );
};

export const getStationTypeString = (stationType: string) => {
  return {
    TRAIN_STATION: strings.AIRPORT_TRANSFER.TRAIN_STATION,
    BUS_STOP: strings.AIRPORT_TRANSFER.BUS_STOP,
  }[stationType];
};
