import { useContext } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { css } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { ButtonLoader } from 'components/common/LocalePopover/ButtonLoader';
import { MBContext } from 'contexts/MBContext';
import { usePrivateAirportTransferAirports } from 'hooks/airportTransfers/useAirportsList';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { AirplaneOutlineSVG } from 'assets/airportTransfers/searchUnitSVGs';
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

  const { data: airportsList, isLoading } = usePrivateAirportTransferAirports(
    primaryCity?.cityCode ?? ''
  );

  const handleAirportClick = (airport: { name: string; tgid: number }) => {
    setSelectedAirport(airport);
    onValueChange();

    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.FIELD_ADDED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_NAME]:
        selectedDirection === 'FROM_AIRPORT'
          ? 'Pickup Location'
          : 'Drop-off Location',
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.FIELD_VALUE]: airport.name,
    });
  };

  return (
    <DrawerList>
      <Conditional if={isLoading}>
        <ButtonLoader
          className={css({
            width: '100%!',
            boxSizing: 'border-box',

            '& .dot': {
              height: '0.375rem!',
              width: '0.375rem!',
            },
          })}
        />
      </Conditional>

      {airportsList?.map((airport) => (
        <DrawerListItem
          key={airport.iataCode}
          icon={<AirplaneOutlineSVG />}
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
