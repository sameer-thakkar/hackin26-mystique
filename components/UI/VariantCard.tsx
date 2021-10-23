import styled from 'styled-components';
import Conditional from 'components/common/Conditional';
import LocalisedPrice from 'components/UI/LPrice';
import { COLORS, SOLEIL } from 'const/ui-constants';
import { strings } from 'const/strings';
import { addQueryParams } from 'utils/urlUtils';
import { ANALYTICS_EVENTS } from 'const/index';

const VariantCardWrapper = styled.div`
  width: 100%;
  height: inherit;
  display: grid;
  grid-template-rows: repeat(2, max-content) auto;
  background: ${COLORS.WHITE};
  border: 1px solid ${COLORS.GREY.G6};
  border-radius: 8px;
  padding: 14px 16px 16px;
  box-sizing: border-box;
  p {
    margin: 0;
    padding: 0;
  }
  a {
    text-decoration: none;
  }
`;

const Name = styled.div`
  margin-bottom: 20px;
`;

const PriceWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  justify-content: space-between;
`;

const From = styled.div`
  text-transform: lowercase;
  color: ${COLORS.GREY.G4};
  font-size: 10px;
  line-height: 12px;
`;

const Price = styled.div`
  display: grid;
  row-gap: 2px;
  .variant-price {
    color: ${COLORS.GREY.G2};
    font-weight: ${SOLEIL.SEMIBOLD};
    font-family: ${SOLEIL.FONT_STACK};
    font-size: 16px;
    line-height: 20px;
  }
`;

const Button = styled.div`
  padding: 7px 12px 5px;
  border: 1px solid ${COLORS.PURPS};
  border-radius: 4px;
  height: 28px;
  width: 65px;
  text-align: center;
  background-color: ${COLORS.WHITE};
  color: ${COLORS.PURPS};
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.PURPS};
    color: ${COLORS.WHITE};
    border: none;
  }
`;

const Description = styled.div`
  border-top: 1px solid ${COLORS.GREY.G7};
  border-radius: 0 0 7px 7px;
  padding-top: 16px;
  margin-top: 16px;
  .desc-list {
    list-style: initial;
    padding-left: 1.6rem;
  }

  .desc-text {
    white-space: pre-line;
    color: ${COLORS.GREY.G2};
  }
`;

const formatDescription = (desc) =>
  desc?.includes('- ') ? (
    <ul className="desc-list">
      {desc?.split('- ')?.map((line) => (
        <Conditional key={line} if={line}>
          <li className="desc-text">{line}</li>
        </Conditional>
      ))}
    </ul>
  ) : (
    <div className="desc-text">{desc}</div>
  );

const VariantCard = ({
  currencySymbol,
  variantPrice,
  variantId,
  variantName,
  variantInfo,
  language,
  bookingUrl,
  analytics,
  tgid,
  hostname,
  isMobile,
}) => {
  const bookUrl = addQueryParams(bookingUrl, {
    variantId,
  });
  const trackVariantSelection = () => {
    analytics.setVariableInDataLayer({
      event: ANALYTICS_EVENTS.COMBO_VARIANT.VARIANT_CLICKED,
      'MB name': hostname,
      'Variant ID': variantId,
      TGID: tgid,
      Device: isMobile ? 'Mweb' : 'Desktop',
    });
  };
  return (
    <VariantCardWrapper>
      <Name>{variantName}</Name>
      <PriceWrapper>
        <Price>
          <From>{strings.FROM}</From>
          <LocalisedPrice
            {...{
              price: variantPrice,
              currencySymbol,
              lang: language,
              className: 'variant-price',
            }}
          />
        </Price>
        <a href={bookUrl} target="_blank" rel="noopener noreferrer">
          <Button onClick={trackVariantSelection}>
            {strings.COMBO_VARIANT.SELECT_CTA}
          </Button>
        </a>
      </PriceWrapper>
      <Description>{formatDescription(variantInfo) || ''}</Description>
    </VariantCardWrapper>
  );
};
export default VariantCard;
