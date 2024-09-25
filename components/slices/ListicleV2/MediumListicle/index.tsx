import React from 'react';
import { useRecoilValue } from 'recoil';
import { isAirportTransferLandingPageAtom } from 'components/PrivateAirportTransfersLandingPage/state';
import { IListicleTypeProps } from 'components/slices/ListicleV2/interfaces';
import MediumListicleGrid from 'components/slices/ListicleV2/MediumListicle/MediumListicleGrid/index';
import { MediumListicleWrapper } from 'components/slices/ListicleV2/MediumListicle/styles';
import { trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { ANALYTICS_PROPERTIES } from 'const/index';

const MediumListicle = ({
  items,
  settings,
  listicleSectionTitle,
}: IListicleTypeProps) => {
  const isAirportTransferLandingPage = useRecoilValue(
    isAirportTransferLandingPageAtom
  );

  const handleScroll = throttle(() => {
    trackEvent({
      eventName: 'Carousel Scrolled',
      [ANALYTICS_PROPERTIES.SECTION]: 'How It Works',
    });
  }, 1000);

  return (
    <MediumListicleWrapper
      onScroll={isAirportTransferLandingPage ? handleScroll : undefined}
    >
      {items?.map((item: Experience, index: number) => {
        const {
          imageUrl,
          heading,
          categoryTags,
          richTextData,
          ctaText,
          ctaUrl,
          experienceType,
          experienceId,
          experienceName,
          imageAlt,
          practicalInfo,
        } = item || {};

        return (
          <React.Fragment key={index}>
            <MediumListicleGrid
              alt={imageAlt}
              settingsType={settings as string}
              imageUrl={imageUrl ? `https://${imageUrl}` : ''}
              index={index}
              heading={heading}
              categoryTags={categoryTags}
              richTextData={richTextData}
              ctaText={ctaText}
              ctaUrl={ctaUrl}
              experienceType={experienceType}
              experienceId={experienceId}
              experienceName={experienceName}
              listicleSectionTitle={listicleSectionTitle}
              practicalInfo={practicalInfo as PracticalInfo}
            />
          </React.Fragment>
        );
      })}
    </MediumListicleWrapper>
  );
};
export default MediumListicle;
