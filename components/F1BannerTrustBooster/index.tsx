import React from 'react';
import {
  BannerTrustBoosterBox,
  BannerTrustBoosterHeadingBox,
  BannerTrustBoosterTextBox,
} from 'components/F1BannerTrustBooster/styles';
import {
  F1TrustBoosterProp,
  F1TrustBoostersProp,
} from 'components/F1TrustBoosters/interface';
import HorizontalLine from 'assets/horizontalLine';

const F1BannerTrustBoosters = ({
  f1TrustBooster,
}: F1TrustBoosterProp): JSX.Element => {
  return (
    <>
      {f1TrustBooster.map((item: F1TrustBoostersProp) => {
        return (
          <BannerTrustBoosterBox key={item.boosterHeading}>
            <BannerTrustBoosterTextBox>
              {item.svgIcon}
              <BannerTrustBoosterHeadingBox>
                {item.boosterHeading}
              </BannerTrustBoosterHeadingBox>
            </BannerTrustBoosterTextBox>
            {HorizontalLine()}
          </BannerTrustBoosterBox>
        );
      })}
    </>
  );
};

export default F1BannerTrustBoosters;
