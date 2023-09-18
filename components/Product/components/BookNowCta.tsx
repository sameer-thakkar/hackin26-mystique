import { useState } from 'react';
import { Button } from '@headout/aer';
import { TBookNowCTAProps } from 'components/Product/interface';
import { ButtonContainer } from 'components/Product/styles';
import { BUTTON_LOADING_DURATION, THEMES } from 'const/index';
import { BackArrow } from 'assets/SvgIcons';

export const BookNowCta = ({
  clickHandler,
  isMobile,
  ctaText,
  mbTheme,
  width,
  isInSidePanel,
}: TBookNowCTAProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleButtonClick = () => {
    if (isMobile) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), BUTTON_LOADING_DURATION);
    }
    clickHandler?.();
  };
  return (
    <ButtonContainer $isInSidePanel={isInSidePanel}>
      <Button
        width={width}
        size="medium"
        color="purps"
        variant="primary"
        isLoading={isLoading}
        onClick={handleButtonClick}
        tabIndex={0}
        text={ctaText}
        icon={mbTheme === THEMES.MIN_BLUE ? BackArrow : null}
        iconPosition="back"
      />
    </ButtonContainer>
  );
};
