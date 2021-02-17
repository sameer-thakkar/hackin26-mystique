import React from 'react';
import styled from 'styled-components';
import { SOLEIL, COLORS } from 'const/ui-constants';

import LinkResolver from '../LinkResolver';

type FooterColumnProps = {
  title: string;
  links: Array<{
    link_text: string;
    link_type: { url: string; target: string };
  }>;
};

const StyledFooterColumn = styled.div`
  display: grid;
  align-items: start;
  grid-template-rows: max-content max-content;
  font-family: ${SOLEIL.FONT_STACK};
  color: ${COLORS.DAVY_GREY};
  .link-item {
    color: ${({ theme }) => theme?.footer?.secondaryColor || COLORS.BEACH};
    text-decoration: none;
    margin-top: 12px;
    :last-child {
      margin-bottom: 0;
    }
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: ${SOLEIL.SEMIBOLD};
  margin-bottom: 4px;
`;

const LinksList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

const FooterColumn: React.FC<FooterColumnProps> = ({ links, title }) => {
  return (
    <StyledFooterColumn>
      <Title>{title}</Title>
      <LinksList>
        {links.map((link, index) => (
          <LinkResolver
            key={index}
            className="link-item"
            url={link.link_type.url}
          >
            {link.link_text}
          </LinkResolver>
        ))}
      </LinksList>
    </StyledFooterColumn>
  );
};

export default FooterColumn;
