import styled from 'styled-components';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';
import { HALYARD } from 'const/ui-constants';

export const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16/10;
  position: relative;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
`;

export const Header = styled.div`
  z-index: 10000 !important;
  position: fixed;
  overflow: hidden;
  border-radius: 1rem 1rem 0 0;
  width: 100vw;
`;

export const TabContainer = styled.div<{ $isOpen: boolean }>`
  display flex;
  padding: 1rem 1rem 0.75rem 1rem;
  align-items: center;
  width: 100vw;
  margin-top: 0.5rem;
  overflow-x: scroll;
  gap: 0.5rem;
  border-bottom: 0.0625rem solid ${COLORS.GRAY.G6};
  box-shadow: 0 0.125rem 0.75rem 0 #0000000D;
  &::-webkit-scrollbar {
    display: none;
  }
  background: ${COLORS.BRAND.WHITE};
  box-sizing: border-box;
  -ms-overflow-style: none;  
  scrollbar-width: none;
  transition: transform 300ms cubic-bezier(0.7, 0, 0.3, 1);
  transform: translateY(${({ $isOpen }) =>
    !$isOpen ? '0' : 'calc(-100% - 1.75rem)'});
`;

export const Tab = styled.span<{
  $isActive: boolean;
  $isLastElement?: boolean;
}>`
 ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)}
  padding: 0.25rem 0.75rem 0.375rem 0.75rem;
  flex-shrink: 0;
  background: ${({ $isActive }) =>
    !$isActive ? COLORS.BRAND.WHITE : '#fef7fb'};
  border-radius: 100rem;
  color: ${({ $isActive }) =>
    !$isActive ? COLORS.GRAY.G3 : COLORS.TEXT.CANDY_1};
  text-align: left;
  cursor pointer;
  transition: all 100ms cubic-bezier(0.7, 0, 0.3, 1);
`;

export const DropdownContentContainer = styled.div<{
  $height?: string;
  $isActive?: boolean;
}>`
  height: ${({ $height }) => $height};
  position: relative;
`;

export const TabContent = styled.div`
  padding-bottom: 0.5rem;
  background: ${COLORS.BRAND.WHITE};
  p {
    margin-top: 0.25rem !important;
  }
  &:last-child {
    padding-bottom: 2rem;
  }
`;

export const Heading = styled.h4<{ $isFirst: boolean }>`
  font-family: ${HALYARD.FONT_STACK};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  letter-spacing: 0;
  text-align: left;
  color: ${COLORS.GRAY.G1};
  margin-top: 1rem;
  margin-bottom: ${({ $isFirst }) => ($isFirst ? '0.75rem' : '1rem')};
`;

export const ContentContainer = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  ul,
  p {
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
`;
