import styled from 'styled-components';
import { CHEVRON_LEFT } from 'assets/SvgIcons';
import { COLORS, SOLEIL } from 'const/ui-constants';

const BreadcrumbContainer = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  column-gap: 8px;
  margin-top: 80px;
  @media (max-width: 768px) {
    margin-top: 64px;
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
  font-weight: normal;
  color: ${COLORS.GREY.G4} !important;
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;
const StyledChevron = styled.div`
  transform: rotate(180deg);
  svg {
    width: 6px;
    height: 6px;
  }
`;

const Breadcrumb = ({ links }) => {
  return (
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
  );
};

export default Breadcrumb;
