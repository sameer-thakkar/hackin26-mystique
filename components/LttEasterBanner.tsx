import React, { useState, useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { LTT_EASTER_BANNER } from 'const/index';
import { expandFontToken } from 'const/typography';
import { CloseIcon } from 'assets/SvgIcons';
import { trackEvent } from 'utils/analytics';

import Notifications, { notify } from './common/notify';

const EasterBannerWrapper = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 32px auto;
  width: calc(100% - (5.46vw * 2));
  height: 164px;
  cursor: pointer;
  background: #ffda3e;
  border-radius: 12px;

  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    height: 132px;
    border-radius: 12px;
  }
`;

const LeftColumn = styled.div<{ isEggCracked: boolean }>`
  padding-top: 2rem;
  padding-left: 2.5rem;

  @media (max-width: 768px) {
    width: 100%;
    padding-top: 1.625rem;
    padding-left: 1rem;
  }

  .header {
    ${expandFontToken('Heading/Large')};
    color: ${COLORS.GRAY.G2};

    @media (max-width: 768px) {
      ${expandFontToken('Heading/Small')};
      width: ${({ isEggCracked }) => (isEggCracked ? '185px' : '194px')};
    }
  }

  .validity {
    margin-top: 20px;

    ${expandFontToken('Paragraph/XS')};
    color: ${COLORS.GRAY.G3};
    @media (max-width: 768px) {
      margin-left: -12px;
    }
  }
`;
const RightColumn = styled.div`
  width: 536px;
  background: url(${LTT_EASTER_BANNER.BANNER_BG});
  mix-blend-mode: multiply;
  overflow: auto;
  @media (max-width: 768px) {
    width: 50%;
    height: 100%;
    position: absolute;
    right: 0;
    background-position: 0% 40%;
    border-radius: 12px;
  }
`;

const Animation = styled.div<{ isEggCracked: boolean }>`
  position: absolute;
  right: 54px;
  top: -22px;
  height: 205px;
  width: 200px;
  overflow: visible;
  right: ${({ isEggCracked }) => (isEggCracked ? '0' : '54px')};
  height: ${({ isEggCracked }) => (isEggCracked ? '235px' : '205px')};
  width: ${({ isEggCracked }) => (isEggCracked ? '250px' : '200px')};

  @media (max-width: 768px) {
    right: ${({ isEggCracked }) => (isEggCracked ? '-8px' : '0')};
    top: ${({ isEggCracked }) => (isEggCracked ? '10px' : '-22px')};
    height: 160px;
    width: 150px;
    z-index: 2;
  }
`;
const BannerCta = styled.div`
  padding: 11px 16px 13px;
  margin-top: 1rem;

  max-width: 123px;
  width: fit-content;
  height: 44px;

  background-color: ${COLORS.BRAND.PURPS};
  border-radius: 8px;
  box-sizing: border-box;

  ${expandFontToken('Button/Medium')};
  color: ${COLORS.BRAND.WHITE};

  cursor: pointer;

  @media (max-width: 768px) {
    margin: 0;
    margin-top: 0.875rem;
    height: 32px;
    padding: 0;
    ${expandFontToken('Button/Small')};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 106px;
  }
`;
const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
`;

const ModalContainer = styled.div`
  width: 792px;
  height: 624px;
  position: relative;

  background-color: #ffda3e;
  background-image: url(${LTT_EASTER_BANNER.MODAL_BG_DWEB});
  border-radius: 14px;

  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    ${expandFontToken('Display/Large')};
    color: ${COLORS.GRAY.G2};
    margin-top: 54px;
    margin-bottom: 20px;
  }

  .desc {
    ${expandFontToken('UI/Label Large')};
    color: ${COLORS.GRAY.G2};
    width: 384px;
    text-align: center;
    font-feature-settings: 'ss04' on;
  }

  .white-box {
    width: 384px;
    height: 384px;
    background: #ffd10d;
    border-radius: 20px;
    margin-top: 44px;

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    position: relative;

    .anim {
      position: relative;
      top: -22.5%;
      height: 100%;
      width: 100%;
    }
  }
  .close-icon {
    position: absolute;
    right: 28px;
    top: 28px;
    cursor: pointer;
  }

  .copy-code-wrapper {
    height: 80px;
    width: 100%;

    position: absolute;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    background: rgba(255, 218, 62, 0.8);
    box-shadow: 0px -2px 12px rgba(84, 84, 84, 0.1);
  }

  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;

    background-image: url(${LTT_EASTER_BANNER.MODAL_BG_MWEB});
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 0;
    .header {
      ${expandFontToken('Display/Regular')};
      margin-top: 100px;
      margin-bottom: 12px;
    }

    .desc {
      ${expandFontToken('UI/Label Medium')};
      width: 282px;
    }

    .white-box {
      width: 343px;
      height: 343px;
    }
  }
`;

