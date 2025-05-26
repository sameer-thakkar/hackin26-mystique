import styled from 'styled-components';
import { Review } from 'components/MicrositeV2/ShowPageV2/ReviewSection/style';
import { StyledReviewSectionContainer } from 'components/Product/components/Popup/ReviewSection/styles';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  position: relative;
  overflow: hidden;
  img {
    border-radius: 0 !important;
  }
`;

export const CloseIconWrapper = styled.div`
  height: 2rem;
  width: 2rem;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 10000;
  border-radius: 0.25rem;
  top: 1rem;
  right: 1rem;
`;

export const Header = styled.div`
  z-index: 10000 !important;
  position: fixed;
  width: 100vw;
`;

export const TabContainer = styled.div<{ $isOpen: boolean }>`
  padding: 0.875rem 0 0.75rem 0;
  align-items: center;
  margin-top: 0.5rem;
  border-bottom: 0.0625rem solid ${COLORS.GRAY.G6};
  box-shadow: 0 0.125rem 0.75rem 0 #0000000d;

  background: ${COLORS.BRAND.WHITE};
  box-sizing: border-box;
  transition: transform 300ms cubic-bezier(0.7, 0, 0.3, 1);
  transform: translateY(
    ${({ $isOpen }) => (!$isOpen ? '0' : 'calc(-100% - 1.75rem)')}
  );
`;

export const TitleContainer = styled.div`
  width: 100vw;
  display: flex;
  gap: 1rem;
  align-items: center;
  height: 2rem;
  justify-content: center;
  margin-bottom: 0.5rem;
  padding: 0 1rem;
  box-sizing: border-box;
`;

export const CloseContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  flex-shrink: 0;
`;

export const Title = styled.p`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${expandFontToken(FONTS.SUBHEADING_REGULAR)};
  margin: 0;
`;

export const HeaderTabs = styled.div`
  display: flex;
  padding: 0 1rem;
  gap: 0.5rem;
  box-sizing: border-box;
  overflow-x: scroll;
  width: 100vw;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const Tab = styled.span<{
  $isActive: boolean;
  $isLastElement?: boolean;
}>`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  flex-shrink: 0;
  text-align: left;
  cursor: pointer;

  .tab-content {
    display: flex;
    align-items: end;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem 0.375rem 0.75rem;
    background: ${({ $isActive }) =>
      !$isActive ? COLORS.BRAND.WHITE : '#fef7fb'};
    color: ${({ $isActive }) =>
      !$isActive ? COLORS.GRAY.G3 : COLORS.TEXT.CANDY_1};
    transition: all 100ms cubic-bezier(0.7, 0, 0.3, 1);
    border-radius: 100rem;
  }
`;

export const DropdownContentContainer = styled.div<{
  $height?: string;
  $isActive?: boolean;
}>`
  height: ${({ $height }) => $height};
  position: relative;
`;

export const TabContent = styled.div`
  position: relative;
  padding-bottom: 0.5rem;
  background: ${COLORS.BRAND.WHITE};
  p {
    margin-top: 0.25rem !important;
  }
  &:last-child {
    padding-bottom: 2rem;
  }
  h6 {
    margin: 1rem 0;
    ${expandFontToken(FONTS.SUBHEADING_LARGE)}
  }
`;

export const Heading = styled.h4<{ $bottomMargin: string }>`
  font-family: ${HALYARD.FONT_STACK};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  letter-spacing: 0;
  text-align: left;
  color: ${COLORS.GRAY.G1};
  margin-top: 1rem;
  margin-bottom: ${({ $bottomMargin }) => $bottomMargin || '1rem'};

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
`;

export const ContentContainer = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  ul {
    margin-top: -0.5rem;
    ${expandFontToken(FONTS.PARAGRAPH_REGULAR)};
    text-align: left;
  }
  ul {
    padding-left: 1.25rem;
    margin-bottom: 0;
    list-style: none;

    li {
      position: relative;
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: ${COLORS.GRAY.G3};
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: -12px;
        transform: translateY(200%);
      }
    }
  }

  h6#itinerary-section-title {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
    margin: 1rem 0 1.5rem;
  }

  ${StyledReviewSectionContainer} {
    p {
      margin-top: unset;
    }
  }

  ${Review} {
    margin-bottom: 1.5rem;
  }
`;

export const NewTabTag = styled.div`
  padding: 0.125rem 0.375rem 0.1875rem;
  border-radius: 4px;
  background: linear-gradient(180deg, #ff007a 0%, #d8096d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  ${expandFontToken(FONTS.MISC_OVERLINE)};
  color: ${COLORS.BRAND.WHITE};
  letter-spacing: 0.8px;
`;
