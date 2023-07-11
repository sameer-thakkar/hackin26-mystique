// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import styled from 'styled-components';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';

export const StyledRichContent = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  line-height: 1.6;
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    h2 {
      font-size: 16px;
    }
  }
`;

const RichContent = ({ render, disableShortcodes = false }: any) => {
  if (
    typeof render === 'object' &&
    RichText.asText(render).trim().length === 0
  ) {
    return null;
  }
  return (
    <StyledRichContent>
      <RichText
        render={render}
        htmlSerializer={disableShortcodes ? null : shortCodeSerializer}
      />
    </StyledRichContent>
  );
};

export default RichContent;
