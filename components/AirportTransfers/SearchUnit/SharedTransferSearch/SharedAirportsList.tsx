import { useContext, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { trackEvent } from 'utils/analytics';
import { AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP } from 'const/airportTransfers';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { AirplaneFilledSVG } from 'assets/airportTransfers/searchUnitSVGs';
import { DrawerList, DrawerListItem } from '../BottomDrawer';
import {
  sharedTransferAirport,
  sharedTransferDirection,
  sharedTransferStation,
} from '../state';
import { getAirportsList } from './utils';

export const SharedTransferAirportsList = ({
  onValueChange,
}: {
  onValueChange: () => void;
}) => {
  const [selectedAirport, setSelectedAirport] = useRecoilState(
    sharedTransferAirport
  );
  const selectedLocation = useRecoilValue(sharedTransferStation);

  const selectedDirection = useRecoilValue(sharedTransferDirection);

  const isFirstField = selectedDirection === 'FROM_AIRPORT';

  const { primaryCity, uid } = useContext(MBContext);

  useEffect(() => {
    if (isFirstField || !selectedAirport) return;

    const isSelectedAirportInList = getAirportsList(
      primaryCity?.cityCode ?? '',
      selectedLocation.name
    ).includes(selectedAirport);

    if (!isSelectedAirportInList) {
      setSelectedAirport(null);
    }
  }, [
    isFirstField,
    primaryCity?.cityCode,
    selectedLocation.name,
    selectedAirport,
    setSelectedAirport,
  ]);

  const shouldAccountForSelectedStation = !selectedAirport || !isFirstField;

  const isAirportMB = AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP[uid];

  const airportsList = isAirportMB
    ? null
    : getAirportsList(
        primaryCity?.cityCode ?? '',
        shouldAccountForSelectedStation ? selectedLocation.name : undefined
      );

  const handleAirportClick = (airport: string) => {
    setSelectedAirport(airport);
    onValueChange();

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]:
        selectedDirection === 'FROM_AIRPORT'
          ? 'Pickup Location'
          : 'Drop-off Location',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: airport,
    });
  };

  if (!airportsList) return null;

  return (
    <DrawerList>
      {airportsList.map((airport) => (
        <DrawerListItem
          key={airport}
          icon={<AirplaneFilledSVG />}
          title={airport}
          isSelected={airport === selectedAirport}
          onClick={() => handleAirportClick(airport)}
        />
      ))}
    </DrawerList>
  );
};
