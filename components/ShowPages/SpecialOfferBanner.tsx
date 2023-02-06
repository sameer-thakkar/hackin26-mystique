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
    margin-top: ${({    
 // @ts-expect-error TS(2339): Property 'marginTop' does not exist on type 'Pick<... Remove this comment to see the full error message
 marginTop }) => (marginTop ? marginTop : 0)}px;
  }
  @media (max-width: 768px) {
    ${StlyedSplit} {
      margin-bottom: 48px;
    }
  }
`;

const SpecialOfferBanner = ({
  // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'number'.
  marginTop = null,
  specialOffer = {},
}: {
  specialOffer: { [key: string]: string };
  marginTop?: number;
  isShowPage?: boolean;
}) => {
  return (
    // @ts-expect-error TS(2769): No overload matches this call.
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
