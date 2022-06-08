import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from 'utils/shortCodes';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';

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

const RichContent = ({ render, disableShortcodes = false }) => {
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
