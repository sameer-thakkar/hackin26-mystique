import React, { useEffect, useState } from 'react';
import Conditional from 'components/common/Conditional';
import { StyledButton } from 'components/common/ScrollToTop/styles';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS } from 'const/index';
import ChevronDown from 'assets/ChevrontDown';

const ScrollToTop = ({
  $isLttMonthOnMonthPage,
}: {
  $isLttMonthOnMonthPage: boolean;
}) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window?.pageYOffset > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    trackEvent({
      eventName: ANALYTICS_EVENTS.SCROLL_TO_TOP,
    });
  };
  return (
    <Conditional if={showButton}>
      <StyledButton
        onClick={() => handleScroll()}
        $isLttMonthOnMonthPage={$isLttMonthOnMonthPage}
      >
        <ChevronDown />
      </StyledButton>
    </Conditional>
  );
};

export default ScrollToTop;
