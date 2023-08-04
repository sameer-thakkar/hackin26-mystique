import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const SettingsWrapper = styled.div<{
  overflow: boolean;
}>`
  margin: 0 1rem;
  position: relative;

  p {
    font-family: Halyard Text !important;
    font-size: 15px !important;
    font-weight: 300 !important;
    color: ${COLORS.GRAY.G2} !important;
    line-height: 24px !important;
    margin: 0 !important;
  }
  h3 {
    font-family: halyard-text, sans-serif !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    line-height: 20px !important;
    margin: 0 !important;
    color: ${COLORS.GRAY.G2} !important;
  }

  @media (max-width: 768px) {
    ${({ overflow }) => !overflow && `overflow:hidden; max-height: 158px;`};
  }
`;

export const RichTextContainer = styled.div<{
  isSettingsOne?: boolean;
}>``;

export const PracticalInfoCalendarWrapper = styled.div<{
  isSettingsOne?: boolean;
}>`
  ${({ isSettingsOne }) => isSettingsOne && `margin-top: 1rem`};
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
`;

export const PracticalInfoCalendarIconWrapper = styled.div`
  margin: 0.177rem 0.5rem 0 0;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PracticalInfoCalendarContentWrapper = styled.div`
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
`;

export const PracticalInfoLocationWrapper = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: flex-start;
`;

export const PracticalInfoLocationIconWrapper = styled.div`
  margin: 0.302rem 0.5rem 0 0;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PracticalInfoLocationContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PracticalInfoLocationNameWrapper = styled.div`
  color: ${COLORS.GRAY.G2};
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
  margin-bottom: 0.5rem;
`;

export const PracticalInfoFindItOnMapWrapper = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
`;

export const PracticalInfoTimingsWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
`;

export const PracticalInfoTimingsIconWrapper = styled.div`
  margin: 0.354rem 0.5rem 0 0;
`;

export const PracticalInfoTimingsContentWrapper = styled.div`
  p {
    margin: 0 !important;
    font-size: 15px !important;
    font-weight: 300 !important;
    line-height: 20px !important;
    font-family: halyard-text, sans-serif !important;
  }
`;

export const PracticalInfoDistanceAndTimeWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
`;

export const PracticalInfoDistanceIconWrapper = styled.div`
  margin: 0.188rem 0.5rem 0 0;
`;

export const PracticalInfoDistanceContentWrapper = styled.div`
  margin-right: 0.5rem;
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
`;

export const PracticalInfoDotIconWrapper = styled.div`
  margin: -0.244rem 0.5rem 0 0;
`;

export const PracticalInfoTimeContentWrapper = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
`;

export const PracticalInfoSeasonWrapper = styled.div`
  margin-bottom: 1rem;
  display: flex;
`;

export const PracticalInfoSeasonIconWrapper = styled.div`
  margin: 0.177rem 0.5rem 0 0;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PracticalInfoSeasonContentWrapper = styled.div`
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)};
  color: ${COLORS.GRAY.G2};
`;

export const GradientWrapper = styled.div`
  position: absolute;
  bottom: 0%;
  height: 30%;
  z-index: 1;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.47) 0%,
    rgba(255, 255, 255, 0.84) 48.64%,
    #fff 84.29%
  );
`;
