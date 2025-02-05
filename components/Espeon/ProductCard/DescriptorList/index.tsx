import React, { useState } from 'react';
import { css, cx } from '@headout/pixie/css';
import Conditional from 'components/common/Conditional';
import { DEFAULT_LANGUAGE } from 'components/Espeon/constants/localisation';
import { COLLECTION_CARD_LONG_DESCRIPTORS } from 'components/Espeon/ProductCard/constants';
import Descriptor from 'components/Espeon/ProductCard/Descriptor';
import { EDescriptorCode } from 'components/Espeon/ProductCard/Descriptor/types';
import type { TDescriptorList } from 'components/Espeon/ProductCard/DescriptorList/types';
import LongDescriptor from 'components/Espeon/ProductCard/LongDescriptor';
import { populateStringTemplate } from 'components/Espeon/utils/string';
import {
  getDuration,
  getDurationInDays,
  getDurationInHours,
} from 'components/Espeon/utils/time';
import MoreDescriptors from './components/MoreDescriptors';
import {
  CANCELLABLE_MINUTES_LIMIT,
  SKIP_FLEXI_DESCRIPTOR_LIST,
} from './constants';
import {
  descriptorListStyles,
  descriptorsCardContainer,
  descriptorSpacer,
  extraDescriptorsCard,
} from './styles';

type TDescriptorLabels = {
  [key in EDescriptorCode]: string;
};

