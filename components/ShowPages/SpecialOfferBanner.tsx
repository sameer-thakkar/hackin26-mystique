import styled from 'styled-components';
import { greenScheme } from 'style/theme';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import InfoBanner from 'components/ShowPages/InfoBanner';
import Split, { StlyedSplit } from 'components/UI/Split';
import { titleCase } from 'utils/stringUtils';
import COLORS from 'const/colors';
import { SIZES } from 'const/ui-constants';

const Wrapper = styled.div`
  max-width: ${SIZES.MAX_WIDTH};
  margin: auto;
  width: 100%;
  ${StlyedSplit} {
    margin-top: ${({
      // @ts-expect-error TS(2339): Property 'marginTop' does not exist on type 'Pick<... Remove this comment to see the full error message
      marginTop,
    }) => (marginTop ? marginTop : 0)}px;
  }
  @media (max-width: 768px) {
    ${StlyedSplit} {
      margin-bottom: 48px;
    }
  }
`;

export const SpecialOfferBanner = ({
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

export const LondonCallingSaleBanner = ({
  saleName,
  saleDescription,
}: {
  saleName: string;
  saleDescription: string;
}) => {
  return (
    <section
      id="london-calling-sale-banner"
      className={css({
        backgroundColor: 'core.purps.20',
        borderRadius: 'radius.8',
        padding: 'space.12',
        display: 'flex',
        flexDirection: 'column',
        gap: 'space.4',
        width: '100%',
        boxSizing: 'border-box',
        '@media (min-width: 768px)': {
          maxWidth: '44.625rem',
          padding: 'space.16',
        },
      })}
    >
      <Text
        as="h1"
        textStyle="Semantics/Heading/Small"
        color="transparent"
        className={css({
          background:
            'radial-gradient(50% 50% at 50% 50%, #C15CF8 0%, #7F33A8 100%)',
          backgroundClip: 'text' as any,
        })}
      >
        {saleName}
      </Text>
      <Text color="core.grey.800" textStyle="Semantics/Para/Small">
        {saleDescription}
      </Text>
    </section>
  );
};

export const LondonCallingSaleBottomStrip = ({
  saleName,
  saleDescountDesc,
}: {
  saleName: string;
  saleDescountDesc: string;
}) => {
  return (
    <div
      className={css({
        backgroundColor: 'core.purps.20',
        padding: '0.625rem 1.5rem',
        margin: '-0.75rem -1.5rem 0.875rem',
        display: 'flex',
        alignItems: 'center',
        maxHeight: '16px',
      })}
      role="button"
      tabIndex={0}
    >
      <Text
        as="h1"
        textStyle="Semantics/Heading/Small"
        color="transparent"
        className={css({
          background:
            'radial-gradient(50% 50% at 50% 50%, #C15CF8 0%, #7F33A8 100%)',
          backgroundClip: 'text' as any,
          fontWeight: '500 !important',
          overflow: 'visible',
        })}
      >
        {saleName}
      </Text>
      <div
        className={css({
          marginLeft: 'space.6',
          marginRight: 'space.6',
          height: '0.875rem',
          width: '1px',
          backgroundColor: '#0000000F',
        })}
      />
      <Text
        color="semantic.text.black.translucent"
        textStyle="Semantics/UI Label/Regular (Heavy)"
      >
        {saleDescountDesc}
      </Text>
    </div>
  );
};
