import React from 'react';
import { css } from '@headout/pixie/css';
import { useTrackElementView } from 'hooks/useTrackElementView';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { CitiesTile } from './CitiesTile';
import { CustomersTile } from './CustomersTile';
import { gridStyles, titleStyles } from './style';
import { TrustpilotTile } from './TrustPilotTile';
import { YearsOfServiceTile } from './YearsOfServiceTile';

export const TrustBoosterSection = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useTrackElementView({
    eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
    properties: {
      [ANALYTICS_PROPERTIES.SECTION]: 'Trust Numbers',
      [ANALYTICS_PROPERTIES.RANKING]: 4,
    },
  });

  return (
    <div className={gridStyles} ref={ref}>
      <h2 className={titleStyles}>
        {strings.PRIVATE_AT_LANDING_PAGE.EXCELLENCE_HEADING}
      </h2>
      <div
        className={css({
          gridArea: 'trustpilot',
        })}
      >
        <TrustpilotTile isMobile={isMobile} />
      </div>
      <div
        className={css({
          gridArea: 'cities',
        })}
      >
        <CitiesTile />
      </div>
      <div className={css({ gridArea: 'customers' })}>
        <CustomersTile />
      </div>
      <div className={css({ gridArea: 'drivers' })}>
        <YearsOfServiceTile />
      </div>
    </div>
  );
};
