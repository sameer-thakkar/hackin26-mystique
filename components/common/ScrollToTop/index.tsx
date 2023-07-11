import React, { useEffect, useState } from 'react';
import Conditional from 'components/common/Conditional';
import { StyledButton } from 'components/common/ScrollToTop/styles';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS } from 'const/index';
import { CHEVRON_DOWN } from 'assets/SvgIcons';

const ScrollToTop = () => {
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
      <StyledButton onClick={() => handleScroll()}>{CHEVRON_DOWN}</StyledButton>
    </Conditional>
  );
};

export default ScrollToTop;
