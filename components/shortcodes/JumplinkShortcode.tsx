import React, { useEffect } from 'react';
import { scroller } from 'react-scroll';
import { useSetRecoilState } from 'recoil';
import Conditional from 'components/common/Conditional';
import { generateSidenavId, isMobile } from 'utils/helper';
import { lazyLoadOverrideAtom } from 'store/atoms/lazy';
import COLORS from 'const/colors';

export type TJumplinkShortcode = {
  target: string;
  text: string;
};

const JumplinkShortcode = ({ target, text }: TJumplinkShortcode) => {
  const setLazyLoadOverride = useSetRecoilState(lazyLoadOverrideAtom);
  useEffect(() => {
    setLazyLoadOverride(true);
  }, []);

  const targetId = generateSidenavId(target);
  const scrollToElement = () => {
    scroller.scrollTo(targetId, {
      duration: 1200,
      smooth: 'easeInOutQuart',
      offset: isMobile() ? -30 : -100,
    });
  };
  return (
    <>
      <Conditional if={target}>
        <span
          onClick={scrollToElement}
          role="button"
          tabIndex={0}
          style={{ color: COLORS.CANDY.PRIMARY, cursor: 'pointer' }}
        >
          {text}
        </span>
      </Conditional>
    </>
  );
};
export default JumplinkShortcode;
