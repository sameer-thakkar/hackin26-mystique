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
import { HORIZONTAL_LINE } from 'assets/SvgIcons';

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
            {HORIZONTAL_LINE()}
          </BannerTrustBoosterBox>
        );
      })}
    </>
  );
};

export default F1BannerTrustBoosters;
