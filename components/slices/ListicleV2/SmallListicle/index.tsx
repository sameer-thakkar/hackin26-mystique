import React from 'react';
import { IListicleTypeProps } from 'components/slices/ListicleV2/interfaces';
import SmallListicleGrid from 'components/slices/ListicleV2/SmallListicle/SmallListicleGrid';
import { SmallListicleWrapper } from 'components/slices/ListicleV2/SmallListicle/styles';

const SmallListicle = ({
  items,
  listicleSectionTitle,
  index: parentIndex,
  enforceParentIndex,
}: IListicleTypeProps) => {
  return (
    <SmallListicleWrapper>
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
        } = item || {};

        return (
          <React.Fragment key={index}>
            <SmallListicleGrid
              alt={imageAlt}
              imageUrl={imageUrl ? `https://${imageUrl}` : ''}
              index={enforceParentIndex ? parentIndex : index}
              heading={heading}
              categoryTags={categoryTags[0] || ''}
              richTextData={richTextData}
              ctaText={ctaText}
              ctaUrl={ctaUrl}
              experienceType={experienceType}
              experienceId={experienceId}
              experienceName={experienceName}
              listicleSectionTitle={listicleSectionTitle}
            />
          </React.Fragment>
        );
      })}
    </SmallListicleWrapper>
  );
};
export default SmallListicle;
