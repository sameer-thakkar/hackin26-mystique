import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { COLORS } from '../../constants/ui-constants';

const StyledRichContent = styled.div`
  font-family: 'Graphik', 'Proxima Nova', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  line-height: 1.6;
  color: ${COLORS.FOUR_BLACK};
`;

const RichContent = ({ render, disableShortcodes = false }) => {
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
