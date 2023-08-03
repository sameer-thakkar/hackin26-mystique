import styled from 'styled-components';
import COLORS from 'const/colors';

export const SmallListicleBox = styled.div<{
  overflow: boolean;
  isRichTextPresent: boolean;
}>`
  display: grid;
  grid-template-columns: 144px 220px;
  border: 1px solid ${COLORS.GRAY.G6};
  ${({ overflow, isRichTextPresent }) =>
    (overflow || !isRichTextPresent) && `grid-template-rows: 210px;`};
  border-radius: 8px;

  .cta-btn {
    color: ${COLORS.BRAND.PURPS};
    text-decoration: underline;
    margin: 0 0 0.625rem 0.625rem;
  }
  .cta-btn:hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    grid-template-columns: 144px 200px;
    ${({ overflow, isRichTextPresent }) =>
      (overflow || !isRichTextPresent) && `grid-template-rows: 200px;`}
  }
`;
