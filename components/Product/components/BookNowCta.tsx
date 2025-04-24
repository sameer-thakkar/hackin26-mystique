import { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@headout/aer/src/atoms/Button';
import { TBookNowCTAProps } from 'components/Product/interface';
import { ButtonContainer } from 'components/Product/styles';
import { SvgLoader } from 'components/SvgPageLoader';
import useABTesting from 'hooks/useABTesting';
import { useBodyScrollLock } from 'hooks/useBodyScrollLock';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
import { VARIANTS } from 'const/experiments';
import { BUTTON_LOADING_DURATION, THEMES } from 'const/index';
import { CARD_SECTION_MARKERS } from 'const/productCard';
import BackArrow from 'assets/backArrow';

export const BookNowCta = ({
  clickHandler,
  isMobile,
  ctaText,
  mbTheme,
  width,
  isInSidePanel,
  showLoadingState = true,
  isExperimentalCard,
  bookingUrl,
  anchorTarget,
  anchorRel,
}: TBookNowCTAProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useHistoryTraversal({
    action: () => {
      setIsLoading(false);
    },
  });

  const { variant: isLoadersExperiment } = useABTesting({
    experimentId: 'BRAND_LOADER_EXP',
    customEligibilityCheckFn: () => Boolean(isMobile),
  });

  const isLoadersExperimentEnabled = isLoadersExperiment === VARIANTS.TREATMENT;

  useBodyScrollLock(
    isLoadersExperimentEnabled && showLoadingState && isLoading
  );

  const handleButtonClick = async () => {
    if (isMobile) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), BUTTON_LOADING_DURATION);
    }
    clickHandler?.();
  };

  if (isLoadersExperimentEnabled && showLoadingState && isLoading) {
    return createPortal(<SvgLoader />, document.body);
  }

  const buttonComponent = (
    <ButtonContainer
      $isExperimentalCard={isExperimentalCard}
      $isInSidePanel={isInSidePanel}
    >
      <Button
        width={width}
        size="medium"
        color="purps"
        variant="primary"
        isLoading={showLoadingState && isLoading}
        onClick={handleButtonClick}
        tabIndex={0}
        data-card-section={CARD_SECTION_MARKERS.ACTION_BTN}
        text={ctaText}
        icon={mbTheme === THEMES.MIN_BLUE ? <BackArrow /> : null}
        iconPosition="back"
      />
    </ButtonContainer>
  );

  if (bookingUrl) {
    return (
      <a href={bookingUrl} target={anchorTarget} rel={anchorRel}>
        {buttonComponent}
      </a>
    );
  }
  return buttonComponent;
};
