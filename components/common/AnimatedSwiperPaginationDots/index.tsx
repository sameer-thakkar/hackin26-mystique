import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { TAnimatedSwiperPaginationDotsProps } from 'components/common/AnimatedSwiperPaginationDots/interface';
import { StyledAnimatedSwiperPaginationDotsContainer } from 'components/common/AnimatedSwiperPaginationDots/styles';

const AnimatedSwiperPaginationDots = ({
  slidesCount,
  onDotClick,
  activeIndex = 0,
}: TAnimatedSwiperPaginationDotsProps) => {
  const [activeIndexState, setActiveIndexState] = useState(activeIndex);

  useEffect(() => {
    setActiveIndexState(activeIndex);
  }, [activeIndex]);

  const handleClick = (index: number) => {
    onDotClick?.(index);
  };

  return (
    <StyledAnimatedSwiperPaginationDotsContainer>
      {new Array(slidesCount).fill(1).map((_, index) => (
        <button
          key={`bullet-${index}`}
          className={classNames(
            'bullet',
            index === activeIndexState && 'expanded'
          )}
          onClick={() => {
            handleClick(index);
          }}
        />
      ))}
    </StyledAnimatedSwiperPaginationDotsContainer>
  );
};

export default AnimatedSwiperPaginationDots;
