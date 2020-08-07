import React from 'react';
import styled from 'styled-components';
import Image from './Image';
import { COLORS } from 'constants/ui-constants';

export const StyledIconCard = styled.div`
  padding: 16px;
  padding-top: 0;
  display: grid;
  border-radius: 4px;
  justify-content: left;
  background: ${({ colorScheme: cs }) => cs.background};
  color: ${({ colorScheme: cs }) => cs.color};
`;

const Icon = styled.div`
  display: flex;
  padding: 4px;
  border-radius: 4px;
  transform: translateY(-50%);
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.07);
  background: ${COLORS.WHITE};
  justify-self: left;
  margin-bottom: -20px;
  img {
    height: 32px;
    width: 32px;
  }
`;

const Content = styled.div`
  display: grid;
  grid-row-gap: 8px;
  padding-top: 24px;
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

const IconCard = ({ title, description, icon, colorScheme }) => {
  return (
    <StyledIconCard colorScheme={colorScheme}>
      <Icon>
        {typeof icon === 'string' ? (
          <Image format="gif" url={icon} alt={title} />
        ) : (
          icon
        )}
      </Icon>
      <Content>
        <Title>{title}</Title>
        <Description className={'description'}>{description}</Description>
      </Content>
    </StyledIconCard>
  );
};

export default IconCard;
