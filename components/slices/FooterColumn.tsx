import React from 'react';
import styled from 'styled-components';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { trackEvent } from 'utils/analytics';
import LinkResolver from 'components/LinkResolver';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';

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
  color: ${COLORS.GRAY.G2};
  .link-item {
    color: ${COLORS.GRAY.G4};
    text-decoration: none;
    margin-top: 12px;
    :last-child {
      margin-bottom: 0;
    }
  }
`;

const Title = styled.div`
  ${expandFontToken('Subheading/Large')}
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
