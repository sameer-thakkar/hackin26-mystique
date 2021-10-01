import styled from 'styled-components';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { BreadcrumbJsonLd } from 'next-seo';

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
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.REGULAR};
  font-size: 14px;
  line-height: 16px;
  color: ${COLORS.GREY.G4} !important;
`;
const StyledChevron = styled.div`
  transform: rotate(180deg);
  svg {
    width: 6px;
    height: 6px;
  }
`;

const Breadcrumb = ({ links }) => {
  const itemListElements = links?.map((link, index) => {
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
        {links.map((link, index) => {
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
      <BreadcrumbJsonLd itemListElements={itemListElements} />
    </>
  );
};

export default Breadcrumb;
