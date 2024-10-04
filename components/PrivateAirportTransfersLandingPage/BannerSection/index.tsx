import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { usePrivateAirportTransferAirports } from 'hooks/airportTransfers/useAirportsList';
import { titleCase } from 'utils/stringUtils';
import { strings } from 'const/strings';
import { BANNER_IMG_URL } from '../constants';
import { PrivateTransferSearch } from '../SearchUnit/PrivateTransferSearch';
import { privateTransferAirportState } from '../SearchUnit/state';
import { InputsWrapper } from '../SearchUnit/style';
import {
  containerStyle,
  gradientStyles,
  gridContainerStyle,
  headingStyle,
  inputsWrapperStyle,
  leftColumnStyle,
  rightColumnStyle,
  subtextStyle,
} from './style';

export const BannerSection = ({
  cityCode,
  isMobile,
}: {
  cityCode: string;
  isMobile: boolean;
}) => {
  const { data: airportsList } = usePrivateAirportTransferAirports(
    cityCode ?? ''
  );

  const setSelectedAirport = useSetRecoilState(privateTransferAirportState);

  useEffect(() => {
    // If there is only one airport, set it as the selected airport
    if (airportsList?.length === 1) {
      setSelectedAirport({
        name: airportsList[0].name,
        tgid: airportsList[0].tourGroupId,
      });
    }
  }, [airportsList?.length, setSelectedAirport]);

  const cityName = titleCase(cityCode);

  return (
    <div className={containerStyle}>
      <div className={gridContainerStyle}>
        <div className={leftColumnStyle}>
          <h1 className={headingStyle}>
            {strings.formatString(
              strings.PRIVATE_AT_LANDING_PAGE.CITY_AIRPORT_TRANSFERS,
              cityName
            )}
          </h1>
          <p className={subtextStyle}>
            {strings.PRIVATE_AT_LANDING_PAGE.BANNER_SUBTEXT}
          </p>
        </div>

        <div className={rightColumnStyle}>
          <Gradient position="top" />

          <Conditional if={!isMobile}>
            <Gradient position="right" />
            <Gradient position="left" />
          </Conditional>

          <Image
            alt="city banner"
            url={BANNER_IMG_URL}
            aspectRatio={isMobile ? '375:222' : '760:382'}
            width={isMobile ? 375 : 760}
            height={isMobile ? 222 : 382}
            fetchPriority="high"
          />

          <Conditional if={isMobile}>
            <Gradient position="bottom" />
          </Conditional>
        </div>

        <InputsWrapper
          $selectedTab={'PRIVATE_TAB'}
          $hasTabsOnTop={false}
          className={inputsWrapperStyle}
        >
          <PrivateTransferSearch isMobile={isMobile} />
        </InputsWrapper>
      </div>
    </div>
  );
};

const Gradient = ({
  position,
}: {
  position: 'top' | 'left' | 'right' | 'bottom';
}) => {
  return (
    <div
      className={gradientStyles({
        position,
      })}
    />
  );
};
