import React from 'react';
import styled from 'styled-components';

export const StyledInfoBanner = styled.div`
  padding: 20px 40px;
  display: grid;
  grid-template-columns: 10% 80% 10%;
  grid-column-gap: 20px;
  border-radius: 8px;
  justify-content: left;
  align-items: center;

  background: ${({ colorScheme: cs }) => cs.background};
  * {
    color: ${({ colorScheme: cs }) => cs.color};
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
    width: calc(100% - 32px);
  }
`;

const StyledInfoBannerMobile = styled.div`
  padding: 10px 16px 24px 16px;
  grid-column-gap: 20px;
  border-radius: 8px;
  justify-content: left;
  align-items: center;

  ${({ clickable }) => (clickable ? `cursor: pointer;` : ``)}
  background: ${({ colorScheme: cs }) => cs.background};
  * {
    color: ${({ colorScheme: cs }) => cs.color};
  }

  @media (max-width: 768px) {
    padding: 16px 20px 20px 20px;
    width: calc(100% - 32px);
  }
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ clickable }) => (clickable ? `cursor: pointer;` : ``)}

  .safety-icon {
    width: 39px;
    height: 24px;
    svg {
      width: 100%;
      height: 100%;
    }
  }
  .desktop-icon {
    width: 20px;
    height: 20px;
  }
  .desktop-icon svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 50px;
  }
`;

const Content = styled.div`
  display: grid;
  grid-row-gap: 8px;
  @media (max-width: 768px) {
    margin-top: 12px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

const TopWrapper = styled.div`
  display: grid;
  grid-template-columns: 20% 70% 10%;
  align-items: center;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const InfoBanner = ({
  title,
  description,
  icon,
  rightArrowOnClick = null,
  colorScheme,
  isMobile,
  rightIcon,
}) => {
  return (
    <>
      {isMobile ? (
        <StyledInfoBannerMobile colorScheme={colorScheme}>
          <TopWrapper>
            <Icon>
              <div className="safety-icon">{icon}</div>
            </Icon>
            <Title>{title}</Title>
            <Icon onClick={rightArrowOnClick} clickable={rightArrowOnClick}>
              {rightIcon}
            </Icon>
          </TopWrapper>
        </StyledInfoBannerMobile>
      ) : (
        <StyledInfoBanner colorScheme={colorScheme}>
          <Icon>{icon}</Icon>
          <Content>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Content>
          <Icon onClick={rightArrowOnClick} clickable={rightArrowOnClick}>
            <div className="desktop-icon">{rightIcon}</div>
          </Icon>
        </StyledInfoBanner>
      )}
    </>
  );
};

export default InfoBanner;