const DescriptorList = (props: TDescriptorList) => {
  const [showFreeCancellation, setShowFreeCancellation] = useState(false);
  const [showExtraDescriptors, setShowExtraDescriptors] = useState(false);

  const {
    tour,
    descriptorCodes,
    descriptorLabels,
    longDescriptorTexts,
    moreLabel,
    showIcon = true,
    variant,
    className,
    totalCount,
    minDuration,
    maxDuration,
    lang,
    onDescriptorsHover,
    isMobile,
    showSpacer,
  } = props;

  const { cancellationPolicy } = tour;

  const shortenDescriptorList =
    !isMobile &&
    lang !== DEFAULT_LANGUAGE &&
    descriptorCodes.includes(EDescriptorCode.DURATION);

  const displayLimit = isMobile ? 8 : shortenDescriptorList ? 2 : 3;
  const hasMoreDescriptors = totalCount - displayLimit > 0;

  const longDescriptors = descriptorCodes
    .filter((code: EDescriptorCode) =>
      COLLECTION_CARD_LONG_DESCRIPTORS.includes(code)
    )
    .map((code: EDescriptorCode) => {
      const label =
        tour.descriptors.find(
          ({ code: _code }: { code: EDescriptorCode }) => _code === code
        )?.name ?? descriptorLabels[code];
      let background;
      let subtext;

      if (
        code === EDescriptorCode.FREE_CANCELLATION &&
        cancellationPolicy?.cancellableUpTo
      ) {
        const { cancellableUpTo } = cancellationPolicy;
        const cancellationText =
          cancellableUpTo >= CANCELLABLE_MINUTES_LIMIT
            ? longDescriptorTexts['FREE_CANCELLATION_DAYS']
            : longDescriptorTexts['FREE_CANCELLATION_HOURS'];

        background = css({
          bgColor: 'semantic.surface.light.success.1',
        });

        subtext = populateStringTemplate(
          cancellationText,
          cancellableUpTo >= 4320
            ? getDurationInDays(cancellableUpTo).toString()
            : getDurationInHours(cancellableUpTo).toString()
        );
      }

      return {
        code,
        label,
        subtext,
        background,
      };
    });

  const descriptors = descriptorCodes
    .filter((code: EDescriptorCode) => code !== EDescriptorCode.GUIDED_TOUR)
    .slice(0, displayLimit);

  return (
    <>
      <div
        className={cx(descriptorListStyles(variant), className)}
        data-type={'short'}
      >
        {descriptors.map((code: EDescriptorCode, index: number) => {
          let descriptorName: string = descriptorLabels[code];
          let onMouseEnter;
          let onMouseLeave;

          if (code === EDescriptorCode.DURATION) {
            if (!minDuration || !maxDuration) {
              if (!SKIP_FLEXI_DESCRIPTOR_LIST.includes(tour.id)) {
                descriptorName = descriptorLabels['FLEXIBLE_DURATION_LABEL'];
              }
            } else {
              descriptorName = getDuration({
                minDuration,
                maxDuration: minDuration ?? maxDuration,
                lang,
              });
            }
          } else {
            descriptorName =
              tour.descriptors.find(
                ({ code: _code }: { code: EDescriptorCode }) => _code === code
              )?.name ?? descriptorLabels[code];
          }

          if (code === EDescriptorCode.FREE_CANCELLATION) {
            onMouseEnter = () => setShowFreeCancellation(true);
            onMouseLeave = () => setShowFreeCancellation(false);
          }

          const className =
            !isMobile && code === EDescriptorCode.FREE_CANCELLATION
              ? 'underlined'
              : '';

          return (
            <React.Fragment key={code}>
              <Descriptor
                label={descriptorName}
                code={code}
                showIcon={showIcon}
                className={className}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />

              {index < descriptors.length - 1 && showSpacer && (
                <span className={descriptorSpacer}></span>
              )}
            </React.Fragment>
          );
        })}

        <Conditional if={hasMoreDescriptors}>
          <MoreDescriptors
            moreLabel={`${totalCount - displayLimit} ${moreLabel}`}
            onMouseEnter={() => {
              onDescriptorsHover?.(descriptorCodes.length - displayLimit);
              setShowExtraDescriptors(true);
            }}
            onMouseLeave={() => setShowExtraDescriptors(false)}
          />
        </Conditional>
      </div>

      {/* This only shows for free cancellation at the moment, handle for more in the future */}
      <Conditional
        if={
          descriptorCodes.includes(EDescriptorCode.FREE_CANCELLATION) &&
          showFreeCancellation
        }
      >
        <div
          role="tooltip"
          className={descriptorsCardContainer}
          aria-hidden={!showFreeCancellation}
        >
          {longDescriptors.map(
            ({
              code,
              label,
              subtext,
              background,
            }: {
              code: EDescriptorCode;
              label: string;
              subtext: string;
              background: any;
            }) => (
              <LongDescriptor
                key={code}
                code={code}
                label={label}
                subtext={subtext}
                background={background}
              />
            )
          )}
        </div>
      </Conditional>

      <Conditional if={hasMoreDescriptors && showExtraDescriptors}>
        <div
          role="tooltip"
          className={cx(descriptorsCardContainer, css({ right: '-space.64' }))}
          aria-hidden={!showFreeCancellation}
        >
          <ul className={extraDescriptorsCard}>
            {descriptorCodes
              .slice(displayLimit, descriptorCodes.length)
              .map((code: EDescriptorCode) => {
                let label = descriptorLabels[code];

                if (code === EDescriptorCode.DURATION) {
                  if (!minDuration || !maxDuration) {
                    if (!SKIP_FLEXI_DESCRIPTOR_LIST.includes(tour.id)) {
                      label = descriptorLabels['FLEXIBLE_DURATION_LABEL'];
                    }
                  } else {
                    label = getDuration({
                      minDuration,
                      maxDuration: minDuration ?? maxDuration,
                      lang,
                    });
                  }
                } else {
                  label =
                    tour.descriptors.find(
                      ({ code: _code }: { code: EDescriptorCode }) =>
                        _code === code
                    )?.name ?? descriptorLabels[code];
                }

                return (
                  <li key={code}>
                    <Descriptor
                      variant="small"
                      label={label}
                      code={code}
                      showIcon={true}
                    />
                  </li>
                );
              })}
          </ul>
        </div>
      </Conditional>
    </>
  );
};

export default DescriptorList;
