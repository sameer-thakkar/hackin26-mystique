import styled from 'styled-components';
import COLORS from 'const/colors';
import { SIZES } from 'const/ui-constants';
import Conditional from './common/Conditional';

const Banner = styled.div`
  padding: 40px 0;
  background: ${({ theme: { primaryBackground } }) =>
    primaryBackground ? primaryBackground : COLORS.BRAND.WHITE};
  margin-bottom: 48px;
  &:empty {
    padding: 0;
    background: none;
  }
  h1 {
    color: ${({ theme: { primaryBGColor } }) =>
      primaryBGColor ? primaryBGColor : COLORS.BRAND.WHITE};
    margin: 0;
    font-size: 24px;
    max-width: 420px;
  }
  @media (max-width: 768px) {
    padding: 40px 16px;
    h1 {
      font-weight: 500;
      font-size: 20px;
      line-height: 120%;
    }
  }
`;

const Wrapper = styled.div`
  max-width: ${SIZES.MAX_WIDTH};
  margin: 0 auto;
`;

const TextBanner = ({ bannerHeading }: any) => {
  return (
    <Banner>
      <Conditional if={!!bannerHeading}>
        <Wrapper>
          <h1>{bannerHeading}</h1>
        </Wrapper>
      </Conditional>
    </Banner>
  );
};

export default TextBanner;
