import React from 'react';
import styled from 'styled-components';

export const StyledInfoBanner = styled.div`
  padding: 24px 32px;
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 8px;
  border-radius: 8px;
  justify-content: left;
  align-items: start;
  ${({ clickable }) => (clickable ? `cursor: pointer;` : ``)}
  background: ${({ colorScheme: cs }) => cs.background};
  * {
    color: ${({ colorScheme: cs }) => cs.color};
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
    width: calc(100% - 32px);
  }
`;

const Icon = styled.div`
  display: flex;
`;

const Content = styled.div`
  display: grid;
  grid-row-gap: 8px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
`;

const Description = styled.div`
  font-size: 14px;
  line-height: 140%;
`;

const CTA = styled.div`
  font-size: 14px;
  display: inline-block;
  text-decoration: underline;
  line-height: 140%;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
    margin-top: 8px;
  }
`;

const InfoBanner = ({
  title,
  description,
  cta,
  icon,
  ctaOnClick = null,
  bannerOnClick = null,
  colorScheme,
}) => {
  return (
    <StyledInfoBanner
      onClick={bannerOnClick}
      clickable={bannerOnClick}
      colorScheme={colorScheme}
    >
      <Icon>{icon}</Icon>
      <Content>
        <Title>{title}</Title>
        <Description>
          {description} <CTA onClick={ctaOnClick}>{cta}</CTA>
        </Description>
      </Content>
    </StyledInfoBanner>
  );
};

export default InfoBanner;
