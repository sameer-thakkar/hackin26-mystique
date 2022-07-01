import React, { useContext } from 'react';
import styled from 'styled-components';
import { MBContext } from 'contexts/MBContext';
import Button from 'UI/Button';
import Conditional from 'components/common/Conditional';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { PERCENTAGE } from 'assets/SvgIcons';
import { trackEvent } from 'utils/analytics';
import { getLocalisedPrice } from 'utils/currency';

const CTABlock = styled.div`
  .promo-code-block {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: repeat(2, auto);
    grid-gap: 4px 14px;
    width: 310px;
    padding: 8px 12px;
    color: ${COLORS.GRAY.G3};
    border: 1px dashed ${COLORS.GRAY.G6};
    border-radius: 4px;
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
    font-size: 14px;
    grid-row: 1 / 3;
    grid-column: 2 / 2;
    align-self: center;
    width: 90px;
    text-align: end;
  }
  .off {
    color: ${COLORS.GRAY.G3};
  }
  .promo-description {
    color: ${COLORS.GRAY.G3};
    display: flex;
    font-size: 12px;
    text-align: start;
    line-height: 16px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    grid-area: promo-block;
    margin-top: 0;
    .promo-code-block {
      width: 100%;
    }
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
  isTicketCard = false,
  tgid,
  host,
  collectionId,
}: {
  currentLanguage: string;
  isMobile: boolean;
  indexPosition: number;
  clickedPromo?: number;
  setClickedPromo: (e?: any) => void;
  finalPromoCode: any;
  onPromoClick: (e: any) => void;
  isTicketCard: boolean;
  tgid: number;
  host: string;
  collectionId: number | null;
}) => {
  const { currencySymbolMap } = useContext(MBContext);
  const currency = currencySymbolMap[Object.keys(currencySymbolMap)[0]];
  const { code: currencyCode } = currency ?? {};
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

  const trackCouponClick = (action) => {
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

  return (
    <>
      <Conditional if={promo_code}>
        <CTABlock isTicketCard={isTicketCard}>
          <Button
            className={`promo-code-block`}
            paddingSides={isMobile ? '16px' : '8px'}
            role="button"
            onClick={applyCode}
            tabIndex={0}
          >
            <div className="promo-contents">
              <div className="icon">{PERCENTAGE}</div>
              <div className="promo-code">{promo_code}</div>
            </div>
            <div className={`promo-cta ${isPromoApplied ? 'off' : ''}`}>
              {indexPosition === clickedPromo
                ? strings.PROMO_CODES.REMOVE
                : strings.PROMO_CODES.APPLY_CODE}
            </div>
            <div className="promo-description">{promoDescription}</div>
          </Button>
        </CTABlock>
      </Conditional>
    </>
  );
};

export default PromoCodeBlock;
