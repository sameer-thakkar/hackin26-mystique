import { SIZES } from 'const/ui-constants';
import styled from 'styled-components';
import InfoBanner from 'components/ShowPages/InfoBanner';
import Split, { StlyedSplit } from 'components/UI/Split';
import { titleCase } from 'utils/stringUtils';
import { greenScheme } from 'style/theme';
import COLORS from 'const/colors';

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
          title={titleCase(specialOffer.offerHeading)}
          description={specialOffer.offerText}
          colorScheme={greenScheme({ colorOverride: COLORS.GRAY.G2 })}
        />
      </Split>
    </Wrapper>
  );
};

export default SpecialOfferBanner;
