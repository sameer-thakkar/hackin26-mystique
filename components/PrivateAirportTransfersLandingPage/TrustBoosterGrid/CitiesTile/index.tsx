import React from 'react';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { WORLDMAP_CITIES_IMAGE_URL } from '../../constants';
import {
  containerStyle,
  contentWrapperStyle,
  headingStyle,
  imageStyle,
  paragraphStyle,
} from './style';

export const CitiesTile = () => {
  return (
    <div className={containerStyle}>
      <Image
        url={WORLDMAP_CITIES_IMAGE_URL}
        alt="Headout Cities"
        className={imageStyle}
      />
      <div className={contentWrapperStyle}>
        <h4 className={headingStyle}>100+</h4>
        <p className={paragraphStyle}>
          {strings.PRIVATE_AT_LANDING_PAGE.ACTIVE_CITIES}
        </p>
      </div>
    </div>
  );
};
