import React from 'react';
import { IListicleTypeProps } from 'components/slices/ListicleV2/interfaces';
import LargeListicleGrid from 'components/slices/ListicleV2/LargeListicle/LargeListicleGrid';
import { LargeListicleWrapper } from 'components/slices/ListicleV2/LargeListicle/styles';

const LargeListicle = ({
  items,
  listicleSectionTitle,
  enforceParentIndex,
  index: parentIndex,
}: IListicleTypeProps) => {
  return (
    <LargeListicleWrapper>
      {items?.map((item: Experience, index) => {
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
          tabData,
        } = item || {};

        return (
          <React.Fragment key={item?.heading}>
            <LargeListicleGrid
              alt={imageAlt}
              imageUrl={imageUrl ? `https://${imageUrl}` : ''}
              index={enforceParentIndex ? parentIndex : index}
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
              tabData={tabData as Array<LargeListicleTabData>}
            />
          </React.Fragment>
        );
      })}
    </LargeListicleWrapper>
  );
};
export default LargeListicle;
