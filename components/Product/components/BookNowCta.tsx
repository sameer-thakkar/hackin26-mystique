import { useState } from 'react';
import Button from '@headout/aer/src/atoms/Button';
import { TBookNowCTAProps } from 'components/Product/interface';
import { ButtonContainer } from 'components/Product/styles';
import { useHistoryTraversal } from 'hooks/useHistoryTraversal';
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
}: TBookNowCTAProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleButtonClick = () => {
    if (isMobile) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), BUTTON_LOADING_DURATION);
    }
    clickHandler?.();
  };
  useHistoryTraversal({
    action: () => {
      setIsLoading(false);
    },
  });
  return (
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
};
