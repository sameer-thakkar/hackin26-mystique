import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import { MBContext } from 'contexts/MBContext';
import { metaAtom } from 'store/atoms/meta';
import Conditional from 'components/common/Conditional';
import { Descriptors } from 'components/Product';
import Carousel from 'components/UI/Carousel';
import VariantCard, { VariantCardSkeleton } from 'components/UI/VariantCard';
import { BLACK_COLOR_CLOSE } from 'assets/SvgIcons';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { HALYARD } from 'const/ui-constants';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getHostName } from 'utils/helper';

const PopupWrapper = styled.div`
  z-index: 16;
  width: 100vw;
  height: 100%;
  position: fixed;
  background: ${COLORS.BRAND.WHITE};
  top: 0;
  left: 0;
  display: grid;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  overflow: auto;
  @media (max-width: 768px) {
    position: initial;
    justify-content: unset;
    align-items: unset;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;
const PopupContentWrapper = styled.div`
  max-width: 1200px;
  width: calc(100vw - (5.46vw * 2));
  height: 100%;
  position: relative;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CloseIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  align-items: center;
  background: ${COLORS.GRAY.G8};
  top: 0;
  right: 0;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
  }
`;
const ProductCard = styled.div`
  padding-top: 32px;
  padding-bottom: 72px;
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
  grid-template-columns: 1fr;
  gap: 60px;
  @media (max-width: 768px) {
    gap: 48px;
    padding-top: 0;
  }
`;
const ProductInfo = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
  gap: 16px;
`;
const ProductTitleWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: max-content;
  gap: 4px;
`;

const ProductTitle = styled.div`
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  color: ${COLORS.GRAY.G2};
  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 24px;
  }
`;
const L1Booster = styled.div`
  text-transform: uppercase;
  font-family: ${HALYARD.FONT_STACK};
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: ${COLORS.GRAY.G2};
  background-color: ${COLORS.JOY_MUSTARD.LIGHT_TONE_2};
  padding: 3px 6px 1px;
  width: max-content;
`;
const StyledVariantsWrapper = styled.div`
  display: grid;
  grid-template-rows: repeat(2, max-content);
  gap: 24px;
  h3 {
    font-family: ${HALYARD.FONT_STACK};
    font-weight: 600;
    font-size: 21px;
    line-height: 28px;
    color: ${COLORS.GRAY.G2};
    margin: 0;
    @media (max-width: 768px) {
      font-size: 16px;
      line-height: 20px;
    }
  }
`;

const VariantCardSkeletonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: unset;
    column-gap: unset;
    grid-template-rows: repeat(4, 1fr);
  }
`;

type ComboPopupType = {
  productTitle: string;
  l1Booster: string;
  tgid: string | number;
  isMobile: boolean;
  closeHandler: () => void;
  descriptors: string[];
  bookingUrl: string;
  minDuration: number;
  maxDuration: number;
};
const ComboPopup = ({
  productTitle,
  l1Booster,
  tgid,
  isMobile,
  closeHandler,
  descriptors,
  bookingUrl,
  minDuration,
  maxDuration,
}: ComboPopupType) => {
  const { lang, host, isDev, isStage } = useContext(MBContext);
  const hostname = getHostName(isStage, isDev, host);
  const pageMetaData = useRecoilValue(metaAtom);

  const params = {
    ...(lang && {
      language: lang,
    }),
  };

  const tourGroupEndpoint = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.TourGroupsV6,
    id: tgid,
    hostname,
    params,
  });
  // @ts-expect-error TS(2345): Argument of type '[string | undefined, { fetcher: ... Remove this comment to see the full error message
  const { data: tourGroupData, error } = useSWR(tourGroupEndpoint, {
    fetcher: swrFetcher,
  });
  const { variants } = tourGroupData ?? {};
  useEffect(() => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.COMBO_VARIANT.POPUP_VIEWED,
      [ANALYTICS_PROPERTIES.MB_NAME]: hostname,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.PAGE_TYPE]: pageMetaData?.pageType,
    });
  }, []);

  const variantMarkup = variants?.map((variant: any) => {
    const {
      id: variantId,
      name: variantName,
      listingPrice: variantListingPrice,
      variantInfo,
    } = variant || {};
    const props = {
      variantId,
      variantName,
      variantListingPrice,
      variantInfo,
      currencyCode: variantListingPrice?.currencyCode,
      language: lang,
      bookingUrl,
      hostname,
      tgid,
      isMobile,
    };
    return (
      <Conditional if={variantListingPrice} key={variantId}>
        <div className="swiper-slide">
          <VariantCard {...props} />
        </div>
      </Conditional>
    );
  });

  return (
    // @ts-expect-error TS(2769): No overload matches this call.
    <PopupWrapper isMobile={isMobile}>
      <PopupContentWrapper>
        <ProductCard>
          <ProductInfo>
            <ProductTitleWrapper>
              <Conditional if={l1Booster}>
                <L1Booster>{l1Booster}</L1Booster>
              </Conditional>
              <ProductTitle>{productTitle}</ProductTitle>
            </ProductTitleWrapper>
            <Conditional if={!isMobile}>
              <Descriptors
                descriptorArray={descriptors}
                horizontal={true}
                minDuration={minDuration}
                maxDuration={maxDuration}
                lang={lang}
              />
            </Conditional>
          </ProductInfo>
          <StyledVariantsWrapper>
            <h3>{strings.COMBO_VARIANT.SELECT_OPTION}</h3>
            <Conditional if={!tourGroupData}>
              <VariantCardSkeletonWrapper>
                <VariantCardSkeleton isMobile={isMobile} />
                <VariantCardSkeleton isMobile={isMobile} />
                <VariantCardSkeleton isMobile={isMobile} />
              </VariantCardSkeletonWrapper>
            </Conditional>
            <Conditional if={tourGroupData}>
              <Conditional if={!isMobile && !error && variants?.length > 1}>
                {/* @ts-expect-error TS(2786): 'Carousel' cannot be used as a JSX component. */}
                <Carousel cardsInARow={4} columnGap={24}>
                  {variantMarkup}
                </Carousel>
              </Conditional>
              <Conditional if={isMobile && !error && variants?.length > 1}>
                {variantMarkup}
              </Conditional>
            </Conditional>
          </StyledVariantsWrapper>
        </ProductCard>
        <Conditional if={!isMobile}>
          <CloseIconWrapper onClick={closeHandler}>
            {BLACK_COLOR_CLOSE}
          </CloseIconWrapper>
        </Conditional>
      </PopupContentWrapper>
    </PopupWrapper>
  );
};

export default ComboPopup;
