import React, { Component } from 'react';
import styled from 'styled-components';
import LinkResolver from '../LinkResolver';
import { GRAPHIK, COLORS } from '../../constants/ui-constants';

type TitleLinksProps = {
  title: string;
  links: Array<any>;
};

const StyledLinksCard = styled.div`
  display: grid;
  align-items: start;
  grid-template-rows: max-content max-content;
  font-family: ${GRAPHIK.FONT_STACK};
  color: ${COLORS.DAVY_GREY};
  .link-item {
    color: ${COLORS.BEACH};
    text-decoration: none;
    margin-top: 12px;
    :last-child {
      margin-bottom: 0;
    }
  }
`;

const StyledLinksTitle = styled.div`
  font-size: 14px;
  font-weight: ${GRAPHIK.SEMIBOLD};
  margin-bottom: 4px;
`;

const StyledLinksList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
`;

export default class TitleLinksCard extends Component<TitleLinksProps, any> {
  render() {
    const { links, title } = this.props;
    return (
      <StyledLinksCard>
        <StyledLinksTitle>{title}</StyledLinksTitle>
        <StyledLinksList>
          {links.map((link, index) => (
            <LinkResolver
              key={index}
              className="link-item"
              url={link.link_type.url}
            >
              {link.link_text}
            </LinkResolver>
          ))}
        </StyledLinksList>
      </StyledLinksCard>
    );
  }
}
