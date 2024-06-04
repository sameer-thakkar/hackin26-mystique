import styled from 'styled-components';
import Button from '@headout/aer/src/atoms/Button';
import COLORS from 'const/colors';

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
}) => (
  <Navigation>
    <div className="progress">
      {Array.from({ length: numberOfSteps }).map((_, i) => (
        <ProgressRectangle
          $filled={i === currentStepNumber || i < currentStepNumber}
          key={i}
        />
      ))}
    </div>

    <Button
      onClick={handleBackClick}
      width={'100%'}
      size="medium"
      variant="tertiary"
      color="purps"
      text={'Back'} // todo: loclaise
    />

    <Button
      disabled={isNextDisabled}
      onClick={handleNextClick}
      width={'100%'}
      size="medium"
      color="purps"
      variant="primary"
      text={'Next'} // todo: loclaise
    />
  </Navigation>
);

const Navigation = styled.div`
  background: white;
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 2.5rem); // 1.25rem padding on both sides
  padding: 1rem 1.25rem 2rem;

  display: grid;
  grid-template-columns: 1fr 1fr;

  grid-column-gap: 0.75rem;
  grid-row-gap: 0.75rem;

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
