import styled from 'styled-components';
import Reset from 'assets/reset';

type Props = {
  onClick?: () => void;
};

const StyledResetButton = styled.button`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;
  width: 2rem;
  background-color: white;
  border: none;
  z-index: 400;
  border-radius: 4px;
  top: 0.75rem;
  right: 0.75rem;
  box-shadow: 0px 4px 8px 0px #0000001f, 0px -1px 2px 0px #00000014;
  cursor: pointer;
`;

const ResetButton = ({ onClick }: Props) => {
  return (
    <StyledResetButton onClick={onClick}>
      <Reset />
    </StyledResetButton>
  );
};

export default ResetButton;
