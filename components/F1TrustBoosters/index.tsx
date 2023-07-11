import React, { useState } from 'react';
import Conditional from 'components/common/Conditional';
import {
  F1TrustBoosterProp,
  F1TrustBoostersProp,
} from 'components/F1TrustBoosters/interface';
import {
  F1TrustBoosterContainer,
  F1TrustBoosterWrapper,
  ScrollBar,
  ScrollBarContainer,
  SvgContainer,
  TrustBoosterBox,
  TrustBoosterSubTextContainer,
  TrustBoosterTextContainer,
} from 'components/F1TrustBoosters/styles';

const F1TrustBoosters = ({
  f1TrustBooster,
  isMobile,
}: F1TrustBoosterProp): JSX.Element => {
  const [left, setLeft] = useState(0);

  const scrollHandler = () => {
    const element = document.querySelector('.scrollable-area');
    if (!element) return;

    const scrollLeft = element.scrollLeft;
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;
    let percentFromLeft = 0;

    if (scrollLeft === 0) {
      percentFromLeft = scrollLeft;
    } else if (scrollWidth <= Math.floor(scrollLeft + clientWidth)) {
      percentFromLeft = 73;
    } else {
      const offset = scrollLeft;
      percentFromLeft = (120 / scrollWidth) * offset;
      percentFromLeft = Math.min(percentFromLeft, 73);
    }
    setLeft(percentFromLeft);
  };

  return (
    <F1TrustBoosterContainer>
      <F1TrustBoosterWrapper
        className="scrollable-area"
        onScroll={scrollHandler}
      >
        {f1TrustBooster.map(
          (item: F1TrustBoostersProp, index: number): JSX.Element => (
            <TrustBoosterBox
              key={item.boosterHeading}
              isFirstBox={index === 0}
              isLastBox={index === f1TrustBooster.length - 1}
            >
              <SvgContainer>{item.svgIcon}</SvgContainer>
              <TrustBoosterTextContainer>
                {item.boosterHeading}
                <TrustBoosterSubTextContainer>
                  {item.boosterSubtext}
                </TrustBoosterSubTextContainer>
              </TrustBoosterTextContainer>
            </TrustBoosterBox>
          )
        )}
      </F1TrustBoosterWrapper>
      <Conditional if={isMobile}>
        <ScrollBarContainer>
          <ScrollBar left={left} />
        </ScrollBarContainer>
      </Conditional>
    </F1TrustBoosterContainer>
  );
};

export default F1TrustBoosters;
