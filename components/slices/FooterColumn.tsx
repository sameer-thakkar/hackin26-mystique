import React from 'react';
import styled from 'styled-components';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { trackEvent } from 'utils/analytics';
import LinkResolver from 'components/LinkResolver';

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
    color: ${({ theme }) =>
      theme?.footer?.secondaryColor || COLORS.LIGHTER_LINK_BLUE};
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
  const onLinkClick = (e) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.QUICK_LINKS_CLICKED,
      [ANALYTICS_PROPERTIES.OPTION_TEXT]: e?.target?.innerText,
      [ANALYTICS_PROPERTIES.HEADER]: title,
    });
  };

  return (
    <StyledFooterColumn>
      <Title>{title}</Title>
      <LinksList>
        {links.map((link, index) => (
          <LinkResolver
            key={index}
            className="link-item"
            url={link.link_type.url}
            onClick={onLinkClick}
          >
            {link.link_text}
          </LinkResolver>
        ))}
      </LinksList>
    </StyledFooterColumn>
  );
};

export default FooterColumn;
