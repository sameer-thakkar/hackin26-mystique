import React from 'react';
import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import { HALYARD } from 'const/ui-constants';

export const StyledInfoBanner = styled.div`
  padding: 24px 32px;
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 8px;
  border-radius: 8px;
  justify-content: left;
  align-items: start;
  ${({  
 // @ts-expect-error TS(2339): Property 'clickable' does not exist on type 'Pick<... Remove this comment to see the full error message
 clickable }) => (clickable ? `cursor: pointer;` : ``)}
  background: ${({  
 // @ts-expect-error TS(2339): Property 'colorScheme' does not exist on type 'Pic... Remove this comment to see the full error message
 colorScheme: cs }) => cs.background};
  * {
    color: ${({    
 // @ts-expect-error TS(2339): Property 'colorScheme' does not exist on type 'Pic... Remove this comment to see the full error message
 colorScheme: cs }) => cs.color};
  }

  @media (max-width: 768px) {
    padding: 16px;
    width: calc(100% - 32px);
    grid-template-columns: auto;
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
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;

  @media (max-width: 768px) {
    svg {
      height: 24px;
      width: 24px;
    }
    display: grid;
    grid-column-gap: 8px;
    justify-content: left;
    align-items: center;
    grid-template-columns: auto auto;
  }
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 20px;
`;

const CTA = styled.div`
  font-size: 12px;
  line-height: 16px;
  display: inline-block;
  text-decoration: underline;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
    margin-top: 4px;
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
  isMobile = false
}: any) => {
  return (
    <StyledInfoBanner
      onClick={bannerOnClick}
      // @ts-expect-error TS(2769): No overload matches this call.
      clickable={bannerOnClick}
      colorScheme={colorScheme}
    >
      <Conditional if={!isMobile}>
        <Icon>{icon}</Icon>
      </Conditional>
      <Content>
        <Title>
          <Conditional if={isMobile}>
            <Icon>{icon}</Icon>
          </Conditional>
          {title}
        </Title>
        <Conditional if={typeof description === 'string'}>
          <Description>
            {description} <CTA onClick={ctaOnClick}>{cta}</CTA>
          </Description>
        </Conditional>
        <Conditional if={typeof description !== 'string'}>
          {description}
        </Conditional>
      </Content>
    </StyledInfoBanner>
  );
};

export default InfoBanner;
