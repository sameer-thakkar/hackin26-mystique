import { useContext, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import Conditional from 'components/common/Conditional';
import { MBContext } from 'contexts/MBContext';
import { usePrivateAirportTransferAirports } from 'hooks/airportTransfers/useAirportsList';
import { trackEvent } from 'utils/analytics';
import { AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP } from 'const/airportTransfers';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import {
  CarSVG,
  SharedTransferTabIconSVG,
} from 'assets/airportTransfers/searchUnitSVGs';
import { TSelectedSearchTab } from './interface';
import { PrivateTransferSearch } from './PrivateTransferSearch';
import { SharedTransferSearch } from './SharedTransferSearch';
import { privateTransferAirportState } from './state';
import {
  InputsWrapper,
  SearchUnitContainer,
  Tab,
  TabHighlighter,
  TabsContainer,
  TabsRelativeWrapper,
} from './style';

export const SearchUnit = ({
  hasBothTransferTypes,
  selectedTab,
  setSelectedTab,
  isMobile,
}: {
  hasBothTransferTypes: boolean;
  selectedTab: TSelectedSearchTab;
  setSelectedTab: (tab: TSelectedSearchTab) => void;
  isMobile: boolean;
}) => {
  const { primaryCity, uid } = useContext(MBContext);

  const { data } = usePrivateAirportTransferAirports(
    primaryCity?.cityCode ?? ''
  );

  const setPrivateTransferFormAirport = useSetRecoilState(
    privateTransferAirportState
  );

  const isAirportMB = !!AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP[uid];

  useEffect(() => {
    if (!data?.length || !isAirportMB) return;

    const airportData = data.find((a) =>
      a.name
        .toLowerCase()
        .includes(
          AIRPORT_TRANSFER_SEARCH_ENABLED_UIDS_AIRPORT_MAP[uid].toLowerCase()
        )
    );

    setPrivateTransferFormAirport({
      tgid: airportData?.tourGroupId ?? null,
      name: airportData?.name ?? '',
    });
  }, [isAirportMB, setPrivateTransferFormAirport, uid, data]);

  const handleTabChange = (tab: TSelectedSearchTab) => {
    setSelectedTab(tab);
    trackEvent({
      eventName: ANALYTICS_EVENTS.AIRPORT_TRANSFERS.SEARCH_BAR_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.AIRPORT_TRANSFERS.TAB_NAME]:
        tab === 'SHARED_TAB' ? 'Shared' : 'Private',
      [ANALYTICS_PROPERTIES.RANKING]: tab === 'SHARED_TAB' ? 1 : 2,
    });
  };

  return (
    <>
      <SearchUnitContainer $hasTabsOnTop={hasBothTransferTypes}>
        <Conditional if={hasBothTransferTypes}>
          <TabsRelativeWrapper>
            <TabsContainer>
              <Tab
                $selected={selectedTab === 'SHARED_TAB'}
                onClick={() => handleTabChange('SHARED_TAB')}
                data-qa-marker="shared-tab"
              >
                <SharedTransferTabIconSVG className="bus-icon" />
                {strings.AIRPORT_TRANSFER.BUS_TRAIN}
              </Tab>

              <Tab
                $selected={selectedTab === 'PRIVATE_TAB'}
                onClick={() => handleTabChange('PRIVATE_TAB')}
                data-qa-marker="private-tab"
              >
                <CarSVG />
                {strings.AIRPORT_TRANSFER.PRIVATE_TAXI}
              </Tab>
            </TabsContainer>

            <TabHighlighter $selectedTab={selectedTab} />
          </TabsRelativeWrapper>
        </Conditional>

        <InputsWrapper
          $selectedTab={selectedTab}
          $hasTabsOnTop={hasBothTransferTypes}
        >
          {selectedTab === 'SHARED_TAB' ? (
            <SharedTransferSearch isMobile={isMobile} uid={uid} />
          ) : (
            <PrivateTransferSearch isMobile={isMobile} uid={uid} />
          )}
        </InputsWrapper>
      </SearchUnitContainer>
    </>
  );
};