const ModalCopyCodeCta = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 11px 20px 13px;
  gap: 8px;
  width: 327px;
  cursor: pointer;
  height: 48px;
  box-sizing: border-box;

  background: ${COLORS.BRAND.PURPS};
  box-shadow: 0px 8px 15px rgba(128, 0, 255, 0.3);
  border-radius: 8px;

  ${expandFontToken('Button/Medium')};
  color: ${COLORS.BRAND.WHITE};
`;

const LttEasterBanner: React.FC<any> = ({
  isMobile,
}: {
  isMobile: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEggCracked, setIsEggCracked] = useState(false);

  useEffect(() => {
    const wasCracked = localStorage.getItem(WAS_PREVIOUSLY_CRACKED_KEY);
    if (wasCracked) setIsEggCracked(true);
  }, []);

  const {
    RIVE_ANIMATION,
    ARTBOARDS: { CLOSED, OPEN_DWEB, OPEN_MWEB, INTERACTION },
    COUPON_CODE,
    WAS_PREVIOUSLY_CRACKED_KEY,
  } = LTT_EASTER_BANNER;

  const { RiveComponent: EggClosed } = useRive({
    src: RIVE_ANIMATION,
    autoplay: true,
    stateMachines: 'stateMachine',
    artboard: CLOSED,
    layout: new Layout({ fit: Fit.FitHeight, alignment: Alignment.Center }),
  });

  const { RiveComponent: EggOpenDweb } = useRive({
    src: RIVE_ANIMATION,
    autoplay: true,
    stateMachines: 'stateMachine',
    artboard: isMobile ? OPEN_MWEB : OPEN_DWEB,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const { RiveComponent: EggInteraction } = useRive({
    src: RIVE_ANIMATION,
    autoplay: true,
    stateMachines: 'stateMachine',
    artboard: INTERACTION,
    layout: new Layout({ fit: Fit.FitHeight, alignment: Alignment.Center }),
    onStateChange: ({ data }) => {
      if (data && Array.isArray(data) && data[data.length - 1] === 'open 2') {
        setIsEggCracked(true);
        trackEvent({
          eventName: 'MB Easter Egg Viewed',
          State: 'Cracked',
        });
        localStorage.setItem(WAS_PREVIOUSLY_CRACKED_KEY, 'true');
      }
    },
  });

  const copyCouponCode = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    notify.show('Copied to clipboard!', 'success', 3000);
    trackEvent({ eventName: 'MB Coupon Copied' });
  };

  const openModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!isEggCracked) {
      trackEvent({
        eventName: 'MB Easter Banner Clicked',
      });
      setIsModalOpen(true);
      trackEvent({ eventName: 'MB Easter Egg Viewed', State: 'Uncracked' });
    } else {
      copyCouponCode();
    }
  };

  const closeIconClicked = (e: Event) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <EasterBannerWrapper onClick={openModal}>
      <LeftColumn isEggCracked={isEggCracked}>
        <div className="header">
          {isEggCracked
            ? 'Yay! Claim your discount at check out'
            : 'Win big with Easter-exclusive discounts'}
        </div>
        <BannerCta className="copy-cta" onClick={openModal}>
          {isEggCracked ? 'Copy code' : 'Get cracking'}
        </BannerCta>
        <div className="validity">
          *coupon valid for the next 24 hours only.
        </div>
      </LeftColumn>
      <RightColumn></RightColumn>
      <Animation isEggCracked={isEggCracked}>
        {isEggCracked ? <EggOpenDweb /> : <EggClosed />}
      </Animation>
      <Modal isOpen={isModalOpen} onClick={(e) => e.stopPropagation()}>
        <ModalContainer>
          <div className="close-icon">
            <CloseIcon onClick={closeIconClicked} />
          </div>
          <div className="header">
            {isEggCracked ? 'Egg-Cellent!' : 'Crack to win!'}
          </div>
          <div className="desc">
            {isEggCracked
              ? `You’ve cracked it! Copy the code: ${COUPON_CODE} and use at checkout`
              : 'Keep tapping the egg for a surprise'}
          </div>
          <div className="white-box">
            <div className="anim">
              <EggInteraction />
            </div>
          </div>
          {isEggCracked && (
            <div className="copy-code-wrapper">
              <ModalCopyCodeCta
                onClick={(e) => {
                  e.stopPropagation();
                  copyCouponCode();
                  setIsModalOpen(false);
                }}
                className="copy-cta"
              >
                Copy code
              </ModalCopyCodeCta>
            </div>
          )}
        </ModalContainer>
      </Modal>
      <Notifications key={'notifications'} />
    </EasterBannerWrapper>
  );
};

export default LttEasterBanner;
