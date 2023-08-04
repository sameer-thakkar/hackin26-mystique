import React from 'react';
import { IListicleTypeProps } from 'components/slices/ListicleV2/interfaces';
import MediumListicleGrid from 'components/slices/ListicleV2/MediumListicle/MediumListicleGrid/index';
import { MediumListicleWrapper } from 'components/slices/ListicleV2/MediumListicle/styles';

const MediumListicle = ({
  items,
  settings,
  listicleSectionTitle,
}: IListicleTypeProps) => {
  return (
    <MediumListicleWrapper>
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
