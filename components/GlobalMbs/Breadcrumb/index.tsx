import React from 'react';
import { BreadcrumbJsonLd } from 'next-seo';
import styled from 'styled-components';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { IBreadcrumb } from './interface';

const BreadcrumbContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  column-gap: 8px;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    display: none;
  }
`;
const StyledBreadcrumb = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  column-gap: 8px;
`;

const StyledLink = styled.a`
  display: block;
  text-decoration: none;
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: ${COLORS.GRAY.G3} !important;
`;
const StyledChevron = styled.div`
  transform: rotate(180deg);
  svg {
    width: 6px;
    height: 6px;
  }
`;

const Breadcrumb: React.FC<IBreadcrumb> = ({ links }) => {
  const itemListElements = links?.map((link, index: number) => {
    const { url: item, text: name } = link;
    const position = index + 1;
    return {
      position,
      name,
      item,
    };
  });
  return (
    <>
      <BreadcrumbContainer>
        {links?.map((link, index: number) => {
          const { url, text } = link;
          return (
            <StyledBreadcrumb key={index}>
              <StyledLink href={url}>{text}</StyledLink>
              {links.length - 1 !== index && (
                <StyledChevron>{CHEVRON_LEFT}</StyledChevron>
              )}
            </StyledBreadcrumb>
          );
        })}
      </BreadcrumbContainer>
      {itemListElements ? (
        <BreadcrumbJsonLd itemListElements={itemListElements} />
      ) : null}
    </>
  );
};

export default Breadcrumb;
