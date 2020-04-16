import styled from 'styled-components';
import { COLORS } from '../../constants/ui-constants';

const StyledLine = styled.div`
  border-bottom: 1px solid;
  border-color: ${({ color }) => color};
`;

const HorizontalLine = (props) => {
  return <StyledLine color={props.color || COLORS.CHALK} />;
};

export default HorizontalLine;
