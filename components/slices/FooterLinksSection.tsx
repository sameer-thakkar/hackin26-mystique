import React from 'react';
import styled from 'styled-components';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { trackEvent } from 'utils/analytics';
import LinkResolver from 'components/LinkResolver';
import { expandFontToken } from 'const/typography';
import COLORS from 'const/colors';
import { withTrailingSlash } from 'utils/helper';
import { FONTS } from 'const/fonts';

type FooterLinksSectionProps = {
  title: string;
  links: Array<{
    link_text: string;
    link_type: { url: string; target: string };
  }>;
  sliceLength?: number;
  sliceIndex?: number;
};

//TODO: remove right border using pure css and not index
const FooterLinksSectionWrapper = styled.div`
  color: ${COLORS.GRAY.G2};
  display: contents;

  .link-item {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)};
    margin: 0 0.75rem 0.75rem 0;
    text-decoration: none;
    color: ${COLORS.GRAY.G3};
    padding-right: 0.75rem;
    border-right: 0.063rem solid ${COLORS.GRAY.G6};
    :last-child {
      border-right: ${({ isLastSlice }) => isLastSlice && 'none'};
    }
  }
`;

const Title = styled.div`
  ${expandFontToken(FONTS.UI_LABEL_MEDIUM_HEAVY)};
  margin: 0 0.75rem 0.75rem 0;
`;

const FooterLinksSection: React.FC<FooterLinksSectionProps> = ({
  links,
  title,
  sliceLength,
  sliceIndex,
}) => {
  const onLinkClick = (e) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.QUICK_LINKS_CLICKED,
      [ANALYTICS_PROPERTIES.OPTION_TEXT]: e?.target?.innerText,
      [ANALYTICS_PROPERTIES.HEADER]: title,
    });
  };

  return (
    <FooterLinksSectionWrapper isLastSlice={sliceIndex === sliceLength - 1}>
      <Title>{title}:</Title>
      {links.map((link, index) => (
        <LinkResolver
          key={`${title?.toLowerCase()}_${index}`}
          className="link-item"
          url={withTrailingSlash(link?.link_type?.url)}
          onClick={onLinkClick}
        >
          {link.link_text}
        </LinkResolver>
      ))}
    </FooterLinksSectionWrapper>
  );
};

export default FooterLinksSection;
