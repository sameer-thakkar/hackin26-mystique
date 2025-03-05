import styled from 'styled-components';
import { css } from '@headout/pixie/css';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const Container = styled.div``;

export const Wrapper = styled.div`
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  background: ${COLORS.MISC.LAVENDER};
  position: relative;
  box-sizing: border-box;
  width: 100vw;
  button {
    -webkit-tap-highlight-color: transparent;
  }
`;
export const Icon = styled.div`
  position: absolute;
  top: -10px;
  right: 24px;
`;

export const Heading = styled.h3`
  color: ${COLORS.GRAY.G1};
  ${expandFontToken(FONTS.HEADING_REGULAR)};
  letter-spacing: 0.4px;
  margin: 0;
  margin-bottom: 0.25rem;
  .blue {
    color: #0d2a6f;
  }

  @media (min-width: 768px) {
    ${expandFontToken(FONTS.DISPLAY_XS)}
    p {
      margin-top: 0.25rem;
    }
  }
`;

export const InfoCopy = styled.p`
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  color: ${COLORS.GRAY.G2};
  margin: 0;
  span {
    white-space: nowrap;
  }
`;

export const AnswerCardWrapper = styled.div`
  max-height: 13.5rem;
  width: 100%;
  border-width: 1px 1px 3px 1px;
  cursor: pointer;

  border-style: solid;
  border-radius: 12px;
  border-bottom-width: 3px;
  border-bottom-style: solid;
  border-bottom-color: ${COLORS.GRAY.G6};

  border-color: ${COLORS.GRAY.G6};
  box-sizing: border-box;
  transition: transform 150ms cubic-bezier(0.7, 0, 0.3, 1);
  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    border-radius: 16px;
    max-height: 14.125rem;
    transition: transform 350ms cubic-bezier(0.7, 0, 0.3, 1);

    &:hover {
      transform: translateY(-6px);
    }
    transition: transform 150ms cubic-bezier(0.7, 0, 0.3, 1);
    &:active {
      transform: scale(0.98);
    }
  }
`;

export const QuestionContainer = styled.div`
  background-color: #fafafa;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  border-bottom: 1px solid ${COLORS.GRAY.G6};
  height: 4rem;
  padding: 0.75rem;
  box-sizing: border-box;
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  color: ${COLORS.GRAY.G1};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (min-width: 768px) {
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    padding: 0.875rem;
    height: 4.25rem;
    box-sizing: border-box;
  }
`;

export const AnswerContainer = styled.div`
  box-sizing: border-box;
  padding: 0.625rem 0.75rem 0.875rem 0.75rem;
  ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
  background-color: ${COLORS.BRAND.WHITE};
  border-radius: 0px 0px 12px 12px;

  @media (min-width: 768px) {
    border-radius: 0px 0px 16px 16px;
  }
`;

export const UnderlinedText = styled.span`
  position: relative;
  display: inline-block;

  svg {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 5px;
  }
`;

export const SwiperWrapper = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;

  .swiper {
    width: 100vw;
    margin-left: -1.5rem;
  }

  .swiper-container {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    width: calc(100vw - 3rem);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .swiper-wrapper {
    padding-left: 1.5rem;
  }

  .animate-carousel.swiper-wrapper {
    animation-delay: 900ms;
    animation-name: move-left;
    animation-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
    animation-duration: 1500ms;
  }

  @keyframes move-left {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-100px);
    }
    100% {
      transform: translateX(0);
    }
  }
`;

export const Answer = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  @media (min-width: 768px) {
    -webkit-line-clamp: 2;
  }
`;

export const UserInfo = styled.div`
  margin-top: 0.625rem;
  display: flex;
  gap: 8px;
`;

export const DP = styled.div`
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 50%;
  position: relative;
`;

export const UserImage = styled.img`
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 50%;
`;

export const CountryFlag = styled.img`
  height: 0.625rem;
  width: 0.625rem;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  bottom: 0px;
  right: 0px;
  border: 0.27px solid ${COLORS.GRAY.G6};
`;

export const UserMeta = styled.div`
  transform: translateY(-2px);
`;

export const UserCountry = styled.span`
  color: ${COLORS.GRAY.G3};
  ${expandFontToken(FONTS.UI_LABEL_SMALL)};
  line-height: 1;
  display: flex;
  gap: 4px;
  align-items: center;
  .dot {
    font-family: serif; // Overwritten because of • appearing as square in Halyard Text font
    color: ${COLORS.GRAY.G4};
    transform: translateY(1.5px);
  }
`;

export const AnswerCount = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 0.75rem;
  ${expandFontToken(FONTS.UI_LABEL_REGULAR_HEAVY)};
  color: ${COLORS.TEXT.CANDY_1};
  svg {
    transform: translateY(1.5px);
  }
  @media (min-width: 768px) {
    color: ${COLORS.GRAY.G2};
    svg {
      path {
        stroke: ${COLORS.GRAY.G2};
      }
    }
  }
`;

export const Timestamp = css({
  margin: '0',
});

export const Name = css({
  margin: '0',
  marginBottom: '0.0625rem',
});
