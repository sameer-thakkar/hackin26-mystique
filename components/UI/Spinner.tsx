import styled from 'styled-components';
import { HALYARD } from 'const/ui-constants';
import COLORS from 'const/colors';

const Wrapper = styled.div`
  width: max-content;
`;

const StyledSpinner = styled.div`
  margin: 0 auto;
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid ${COLORS.BRAND.PURPS};
  width: ${({ width }) => width || '2.1875rem'};
  height: ${({ height }) => height || '2.1875rem'};
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
  font-family: ${HALYARD.FONT_STACK};
  margin-top: 8px;
`;

const Spinner: React.FC<{
  children?: any;
  width?: string;
  height?: string;
}> = ({ children, width, height }) => {
  return (
    <Wrapper>
      <StyledSpinner width={width} height={height} />
      <Text>{children}</Text>
    </Wrapper>
  );
};

export default Spinner;
