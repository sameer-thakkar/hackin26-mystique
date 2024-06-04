import { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MBContext } from 'contexts/MBContext';
import { usePrivateAirportTransferAirports } from 'hooks/airportTransfers/useAirportsList';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { AirplaneFilledSVG } from 'assets/airportTransfers/searchUnitSVGs';
import { DrawerList, DrawerListItem } from '../BottomDrawer';
import {
  privateTransferAirportState,
  privateTransferDirectionState,
} from '../state';

export const PrivateTransferAirportsList = ({
  onValueChange,
}: {
  onValueChange: () => void;
}) => {
  const [selectedAirport, setSelectedAirport] = useRecoilState(
    privateTransferAirportState
  );

  const selectedDirection = useRecoilValue(privateTransferDirectionState);

  const { primaryCity } = useContext(MBContext);

  const { data: airportsList } = usePrivateAirportTransferAirports(
    primaryCity?.cityCode ?? ''
  );

  const handleAirportClick = (airport: { name: string; tgid: number }) => {
    setSelectedAirport(airport);
    onValueChange();

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_FILTER_APPLIED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_NAME]:
        selectedDirection === 'FROM_AIRPORT'
          ? 'Pickup Location'
          : 'Drop-off Location',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FILTER_VALUE]: airport.name,
    });
  };

  return (
    <DrawerList>
      {airportsList?.map((airport) => (
        <DrawerListItem
          key={airport.iataCode}
          icon={<AirplaneFilledSVG />}
          title={airport.name}
          isSelected={airport.name === selectedAirport.name}
          onClick={() =>
            handleAirportClick({
              name: airport.name,
              tgid: airport.tourGroupId,
            })
          }
        />
      ))}
    </DrawerList>
  );
};
