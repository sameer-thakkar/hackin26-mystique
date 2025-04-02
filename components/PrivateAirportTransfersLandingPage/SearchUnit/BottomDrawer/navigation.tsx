import React from 'react';
import styled from 'styled-components';
import Button from '@headout/aer/src/atoms/Button';
import { css } from '@headout/pixie/css';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import BackArrow from 'assets/backArrow';

export const BottomDrawerNavigation = ({
  handleBackClick,
  handleNextClick,
  isNextDisabled,
  numberOfSteps,
  currentStepNumber,
}: {
  handleBackClick: () => void;
  handleNextClick: () => void;
  isNextDisabled: boolean;
  numberOfSteps: number;
  currentStepNumber: number;
}) => {
  const isLastStep = currentStepNumber === numberOfSteps - 1;

  return (
    <Navigation>
      <div className="progress">
        {Array.from({ length: numberOfSteps }).map((_, i) => (
          <ProgressRectangle
            $filled={i === currentStepNumber || i < currentStepNumber}
            key={i}
          />
        ))}
      </div>

      <div className={NavigationButtonContainerStyles}>
        <Button
          onClick={handleBackClick}
          width={isLastStep ? '3rem' : '100%'}
          size="medium"
          variant="tertiary"
          color="purps"
          aria-label={strings.BACK}
          text={isLastStep ? '' : strings.BACK}
          icon={
            isLastStep ? (
              <BackArrow stroke={COLORS.TEXT.PURPS_3} width={16} />
            ) : null
          }
          className="navigation-button"
        />

        <Button
          disabled={isNextDisabled}
          onClick={handleNextClick}
          width={'100%'}
          size="medium"
          color="purps"
          variant="primary"
          text={isLastStep ? strings.SEARCH : strings.NEXT}
          className="navigation-button"
        />
      </div>
    </Navigation>
  );
};

const Navigation = styled.div`
  background: white;
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 2.5rem); // 1.25rem padding on both sides
  padding: 1rem 1.25rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  box-shadow: 0px -2px 12px 0px rgba(12, 9, 9, 0.1);

  z-index: 99;

  .progress {
    display: none;
    background: white;

    grid-column: span 2;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    background-color: white;
  }

  .navigation-button {
    transition: width 150ms ease-in-out;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const ProgressRectangle = styled.span<{
  $filled: boolean;
}>`
  display: inline-block;
  width: 2rem;
  height: 0.25rem;

  border-radius: 2px;
  background: ${({ $filled }) =>
    $filled ? COLORS.BRAND.PURPS : COLORS.GRAY.G6};
`;

const NavigationButtonContainerStyles = css({
  display: 'flex',
  gap: '0.75rem',
});
