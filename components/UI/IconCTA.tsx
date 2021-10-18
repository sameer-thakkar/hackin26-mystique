import React from 'react';
import styled from 'styled-components';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { COLORS } from 'const/ui-constants';

export const StyledIconCTA = styled.div`
  padding: 8px;
  padding-left: 19px;
  position: relative;
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 8px;
  border-radius: 0px 2px 2px 0px;
  justify-content: left;
  background: ${({ colorScheme: cs }) => cs.background};
  color: ${({ colorScheme: cs }) => cs.color};
  width: max-content;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : '')};
  @media (max-width: 768px) {
    ${({ showBorder }) => showBorder && `border: 1px solid ${COLORS.GREY_G6}`}
  }
`;

export const Chevron = styled.div`
  display: flex;
  svg {
    height: 12px;
    width: 12px;
    transform: rotate(180deg);
    path {
      stroke: ${({ colorScheme: cs }) => cs.color};
      stroke-width: 2.5px;
    }
  }
`;

export const Icon = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  height: 31px;
  width: 32px;
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  @media (max-width: 768px) {
    width: auto;
  }
`;

export const Content = styled.div`
  display: grid;
  grid-row-gap: 8px;
  color: ${({ colorScheme: cs }) => cs.color};
  font-weight: 600;
  font-size: 11px;
  line-height: 14px;
  @media (max-width: 768px) {
  }
`;

const IconCTA = ({
  text,
  icon,
  ctaOnClick = null,
  colorScheme,
  showBorder = false,
}) => {
  return (
    <StyledIconCTA
      onClick={ctaOnClick}
      colorScheme={colorScheme}
      showBorder={showBorder}
    >
      <Icon className="icon">{icon}</Icon>
      <Content className="text" colorScheme={colorScheme}>
        {text}
      </Content>
      {ctaOnClick ? (
        <Chevron className="chevron" colorScheme={colorScheme}>
          {CHEVRON_LEFT}
        </Chevron>
      ) : null}
    </StyledIconCTA>
  );
};

export default IconCTA;
