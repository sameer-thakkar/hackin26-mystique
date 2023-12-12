import { useContext, useState } from 'react';
import { Button } from '@headout/aer';
import Conditional from 'components/common/Conditional';
import Calendar from 'components/HOHO/components/Calendar';
import { VariantCardProps } from 'components/HOHO/components/VariantCard/interface';
import {
  BadgeConnector,
  BadgeWrapper,
  CardContainer,
  Description,
  Name,
  PriceWrapper,
  SingleCardContainer,
  VariantCardWrapper,
} from 'components/HOHO/components/VariantCard/styles';
import HorizontalLine from 'components/slices/HorizontalLine';
import PriceBlock from 'UI/PriceBlock';
import { MBContext } from 'contexts/MBContext';
import { genUniqueId } from 'utils';
import { trackEvent } from 'utils/analytics';
import { truncate } from 'utils/helper';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  LANGUAGE_CODE_MAP,
} from 'const/index';
import { strings } from 'const/strings';
import {
  BADGE,
  LANDMARK_GRADIENT,
  MAP_GRADIENT,
  STAR,
  TickSvg,
  TRIANGLE,
} from 'assets/SvgIcons';

const formatVariantInfo = (
  desc: string | null,
  maxDescriptors: number,
  lang: string
) => {
  const descriptorsArray = desc?.split('- ')?.filter(Boolean);
  const sliceIndex = lang === LANGUAGE_CODE_MAP.EN ? -2 : undefined;
  const finalDescriptors =
    descriptorsArray?.slice(0, sliceIndex)?.slice(0, 6) || [];

  return desc?.includes('-') ? (
    <div className="desc-list">
      {descriptorsArray
        ?.slice(0, sliceIndex)
        ?.slice(0, 6)
        ?.map((line: string) => (
          <Conditional key={line} if={line}>
            <div className="item">
              <TickSvg strokeColor={COLORS.TEXT.OKAY_GREEN_3} />
              <span className="desc-text">{truncate(line, 36)}</span>
            </div>
          </Conditional>
        ))}
      {[...Array(maxDescriptors - finalDescriptors?.length)].map(() => (
        <div className="item no-show" key={genUniqueId()}>
          <span className="desc-text" />
        </div>
      ))}
    </div>
  ) : (
    <div className="desc-text">{desc}</div>
  );
};

const getAttractionsAndRouteInfo = (desc: string | null, lang: string) => {
  if (lang !== LANGUAGE_CODE_MAP.EN) {
    return null;
  } else {
    const descriptorsArray = desc?.split('- ')?.filter(Boolean);
    const lastDescriptors = descriptorsArray?.slice(-2);
    return (
      <>
        <HorizontalLine
          colorProp={COLORS.GRAY.G6}
          styleProp="dashed"
          className="horizontal-line"
        />
        <Description className="boosters">
          <div className="booster-info">
            {LANDMARK_GRADIENT}
            {truncate(lastDescriptors?.[0] || '', 36)}
          </div>
          <div className="booster-info">
            {MAP_GRADIENT}
            {truncate(lastDescriptors?.[1] || '', 36)}
          </div>
        </Description>
      </>
    );
  }
};

const VariantCard: React.FC<VariantCardProps> = (props) => {
  const {
    variantName,
    variantListingPrice,
    variantInfo,
    isBestseller,
    isMobile,
    variantId,
    showDummyScratchPrice,
    showDummyHeading,
    tgid,
    tourGroupName,
    tourId,
    currency,
    maxDescriptors,
    isSingleVariant,
    index,
  } = props;
  const [showCalendar, setShowCalendar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { lang } = useContext(MBContext);

  const onCTAClick = () => {
    setShowCalendar(true);
    setIsLoading(true);
    trackEvent({
      eventName: ANALYTICS_EVENTS.CHECK_AVAILABILITY_CLICKED,
      [ANALYTICS_PROPERTIES.VARIANT_ID]: variantId,
      [ANALYTICS_PROPERTIES.VARIANT_NAME]: variantName,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
      [ANALYTICS_PROPERTIES.EXPERIENCE_NAME]: tourGroupName,
      [ANALYTICS_PROPERTIES.POSITION]: index + 1,
    });
  };

  const getCardLayout = () => {
    return isSingleVariant && !isMobile ? (
      <SingleCardContainer>
        <div className="info-wrapper">
          <Name>{truncate(variantName, 60)}</Name>
          <Description className="inclusions">
            {formatVariantInfo(variantInfo, maxDescriptors, lang) || ''}
          </Description>

          {getAttractionsAndRouteInfo(variantInfo, lang)}
        </div>
        <div className="cta-wrapper">
          <PriceWrapper>
            <PriceBlock
              isMobile={isMobile}
              showScratchPrice
              listingPrice={variantListingPrice}
              lang={LANGUAGE_CODE_MAP.EN}
              showSavings
              prefix
              showDummyScratchPrice={showDummyScratchPrice}
            />
          </PriceWrapper>
          <div className="button-wrapper">
            <Button
              tabIndex={0}
              size="medium"
              color="purps"
              variant="primary"
              isLoading={isLoading}
              onClick={onCTAClick}
              text={strings.CHECK_AVAIL}
            />
          </div>
        </div>
      </SingleCardContainer>
    ) : (
      <CardContainer $isSingleVariant={isSingleVariant}>
        <div className="card">
          <Conditional if={isBestseller}>
            <BadgeWrapper className="star">
              {STAR(COLORS.BRAND.WHITE)}
            </BadgeWrapper>
            <BadgeWrapper>
              {BADGE(strings.HOHO.BESTSELLER.toUpperCase())}
            </BadgeWrapper>
            <BadgeConnector> {TRIANGLE}</BadgeConnector>
            <BadgeConnector className="right"> {TRIANGLE}</BadgeConnector>
          </Conditional>
          <VariantCardWrapper
            isSingleVariant={isSingleVariant}
            onClick={onCTAClick}
          >
            <Name>{truncate(variantName, 60)}</Name>
            <Conditional if={showDummyHeading}>
              <Name className="no-show"> &nbsp;</Name>
            </Conditional>
            <PriceWrapper>
              <PriceBlock
                isMobile={isMobile}
                showScratchPrice
                listingPrice={variantListingPrice}
                lang={LANGUAGE_CODE_MAP.EN}
                showSavings
                prefix
                showDummyScratchPrice={showDummyScratchPrice}
              />
            </PriceWrapper>
            <div className="button-wrapper">
              <Button
                tabIndex={0}
                size="medium"
                color="purps"
                variant="primary"
                isLoading={isLoading}
                onClick={onCTAClick}
                text={strings.HOHO.SELECT_DATE}
              />
            </div>
            <Description className="inclusions">
              {formatVariantInfo(variantInfo, maxDescriptors, lang) || ''}
            </Description>
            {getAttractionsAndRouteInfo(variantInfo, lang)}
          </VariantCardWrapper>
        </div>
      </CardContainer>
    );
  };

  return (
    <>
      {getCardLayout()}
      <Conditional if={showCalendar}>
        <Calendar
          variantId={variantId}
          tourId={tourId}
          tgid={tgid}
          variantName={variantName}
          tourGroupName={tourGroupName}
          isMobile={isMobile}
          isActive={showCalendar}
          onClickout={() => {
            setShowCalendar(false);
            trackEvent({
              eventName: ANALYTICS_EVENTS.HOHO.CALENDAR_CLOSED,
            });
          }}
          currency={currency}
          setIsLoading={setIsLoading}
        />
      </Conditional>
    </>
  );
};
export default VariantCard;
