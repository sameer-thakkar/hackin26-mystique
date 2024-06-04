import { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { LocationPinFilledSVG } from 'assets/airportTransfers/searchUnitSVGs';
import { DrawerList, DrawerListItem } from '../BottomDrawer';
import { ANALYTICS_STEP_FIELD_TEXT_MAP } from '../constants';
import {
  sharedTransferAirport,
  sharedTransferDirection,
  sharedTransferStation,
} from '../state';
import { STATION_TYPE_SVG_MAP_FILLED } from './iconsMap';
import { getStationsList, getStationTypeString } from './utils';

export const StationsList = ({
  onValueChange,
}: {
  onValueChange: () => void;
}) => {
  const [selectedStation, setSelectedStation] = useRecoilState(
    sharedTransferStation
  );

  const selectedAirport = useRecoilValue(sharedTransferAirport);

  const selectedDirection = useRecoilValue(sharedTransferDirection);

  const isFirstField = selectedDirection === 'TO_AIRPORT';

  const { primaryCity } = useContext(MBContext);

  useEffect(() => {
    if (isFirstField || !selectedStation.name) return;

    const isSelectedLocationInList = getStationsList(
      primaryCity?.cityCode ?? '',
      selectedAirport ?? undefined
    ).some((station) => station.name === selectedStation.name);

    if (!isSelectedLocationInList) {
      setSelectedStation({
        name: '',
        stationType: '',
      });
    }
  }, [
    isFirstField,
    primaryCity?.cityCode,
    selectedAirport,
    selectedStation.name,
    setSelectedStation,
  ]);

  const shouldAccountForSelectedAirport =
    !selectedStation.name || !isFirstField;

  const stationsList = getStationsList(
    primaryCity?.cityCode ?? '',
    shouldAccountForSelectedAirport ? selectedAirport ?? undefined : undefined
  );

  const handleStationClick = (station: {
    name: string;
    stationType: string;
  }) => {
    setSelectedStation(station);
    onValueChange();

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,

      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]:
        selectedDirection === 'TO_AIRPORT'
          ? ANALYTICS_STEP_FIELD_TEXT_MAP.PICKUP
          : ANALYTICS_STEP_FIELD_TEXT_MAP.DROPOFF,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: station.name,
    });
  };

  return (
    <DrawerList>
      {stationsList.map((station) => (
        <DrawerListItem
          key={station.name}
          icon={
            station.name ? (
              STATION_TYPE_SVG_MAP_FILLED[
                station.stationType as keyof typeof STATION_TYPE_SVG_MAP_FILLED
              ]
            ) : (
              <LocationPinFilledSVG />
            )
          }
          title={station.name}
          subtext={getStationTypeString(station.stationType)}
          isSelected={station.name === selectedStation.name}
          onClick={() =>
            handleStationClick({
              name: station.name,
              stationType: station.stationType,
            })
          }
        />
      ))}
    </DrawerList>
  );
};
