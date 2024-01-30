import React from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Button from 'UI/Button';
import { trackEvent } from 'utils/analytics';
import { getLocalisedPrice } from 'utils/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import { FONTS } from 'const/fonts';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import CrossIconTicketCard from 'assets/crossIconTicketCard';
import InfoIconTicketCard from 'assets/infoIconTicketCard';

const CTABlock = styled.div<{ isTicketCardDetailPopup?: boolean }>`
  display: flex;
  border: 0.063rem dashed ${COLORS.GRAY.G6};
  border-radius: 4px;
  justify-content: space-between;
  padding: 0.04rem 0.375rem;
  align-items: center;
  .promo-code-block {
    padding: 0.25rem 0;
    border-style: none;
  }
  .promo-contents {
    display: grid;
    grid-template-columns: repeat(2, min-content);
    grid-gap: 4px;
  }
  .promo-code {
    color: ${COLORS.GRAY.G2};
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }
  .promo-cta {
    color: ${COLORS.TEXT.PURPS_3};
    grid-row: 1 / 3;
    grid-column: 2 / 2;
    align-self: center;
    text-align: end;
    ${expandFontToken(FONTS.BUTTON_SMALL)}
  }
  .off {
    color: ${COLORS.GRAY.G3};
  }
  .promo-description {
    color: ${COLORS.GRAY.G3};
    text-align: start;
    margin-right: 1.3rem;
    ${expandFontToken(FONTS.SUBHEADING_XS)}
  }
  .btn-container {
    display: flex;
    align-items: end;
  }

  @media (min-width: 768px) {
    ${({ isTicketCardDetailPopup }) =>
      isTicketCardDetailPopup && `width: 16rem;`}
  }

  @media (max-width: 768px) {
    grid-area: promo-block;
    margin-top: 0;
  }
`;

const CodeAppliedContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  .code-applied-text {
    color: ${COLORS.GRAY.G3};
    margin-right: 0.25rem;
  }
`;

const TooltipContainer = styled.div`
  margin-right: 0.3rem;
  position: relative;
  .tooltip-text {
    ${expandFontToken(FONTS.UI_LABEL_MEDIUM)}
    background-color: ${COLORS.BRAND.WHITE};
    color: ${COLORS.BLACK};
    visibility: hidden;
    position: absolute;
    top: 1.5rem;
    left: -10rem;
    border-radius: 8px;
    width: 15.875rem;
    padding: 1rem;
    box-shadow: 0px 0px 1px ${COLORS.GRAY.G7}, 0px 2px 8px ${COLORS.GRAY.G5};
    text-align: center;
  }
  :hover .tooltip-text {
    visibility: visible;
  }
`;

const PromoCodeBlock = ({
  currentLanguage = 'en',
  isMobile = false,
  indexPosition,
  clickedPromo,
  setClickedPromo,
  finalPromoCode,
  onPromoClick,
  tgid,
  host,
  isTicketCardDetailPopup,
  collectionId,
  currencyCode,
}: {
  currentLanguage: string;
  isMobile: boolean;
  indexPosition: number;
  clickedPromo?: number;
  setClickedPromo: (e?: any) => void;
  finalPromoCode: any;
  onPromoClick: (e: any) => void;
  tgid: number;
  host: string;
  collectionId: number | null;
  isTicketCardDetailPopup?: boolean;
  currencyCode: string;
}) => {
  const currencyList = useRecoilValue(currencyListAtom);

  const isPromoApplied = clickedPromo === indexPosition;
  const promo = finalPromoCode;
  const { promo_code, discount_percentage, absolute_discount, capped_value } =
    promo || {};

  let promoDescription;
  switch (true) {
    case discount_percentage > 0 && capped_value > 0:
      promoDescription = strings.formatString(
        strings.PROMO_CODES.DESCRIPTION.CAPPED,
        discount_percentage.toString(),
        getLocalisedPrice({
          price: capped_value,
          currencyCode,
          lang: currentLanguage,
          currencyList,
        })
      );
      break;

    case absolute_discount > 0:
      promoDescription = strings.formatString(
        strings.PROMO_CODES.DESCRIPTION.ABSOLUTE,
        getLocalisedPrice({
          price: absolute_discount,
          currencyCode,
          lang: currentLanguage,
          currencyList,
        })
      );
      break;

    case discount_percentage > 0 && !capped_value:
      promoDescription = strings.formatString(
        strings.PROMO_CODES.DESCRIPTION.PERCENTAGE,
        discount_percentage
      );
      break;

    default:
      promoDescription = '';
      break;
  }

  const trackCouponClick = (action: any) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.CONTENT_PAGE_PROMO_CLICKED,
      [ANALYTICS_PROPERTIES.MB_NAME]: host,
      [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.RANKING]: indexPosition + 1,
      [ANALYTICS_PROPERTIES.ACTION]: action,
    });
  };

  const applyCode = async () => {
    isPromoApplied
      ? (await setClickedPromo(),
        onPromoClick(null),
        trackCouponClick('Removed'))
      : (await setClickedPromo(indexPosition),
        onPromoClick(promo_code),
        trackCouponClick('Applied'));
  };

  const TooltipElm = () => {
    return (
      <TooltipContainer>
        <InfoIconTicketCard />
        <span className="tooltip-text">
          {strings.PROMO_CODES.TOOL_TIP_INFO}
        </span>
      </TooltipContainer>
    );
  };

  const CodeAppliedElement = () => {
    return (
      <CodeAppliedContainer>
        <span className="code-applied-text">{strings.PROMO_CODES.APPLIED}</span>
        <CrossIconTicketCard />
      </CodeAppliedContainer>
    );
  };

  return (
    <>
      <Conditional if={promo_code}>
        <CTABlock isTicketCardDetailPopup={isTicketCardDetailPopup}>
          <div className="promo-description">{promoDescription}</div>
          <div className="btn-container">
            {isPromoApplied && <TooltipElm />}
            <Button
              className={`promo-code-block`}
              paddingSides={isMobile ? '16px' : '8px'}
              role="button"
              onClick={applyCode}
              tabIndex={0}
            >
              <div className={`promo-cta ${isPromoApplied ? 'off' : ''}`}>
                {isPromoApplied ? (
                  <CodeAppliedElement />
                ) : (
                  strings.PROMO_CODES.APPLY_CODE
                )}
              </div>
            </Button>
          </div>
        </CTABlock>
      </Conditional>
    </>
  );
};

export default PromoCodeBlock;
