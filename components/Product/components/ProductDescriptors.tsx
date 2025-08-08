import { useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import Skeleton from 'react-loading-skeleton';
import { css } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { TProductDescriptors } from 'components/Product/interface';
import {
  BookNowPayLaterHoverCard,
  CancellationPolicyHoverCard,
  TourTags,
} from 'components/Product/styles';
import { getDuration } from 'utils/timeUtils';
import { descriptorIcons } from 'const/descriptorIcons';
import { DESCRIPTORS } from 'const/index';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import { strings } from 'const/strings';
import Globe from 'assets/globe';
import { TController } from './Popup/interface';
import { FlexibleCancellationInfo } from './FlexibleCancellationInfo';
import Popup from './Popup';

export const ProductDescriptors = ({
  descriptorArray,
  customDescriptors,
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
  flexibleCancellationHoverCallBack,
  showIcons = true,
  isMobile = false,
  showGuidedTourDescriptor = true,
  forceMobile = false,
  allowClick = false,
  children,
  showFlexiCancellationDescriptor,
}: TProductDescriptors) => {
  const [cancellationPolicyEventRecorded, setCancellationPolicyEventRecorded] =
    useState(false);

  const popupController = useRef<TController>();
  const bookNowPayLaterDescription =
    strings.BOOK_NOW_PAY_LATER_DESCRIPTOR_SUBTEXT;

  if (descriptorArray?.length && descriptorArray?.length > 4 && forceMobile) {
    descriptorArray = descriptorArray?.slice(0, 4);
  }

  const shouldShowFlexibleCancellationDescriptor =
    !descriptorArray?.includes(DESCRIPTORS.FREE_CANCELLATION) &&
    showFlexiCancellationDescriptor;

  if (isLoading)
    return (
      <TourTags
        horizontal={horizontal}
        pageType={pageType}
        $forceMobile={forceMobile}
      >
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
    <TourTags
      horizontal={horizontal}
      pageType={pageType}
      $forceMobile={forceMobile}
      $isClickable={allowClick}
      className="tour-tags"
    >
      <Conditional if={customDescriptors?.length}>
        {customDescriptors?.map((item, index: number) => {
          const DescriptorSVG = descriptorIcons[item.type];
          const descriptorContent = `${renderToString(
            <DescriptorSVG />
          )}<span>${item.text}</span>`;

          return (
            item && (
              <div
                key={`descriptor-${index}`}
                data-card-section={CARD_SECTION_MARKERS.DESCRIPTORS}
                className={'tour-tag custom-descriptor'}
                dangerouslySetInnerHTML={{
                  __html: descriptorContent,
                }}
                {...(allowClick && item?.onClick
                  ? { onClick: item?.onClick }
                  : {})}
              />
            )
          );
        })}
      </Conditional>

      {descriptorArray?.map((item: string, index: number) => {
        const DescriptorSVG = descriptorIcons[item] || null;
        if (item === DESCRIPTORS.DURATION && (isCombo || isGpMotorTicketsMb))
          return null;

        if (item === DESCRIPTORS.GUIDED_TOUR && !showGuidedTourDescriptor)
          return null;

        if (
          item === DESCRIPTORS.FLEXIBLE_CANCELLATION &&
          !shouldShowFlexibleCancellationDescriptor
        ) {
          return null;
        }

        const canShowCancellationPolicyHover =
          !isMobile &&
          cancellationPolicy &&
          item === DESCRIPTORS.FREE_CANCELLATION;

        const canShowBookNowPayLaterHover =
          !isMobile &&
          bookNowPayLaterDescription &&
          item === DESCRIPTORS.BOOK_NOW_PAY_LATER;

        const canShowFlexibleCancellationPolicyHover =
          !isMobile && item === DESCRIPTORS.FLEXIBLE_CANCELLATION;

        const onCancellationPolicyHover = () => {
          if (
            (!canShowCancellationPolicyHover &&
              !canShowFlexibleCancellationPolicyHover) ||
            cancellationPolicyEventRecorded
          )
            return;

          cancellationPolicyHoverCallBack?.();
          flexibleCancellationHoverCallBack?.();
          setCancellationPolicyEventRecorded(true);
        };

        const getClassName = (): string => {
          let classNames = 'tour-tag';
          if (
            canShowCancellationPolicyHover ||
            canShowFlexibleCancellationPolicyHover
          ) {
            classNames += ' free-cancellation';
          }
          if (canShowBookNowPayLaterHover) {
            classNames += ' book-now-pay-later';
          }

          return classNames;
        };

        return (
          item && (
            <div
              key={`descriptor-${index}`}
              data-card-section={CARD_SECTION_MARKERS.DESCRIPTORS}
              className={getClassName()}
              onMouseEnter={onCancellationPolicyHover}
            >
              {showIcons && DescriptorSVG && <DescriptorSVG />}
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

              <Conditional if={canShowBookNowPayLaterHover}>
                <BookNowPayLaterHoverCard>
                  {bookNowPayLaterDescription}
                </BookNowPayLaterHoverCard>
              </Conditional>

              <Conditional if={canShowFlexibleCancellationPolicyHover}>
                <CancellationPolicyHoverCard>
                  {strings.FLEXIBLE_CANCELLATION.TOOLTIP_TEXT}
                  <span
                    className={css({
                      border: 'none',
                      color: 'semantic.text.candy',
                      marginLeft: '0.125rem',
                    })}
                    role="button"
                    tabIndex={0}
                    onClick={() => popupController.current?.open()}
                  >
                    {strings.FLEXIBLE_CANCELLATION.KNOW_MORE}
                  </span>
                </CancellationPolicyHoverCard>
              </Conditional>

              <Popup
                controller={popupController}
                styles={{
                  content: {
                    maxWidth: '792px',
                    height: 'max-content',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  },
                }}
              >
                <FlexibleCancellationInfo
                  isMobile={false}
                  onClose={() => popupController.current?.close()}
                />
              </Popup>
            </div>
          )
        );
      })}

      {children}

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
