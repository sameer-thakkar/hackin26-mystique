import styled from 'styled-components';
import { COLORS, AVENIR } from '../../constants/ui-constants';

const Wrapper = styled.div`
  width: max-content;
`;

const StyledSpinner = styled.div`
  margin: 0 auto;
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid ${COLORS.RHAPSODY};
  width: 35px;
  height: 35px;
  -webkit-animation: spin 1s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
  /* Safari */
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Text = styled.div`
  font-size: 18px;
  font-family: ${AVENIR.FONT_STACK};
  margin-top: 8px;
`;

const Spinner: React.FC<{ children: any }> = ({ children }) => {
  return (
    <Wrapper>
      <StyledSpinner />
      <Text>{children}</Text>
    </Wrapper>
  );
};

export default Spinner;
