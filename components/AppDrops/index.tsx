import React, { useEffect, useRef, useState } from 'react';
import { Button, Text } from '@headout/eevee';
import { cx } from '@headout/pixie/css';
import {
  DROPS_MOBILE_BANNER_LINK,
  DROPS_RIVE_URI,
} from 'components/AppDrops/constants';
import Conditional from 'components/common/Conditional';
import { useRive } from 'hooks/useRive';
import useWindowWidth from 'hooks/useWindowWidth';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FALSE,
  TRUE,
} from 'const/index';
import { strings } from 'const/strings';
import ChevronDown from 'assets/chevronDown';
import { DiscountTag } from './components/DiscountTag';
import DownloadAppNudge from './components/DownloadAppNudge';
import { Steps } from './components/Steps';
import {
  animatedNudgeContainer,
  bannerContainer,
  bannerContent,
  collapseButton,
  ctaButton,
  expandedContainer,
  expandedRightSection,
  leftSection,
  leftSectionAppNudge,
  mobileSection,
  nudgeHidden,
  nudgeVisible,
  rightSection,
  subtitle,
  title,
  titleAppNudge,
} from './styles';

export const DropsBanner = () => {
  const translations = strings.DROPS;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth !== undefined && windowWidth < 768;
  const nudgeRef = useRef<HTMLDivElement>(null);

  const { RiveComponent, isLoading, isError, rive } = useRive({
    src: DROPS_RIVE_URI,
    autoplay: true,
  });

  const hasTracked = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

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

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => {
        setShowNudge(true);
      }, 100);
    } else {
      setShowNudge(false);
    }
  }, [isExpanded]);

  const handleToggleExpand = () => {
    if (isExpanded) {
      setShowNudge(false);
      setTimeout(() => {
        setIsExpanded(false);
      }, 300);
    } else {
      setIsExpanded(true);
      trackEvent({
        eventName: ANALYTICS_EVENTS.DROPS_BANNER_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Tell Me More',
      });
    }
  };

  const handleOpenMobileBanner = () => {
    window.open(DROPS_MOBILE_BANNER_LINK, '_blank');
    trackEvent({
      eventName: ANALYTICS_EVENTS.DROPS_BANNER_CTA_CLICKED,
      [ANALYTICS_PROPERTIES.CTA_TYPE]: 'Download',
    });
  };

  return (
    <div className={cx(bannerContainer, isExpanded && expandedContainer)}>
      <div className={bannerContent}>
        <Conditional if={isMobile}>
          <div className={mobileSection}>
            <div className={leftSectionAppNudge}>
              <Text
                as="h3"
                className={titleAppNudge}
                textStyle={'tags.booster'}
                color={'core.candy.800'}
              >
                {translations.DOWNLOAD_APP_NUDGE.TITLE}
              </Text>
              <Steps variant={{ variant: 'default' }} />
            </div>
            <Button
              as={'button'}
              className={ctaButton}
              btnType="black"
              variant={'primary'}
              size="medium"
              primaryText={translations.CTA_BUTTON_MOBILE}
              onClick={handleOpenMobileBanner}
            />
          </div>
        </Conditional>
        <div className={leftSection}>
          <DiscountTag isMobile={isMobile} />
          <Text
            as="h1"
            className={title}
            textStyle={isMobile ? 'heading.regular' : 'display.xs'}
            color={'core.candy.800'}
          >
            {translations.TITLE}
          </Text>
          <Text
            as="p"
            className={subtitle}
            textStyle={isMobile ? 'ui.label.small' : 'para.medium'}
            color={'semantic.text.grey.2'}
          >
            {translations.SUBTITLE}
          </Text>
          <Conditional if={!isMobile}>
            <Conditional if={isExpanded}>
              <div
                ref={nudgeRef}
                className={cx(
                  animatedNudgeContainer,
                  showNudge ? nudgeVisible : nudgeHidden
                )}
              >
                <DownloadAppNudge />
              </div>
            </Conditional>
            <Conditional if={!isExpanded}>
              <Button
                as="button"
                className={ctaButton}
                btnType="black"
                variant="primary"
                size="small"
                primaryText={
                  isMobile
                    ? translations.CTA_BUTTON_MOBILE
                    : translations.CTA_BUTTON
                }
                onClick={handleToggleExpand}
              />
            </Conditional>
          </Conditional>
        </div>
        <div
          className={cx(
            rightSection,
            isExpanded && showNudge && !isMobile && expandedRightSection
          )}
        >
          <Conditional if={!isLoading && !isError}>
            <RiveComponent height="257px" width="573px" />
          </Conditional>
        </div>
      </div>
      <Conditional if={isExpanded && !isMobile}>
        <div
          role="button"
          tabIndex={0}
          className={collapseButton}
          onClick={handleToggleExpand}
        >
          <ChevronDown />
        </div>
      </Conditional>
    </div>
  );
};

export default DropsBanner;
