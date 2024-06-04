import { ReactNode, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { asText } from '@prismicio/helpers';
import { TScorpioData } from 'components/AirportTransfers/interface';
import Conditional from 'components/common/Conditional';
import { getObject } from 'components/HOHO/utils';
import { CancellationPolicyHoverCard } from 'components/Product/styles';
import { getProductCommonProperties, trackEvent } from 'utils/analytics';
import {
  extractCancellationPolicyFromHighlights,
  filterFromHighlights,
} from 'utils/productUtils';
import { metaAtom } from 'store/atoms/meta';
import {
  AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTOR_H6,
  AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS,
} from 'const/airportTransfers';
import { descriptorIcons } from 'const/descriptorIcons';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  DESCRIPTORS,
} from 'const/index';
import { strings } from 'const/strings';
import {
  ChevronNewSVG,
  HourGlassClockSVG,
  WaitingTimeClockSVG,
} from 'assets/airportTransfers/productCardSVGs';
import { ClockSVG } from 'assets/airportTransfers/searchUnitSVGs';
import {
  CircularSepartor,
  DescriptorsContainer,
  MoreDetailsButton,
  StyledContainer,
} from './style';

const MAX_COMBO_DESCRIPTORS = 3;

const DESCRIPTORS_SVG_MAP = {
  [AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS.OPERATING_HOURS]: <ClockSVG />,
  [AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS.FREQUENCY]: <HourGlassClockSVG />,
  [AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTORS.TRAVEL_TIME]: (
    <WaitingTimeClockSVG />
  ),
};

export const Descriptors = ({
  scorpioData,
  tourDescriptionOverride,
  onMoreDetailsClick,
  tgid,
  isMobile,
  lang,
  isScratchPriceEnabled,
  position,
}: {
  scorpioData: TScorpioData;
  tourDescriptionOverride: any[];
  onMoreDetailsClick: () => void;
  tgid: number;
  isMobile: boolean;
  lang: string;
  isScratchPriceEnabled: boolean;
  position: number;
}) => {
  const { combo: isCombo } = scorpioData;

  const finalHighlights = asText(
    (scorpioData.highlights || tourDescriptionOverride) as any
  )?.trim()?.length
    ? scorpioData.highlights || tourDescriptionOverride
    : filterFromHighlights(scorpioData.highlights);

  const { detailsObjects } = getObject(
    finalHighlights,
    AIRPORT_TRANSFER_MB_HIGHLIGHTS_DESCRIPTOR_H6
  );

  const [cancellationPolicyEventRecorded, setCancellationPolicyEventRecorded] =
    useState(false);

  const cancellationPolicy = useMemo(
    () => extractCancellationPolicyFromHighlights(finalHighlights as any),
    [finalHighlights]
  );

  const pageMetaData = useRecoilValue(metaAtom);

  const canShowCancellationPolicyHover = !!cancellationPolicy && !isMobile;

  const onCancellationPolicyHover = () => {
    if (!canShowCancellationPolicyHover || cancellationPolicyEventRecorded)
      return;

    const {
      listingPrice,
      primaryCategory,
      primaryCollection,
      primarySubCategory,
    } = scorpioData;
    const { finalPrice, originalPrice, currencyCode } = listingPrice ?? {};

    trackEvent({
      eventName: ANALYTICS_EVENTS.FREE_CANCELLATION_TOOLTIP_VIEWED,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
      [ANALYTICS_PROPERTIES.DISCOUNT]:
        isScratchPriceEnabled && originalPrice > finalPrice,
      [ANALYTICS_PROPERTIES.DISPLAY_CURRENCY]: currencyCode,
      [ANALYTICS_PROPERTIES.POSITION]: position,
      [ANALYTICS_PROPERTIES.DISPLAY_PRICE]: finalPrice,
      [ANALYTICS_PROPERTIES.EXPERIENCE_DATE]: null,
      [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: scorpioData.title,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.CITY]: (pageMetaData?.city as any)?.cityCode,
      ...getProductCommonProperties({
        primaryCategory,
        primaryCollection,
        primarySubCategory,
      }),
    });

    setCancellationPolicyEventRecorded(true);
  };

  return (
    <StyledContainer>
      {isCombo ? (
        <DescriptorsContainer>
          {scorpioData.descriptors
            .filter((d) => d !== DESCRIPTORS.DURATION)
            .slice(0, MAX_COMBO_DESCRIPTORS)
            .map((descriptor) => {
              const Icon = descriptorIcons[descriptor];
              return (
                <Descriptor
                  className={`${
                    cancellationPolicy &&
                    descriptor === DESCRIPTORS.FREE_CANCELLATION
                      ? 'free-cancellation'
                      : ''
                  }`}
                  key={descriptor}
                  icon={<Icon />}
                  text={
                    (strings.DESCRIPTORS as Record<string, string>)[descriptor]
                  }
                  onMouseEnter={
                    descriptor === DESCRIPTORS.FREE_CANCELLATION
                      ? onCancellationPolicyHover
                      : undefined
                  }
                >
                  <Conditional if={true}>
                    <CancellationPolicyHoverCard>
                      {cancellationPolicy}
                    </CancellationPolicyHoverCard>
                  </Conditional>
                </Descriptor>
              );
            })}

          <MoreDetailsButton onClick={onMoreDetailsClick}>
            {strings.MORE_DETAILS}
            <ChevronNewSVG />
          </MoreDetailsButton>
        </DescriptorsContainer>
      ) : (
        <DescriptorsContainer>
          {Object.entries(detailsObjects)?.map(([key, value]) => (
            <Descriptor
              key={key}
              icon={
                DESCRIPTORS_SVG_MAP[key as keyof typeof DESCRIPTORS_SVG_MAP]
              }
              text={value}
            />
          ))}

          <MoreDetailsButton onClick={onMoreDetailsClick}>
            {strings.MORE_DETAILS}
            <ChevronNewSVG />
          </MoreDetailsButton>
        </DescriptorsContainer>
      )}
    </StyledContainer>
  );
};

export function Descriptor({
  icon,
  text,
  children,
  className,
  onMouseEnter,
}: {
  icon: ReactNode;
  text: string;
  children?: ReactNode;
  className?: string;
  onMouseEnter?: () => void;
}) {
  return (
    <>
      <div className={`descriptor ${className}`} onMouseEnter={onMouseEnter}>
        {icon}
        <span className="descriptor-text">{text}</span>
        {children}
      </div>

      <CircularSepartor className="circular-separator" />
    </>
  );
}
