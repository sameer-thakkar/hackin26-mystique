import React from 'react';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { StarBadgeSVG } from 'assets/airportTransfers/privateAirportTransfers';
import { TRUSTED_DRIVERS_IMAGE_BG_URL } from '../../constants';
import {
  backgroundImageStyle,
  containerStyle,
  contentContainerStyle,
  headingStyle,
  starBadgeStyle,
  textStyle,
} from './style';

export const YearsOfServiceTile = () => {
  return (
    <div className={containerStyle}>
      <Image
        url={TRUSTED_DRIVERS_IMAGE_BG_URL}
        alt="Trusted drivers"
        className={backgroundImageStyle}
      />

      <div className={contentContainerStyle}>
        <h4 className={headingStyle}>10</h4>

        <p className={textStyle}>
          {strings.PRIVATE_AT_LANDING_PAGE.YEARS_OF_SERVICE}
        </p>

        <StarBadgeSVG className={starBadgeStyle} />
      </div>
    </div>
  );
};
