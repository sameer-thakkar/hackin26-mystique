import styled from 'styled-components';
import { genUniqueId } from 'utils';
import { FONTS } from 'const/fonts';
import { expandFontToken } from 'const/typography';

const Content = styled.div`
  display: none;
  background: #fff;
  border-radius: 0.5rem;
  padding: 0.75rem;
  ${expandFontToken(FONTS.UI_LABEL_SMALL)}
`;
const Trigger = styled.label`
  display: flex;
  &:hover + input + ${Content}, & + input:focus + ${Content} {
    display: block;
  }
`;
const DummyInput = styled.input`
  // Dummy Input allows you to have Non-JS way
  // to create a toggleable element that has
  // click outside to toggle off ability.
  height: 0;
  width: 0;
  border: none;
`;
export const StyledTooltip = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 100%;
  display: grid;
  justify-items: right;
  .content {
    position: absolute;
    max-width: 200px;
    top: calc(100% + 1.5rem);
    right: 32px;
    transform: translateY(-50%);
    z-index: 1;
    font-size: 80%;
    z-index: 1;
  }
`;

const Tooltip = ({ trigger, content }: any) => {
  const uniqueId = genUniqueId();
  return (
    <StyledTooltip className="tooltip">
      {/* @ts-expect-error TS(2769): No overload matches this call. */}
      <Trigger className="trigger" role="button" for={uniqueId} tabindex={0}>
        {trigger}
      </Trigger>
      <DummyInput id={uniqueId} />
      <Content className="content">{content}</Content>
    </StyledTooltip>
  );
};

export default Tooltip;
