import React from 'react';
import { cx } from '@headout/pixie/css';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { BookmarkHeartSVG } from 'assets/airportTransfers/privateAirportTransfers';
import { CUSTOMERS_TILE_BG_URL } from '../../constants';
import {
  backgroundImageStyle,
  bookmarkHeartStyle,
  containerStyle,
  contentContainerStyle,
  customerImagesContainerStyle,
  customerImageStyle,
  numberStyle,
  overlappingImageStyle,
  textStyle,
} from './style';

export const CustomersTile = () => {
  return (
    <div className={containerStyle}>
      <div className={customerImagesContainerStyle}>
        <Image
          url="https://cdn-imgix.headout.com/media/images/32a6f08063a1ceab955360b916a036a1-Customers-Served-01-London--AT--LP.jpg"
          alt="Happy customers"
          className={customerImageStyle}
          width={95}
          height={95}
          aspectRatio="1:1"
        />
        <Image
          url="https://cdn-imgix.headout.com/media/images/738fd1ee0dc024cf314c08e06a0cdd28-Customers-Served-02-London--AT--LP.jpg"
          alt="Happy customers-1"
          className={cx(customerImageStyle, overlappingImageStyle)}
          width={95}
          height={95}
          aspectRatio="1:1"
        />
        <Image
          url="https://cdn-imgix.headout.com/media/images/fdb4e0fa4a5c1cd153f43bc077f12b69-Customers-Served-03-London--AT--LP.jpg"
          alt="Happy customers"
          className={cx(customerImageStyle, overlappingImageStyle)}
          width={95}
          height={95}
          aspectRatio="1:1"
        />
      </div>

      <Image
        url={CUSTOMERS_TILE_BG_URL}
        alt="Happy customers"
        className={backgroundImageStyle}
      />
      <BookmarkHeartSVG className={bookmarkHeartStyle} />
      <div className={contentContainerStyle}>
        <p className={numberStyle}>30M+</p>
        <p className={textStyle}>
          {strings.PRIVATE_AT_LANDING_PAGE.CUSTOMERS_SERVED}
        </p>
      </div>
    </div>
  );
};
