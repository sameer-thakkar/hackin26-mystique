import { SIZES } from 'const/ui-constants';
import styled from 'styled-components';
import { greyScheme } from 'style/theme';

import InfoBanner from './InfoBanner';
import Split, { StlyedSplit } from '../UI/Split';

const Wrapper = styled.div`
  max-width: ${SIZES.MAX_WIDTH};
  margin: auto;
  width: 100%;
  ${StlyedSplit} {
    margin-top: ${({ marginTop }) => (marginTop ? marginTop : 0)}px;
  }
  @media (max-width: 768px) {
    ${StlyedSplit} {
      margin-bottom: 48px;
    }
  }
`;

const SpecialOfferBanner = ({
  marginTop = null,
  specialOffer = {},
}: {
  specialOffer: { [key: string]: string };
  marginTop?: number;
  isShowPage?: boolean;
}) => {
  return (
    <Wrapper marginTop={marginTop}>
      <Split mobileLayout={'scroll'} count={1}>
        <InfoBanner
          title={specialOffer.offerHeading}
          description={specialOffer.offerText}
          colorScheme={greyScheme}
        />
      </Split>
    </Wrapper>
  );
};

export default SpecialOfferBanner;
