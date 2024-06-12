import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

export const PracticalInfoWrapper = styled.div`
  display: flex;
  ${expandFontToken(FONTS.PARAGRAPH_MEDIUM)}
  column-gap: 1.5rem;
  margin-bottom: 1rem;

  .practical-info {
    margin-bottom: 1rem;
  }

  p {
    font-family: halyard-text !important;
    font-size: 15px !important;
    font-style: normal !important;
    font-weight: 300 !important;
    line-height: 24px !important;
    margin: 0 !important;
    color: ${COLORS.GRAY.G2} !important;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    column-gap: unset;
  }
`;

export const PracticalInfoCalendarWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
    height: 20px;
    margin-top: 3px;
  }

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const PracticalInfoCalendarIconWrapper = styled.div`
  margin: 0 0.5rem 0 0;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PracticalInfoCalendarContentWrapper = styled.div`
  color: ${COLORS.GRAY.G2};

  @media (max-width: 768px) {
    margin: 0 1.5rem 0 0;
  }
`;

export const PracticalInfoTimeAndDurationWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const PracticalInfoTimeWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const PracticalInfoDistanceAndTimeWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const PracticalInfoDistanceIconWrapper = styled.div`
  margin: 0.188rem 0.5rem 0 0;
`;

export const PracticalInfoDistanceContentWrapper = styled.div`
  margin-right: 0.5rem;
`;

export const PracticalInfoDistanceWrapper = styled.div`
  display: flex;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const PracticalInfoDotIconWrapper = styled.div`
  margin: -0.244rem 0.5rem 0 0;
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
  color: ${COLORS.GRAY.G2};
`;

export const PracticalInfoLocationWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  @media (max-width: 768px) {
    display: flex;
    margin-bottom: 1rem;
  }
`;

export const PracticalInfoLocationIconWrapper = styled.div`
  margin: 0.2rem 0.313rem 0 0;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const PracticalInfoLocationContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

export const PracticalInfoTimingsWrapper = styled.div`
  display: flex;
`;

export const PracticalInfoTimingsIconWrapper = styled.div`
  margin: 0.15rem 0.5rem 0 0;
`;
