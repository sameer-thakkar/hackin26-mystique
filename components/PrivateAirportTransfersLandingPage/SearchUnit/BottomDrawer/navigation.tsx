import React from 'react';
import styled from 'styled-components';
import { Button } from '@headout/eevee';
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
  isLoading,
}: {
  handleBackClick: () => void;
  handleNextClick: () => void;
  isNextDisabled: boolean;
  numberOfSteps: number;
  currentStepNumber: number;
  isLoading?: boolean;
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
          as="button"
          btnType="primary"
          onClick={handleBackClick}
          width={isLastStep ? '3.7rem' : '100%'}
          icon={
            isLastStep ? (
              <BackArrow stroke={COLORS.TEXT.PURPS_3} width={16} />
            ) : null
          }
          primaryText={isLastStep ? '' : strings.BACK}
          size="medium"
          state="default"
          variant="tertiary"
          className="navigation-button"
        />

        <Button
          as="button"
          btnType="primary"
          width={'100%'}
          disabled={isNextDisabled}
          onClick={handleNextClick}
          primaryText={isLastStep ? strings.SEARCH : strings.NEXT}
          size="medium"
          state={
            isNextDisabled ? 'disabled' : isLoading ? 'loading' : 'default'
          }
          variant="primary"
          className="navigation-button primary"
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
    transition: width 150ms cubic-bezier(0.3, 1, 0.7, 1);

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

  '& button': {
    '& span': {
      color: `semantic.text.primary !important`,
    },
  },

  '& .primary': {
    '& span': {
      color: `semantic.surface.light.white !important`,
    },
  },
});
