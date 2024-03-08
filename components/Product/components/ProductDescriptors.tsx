import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Conditional from 'components/common/Conditional';
import { TProductDescriptors } from 'components/Product/interface';
import {
  CancellationPolicyHoverCard,
  TourTags,
} from 'components/Product/styles';
import { getDuration } from 'utils/timeUtils';
import { descriptorIcons } from 'const/descriptorIcons';
import { DESCRIPTORS } from 'const/index';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import { strings } from 'const/strings';
import Globe from 'assets/globe';

export const ProductDescriptors = ({
  descriptorArray,
  minDuration,
  maxDuration,
  lang = 'en',
  isGpMotorTicketsMb = false,
  isCombo = false,
  horizontal = false,
  isLoading = false,
  pageType = '',
  showLanguages,
  cancellationPolicy,
  cancellationPolicyHoverCallBack,
  showIcons = true,
  isMobile = false,
  showGuidedTourDescriptor = true,
}: TProductDescriptors) => {
  const [cancellationPolicyEventRecorded, setCancellationPolicyEventRecorded] =
    useState(false);

  if (isLoading)
    return (
      <TourTags horizontal={horizontal} pageType={pageType}>
        {Array.apply(null, Array(4)).map((_item: any, index: number) => {
          return (
            <div key={`descriptor-${index}`} className="tour-tag">
              <Skeleton width="1rem" height="1rem" borderRadius="2px" />
              <Skeleton height="1rem" width="8rem" borderRadius="2px" />
            </div>
          );
        })}
      </TourTags>
    );

  return (
    <TourTags horizontal={horizontal} pageType={pageType}>
      {descriptorArray.map((item: string, index: number) => {
        const DescriptorSVG = descriptorIcons[item];
        if (item === DESCRIPTORS.DURATION && (isCombo || isGpMotorTicketsMb))
          return null;

        if (item === DESCRIPTORS.GUIDED_TOUR && !showGuidedTourDescriptor)
          return null;

        const canShowCancellationPolicyHover =
          !horizontal &&
          !isMobile &&
          cancellationPolicy &&
          item === DESCRIPTORS.FREE_CANCELLATION;

        const onCancellationPolicyHover = () => {
          if (
            !canShowCancellationPolicyHover ||
            cancellationPolicyEventRecorded
          )
            return;
          cancellationPolicyHoverCallBack?.();
          setCancellationPolicyEventRecorded(true);
        };

        return (
          item && (
            <div
              key={`descriptor-${index}`}
              data-card-section={CARD_SECTION_MARKERS.DESCRIPTORS}
              className={`tour-tag ${
                canShowCancellationPolicyHover ? 'free-cancellation' : ''
              }`}
              onMouseEnter={onCancellationPolicyHover}
            >
              {showIcons && <DescriptorSVG />}
              <Conditional if={item === DESCRIPTORS.DURATION}>
                {getDuration({ minDuration, maxDuration, lang })}
              </Conditional>
              <Conditional if={item !== DESCRIPTORS.DURATION}>
                {(strings.DESCRIPTORS as Record<string, string>)[item]}
              </Conditional>
              <Conditional if={canShowCancellationPolicyHover}>
                <CancellationPolicyHoverCard>
                  {cancellationPolicy}
                </CancellationPolicyHoverCard>
              </Conditional>
            </div>
          )
        );
      })}
      <Conditional if={showLanguages}>
        <div key="descriptor-language" className="tour-tag language-descriptor">
          {Globe}
          <Conditional if={horizontal}>
            {/*
            TODO: add language labels from scorpio or prismic
            {showLanguages &&
              GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT[
                uid ?? ''
              ]?.languageLabels
                .map((label) => strings.LANGUAGES[label])
                .join(', ')} */}
          </Conditional>
          <Conditional if={!horizontal}>
            {/*
            TODO: add language labels from scorpio or prismic
            {showLanguages &&
              characterLimitStrings(
                GUIDED_TOUR_PRODUCT_CARD_REVAMP_EXPERIMENT[
                  uid ?? ''
                ]?.languageLabels
                  .map((label) => strings.LANGUAGES[label])
                  .join(', '),
                26
              )} */}
          </Conditional>
        </div>
      </Conditional>
    </TourTags>
  );
};
