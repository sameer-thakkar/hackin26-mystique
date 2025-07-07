import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Button, Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import {
  CITY_WISE_LABELS,
  DEFAULT_PRICE,
  DROPS_FALLBACK_LINK,
  DROPS_IMAGE_URLS,
  DROPS_MOBILE_BANNER_LINK,
  DROPS_RIVE_URI,
} from 'components/AppDrops/constants';
import Conditional from 'components/common/Conditional';
import Image from 'UI/Image';
import { useRive } from 'hooks/useRive';
import useWindowWidth from 'hooks/useWindowWidth';
import { trackEvent } from 'utils/analytics';
import { setRiveExperienceNames } from 'utils/dropsUtils';
import { pickByKeys } from 'utils/gen';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FALSE,
  TRUE,
} from 'const/index';
import { strings } from 'const/strings';
import { DiscountTag } from './components/DiscountTag';
import { DownloadAppNudge } from './components/DownloadAppNudge';
import {
  animatedNudgeContainer,
  bannerContainer,
  bannerContainerNoMargin,
  bannerContent,
  ctaButton,
  DWEB_LEFT_BOTTOM_SECTION_BG,
  DWEB_RIGHT_SECTION_BG,
  leftSection,
  mobileRiveContainer,
  nudgeVisible,
  rightSection,
  riveBlendingBG,
  subtitle,
  title,
} from './styles';
import { TDropsComponentProps } from './types';

export const DropsBanner = ({
  cityCode,
  isMarginNotRequired = false,
}: TDropsComponentProps) => {
  const translations = strings.DROPS;
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== undefined && windowWidth < 768;
  const nudgeRef = useRef<HTMLDivElement>(null);

  const { RiveComponent, isLoading, isError, rive } = useRive({
    src: DROPS_RIVE_URI,
    artboard: isMobile ? `mWeb_${cityCode}_Banner` : `dWeb_${cityCode}`,
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  const hasTracked = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  useLayoutEffect(() => {
    setRiveExperienceNames(
      rive,
      cityCode,
      pickByKeys(strings as Record<string, any>, ['DROPS']),
      isMobile
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityCode, rive]);

  useEffect(() => {
    if (!hasTracked.current) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.DROPS_BANNER_SHOWN,
        [ANALYTICS_PROPERTIES.BANNER_TYPE]: 'Banner',
        [ANALYTICS_PROPERTIES.QR_CODE_SHOWN]: !isMobile ? TRUE : FALSE,
        [ANALYTICS_PROPERTIES.DOWNLOAD_CTA_SHOWN]: isMobile ? TRUE : FALSE,
      });
      hasTracked.current = true;
    }
  }, [isMobile]);

  useEffect(() => {
    if (rive && typeof document !== 'undefined') {
      const observerCallback = (mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const exitModalExists =
              document.querySelectorAll(
                '.modal-open, [role="dialog"], [role="document"]'
              )?.length > 0;

            if (exitModalExists) {
              rive.pause();
            } else {
              rive.play();
            }
          }
        }
      };

      observerRef.current = new MutationObserver(observerCallback);

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [rive]);

  const handleOpenMobileBanner = () => {
    const link =
      DROPS_MOBILE_BANNER_LINK[
        cityCode as keyof typeof DROPS_MOBILE_BANNER_LINK
      ] ?? DROPS_FALLBACK_LINK;
    window.open(link, '_blank', 'noopener,noreferrer');
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPS_BANNER_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Download',
    });
  };

  return (
    <div
      className={cx(
        bannerContainer,
        isMarginNotRequired && bannerContainerNoMargin
      )}
    >
      <div className={bannerContent}>
        <Conditional if={isMobile}>
          <Button
            as={'button'}
            className={ctaButton}
            btnType="white"
            variant={'primary'}
            size="medium"
            primaryText={translations.CTA_BUTTON_MOBILE}
            onClick={handleOpenMobileBanner}
          />
        </Conditional>
        <div className={leftSection}>
          <DiscountTag />
          <Text
            as="h1"
            className={title}
            textStyle={isMobile ? 'heading.medium' : 'display.regular'}
            color={'core.candy.700'}
          >
            {strings.formatString(
              translations.TITLE,
              CITY_WISE_LABELS?.[cityCode as keyof typeof CITY_WISE_LABELS]
                ?.price ?? DEFAULT_PRICE
            )}
          </Text>
          <Text
            as="p"
            className={subtitle}
            textStyle={isMobile ? 'para.regular' : 'para.medium'}
            color={'semantic.text.grey.2'}
          >
            {strings.formatString(
              translations.SUBTITLE,
              CITY_WISE_LABELS?.[cityCode as keyof typeof CITY_WISE_LABELS]
                ?.city ?? ''
            )}
          </Text>
          <Conditional if={!isMobile}>
            <div
              ref={nudgeRef}
              className={cx(animatedNudgeContainer, nudgeVisible)}
            >
              <DownloadAppNudge cityCode={cityCode} />
            </div>
          </Conditional>
        </div>
        <Conditional if={!isLoading && !isError && !isMobile}>
          <div className={rightSection}>
            <RiveComponent height="366px" width="588px" />
          </div>
        </Conditional>
      </div>
      <Conditional if={!isMobile}>
        <Image
          url={DROPS_IMAGE_URLS.DWEB_RIGHT_SECTION_BG}
          alt="Drops Web Banner Section BG"
          width={604}
          height={366}
          className={DWEB_RIGHT_SECTION_BG}
        />
        <div className={DWEB_LEFT_BOTTOM_SECTION_BG} />
      </Conditional>
      <Conditional if={!isLoading && !isError && isMobile}>
        <div className={mobileRiveContainer}>
          <RiveComponent />
        </div>
        <div className={riveBlendingBG} />
      </Conditional>
    </div>
  );
};

export default DropsBanner;
