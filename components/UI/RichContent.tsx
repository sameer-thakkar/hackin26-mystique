import styled from 'styled-components';
import { asText } from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
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
  if (typeof render === 'object' && asText(render as []).trim().length === 0) {
    return null;
  }
  return (
    <StyledRichContent>
      <PrismicRichText
        field={render}
        components={disableShortcodes ? null : shortCodeSerializer}
      />
    </StyledRichContent>
  );
};

export default RichContent;
