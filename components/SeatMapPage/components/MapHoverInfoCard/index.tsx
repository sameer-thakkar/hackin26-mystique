import { THEATRE_TYPES } from 'const/index';
import { IconWrapper } from '../InteractiveMap/styles';
import { TMapHoverInfoCardParams } from './interface';
import {
  Body,
  FlashDealBanner,
  FlashDealCard,
  FlashDealCardCTA,
  FlashDealCardFlashPrice,
  FlashDealCardHeader,
  FlashDealCardHeaderText,
  FlashDealCardOriginalPrice,
  FlashDealCardPricingRow,
  FlashDealCardSavingsBadge,
  FlashDealCardSeatLabel,
  FlashDealMeta,
  FlashDealTitle,
  Header,
  HeaderLeft,
  HeaderRight,
  HR,
  MapSectionInfoCard,
  MapSectionInfoCardContainer,
  P,
  QuickInfo,
} from './styles';

const MapHoverInfoCard = ({
  sectionInfo,
  left,
  top,
  isVisible,
  theatreType,
  isFlashDeal = false,
  flashDealDiscount = '20% off',
  flashDealSeatsLeft,
  flashDealOriginalPrice = '£100',
  flashDealPrice = '£80',
  flashDealSavings = 'Save £20',
}: TMapHoverInfoCardParams) => {
  const metaLabel = flashDealSeatsLeft != null
    ? `${flashDealSeatsLeft} seat${flashDealSeatsLeft !== 1 ? 's' : ''} left · ${flashDealDiscount}`
    : flashDealDiscount;

  if (isFlashDeal) {
    return (
      <MapSectionInfoCardContainer left={left} top={top} isVisible={isVisible}>
        <FlashDealCard>
          <FlashDealCardHeader>
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="#F59E0B"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <FlashDealCardHeaderText>Flash Deal</FlashDealCardHeaderText>
          </FlashDealCardHeader>

          <FlashDealCardSeatLabel>
            {sectionInfo?.theatreSectionLabel}
          </FlashDealCardSeatLabel>

          <FlashDealCardPricingRow>
            <FlashDealCardOriginalPrice>
              {flashDealOriginalPrice}
            </FlashDealCardOriginalPrice>
            <FlashDealCardFlashPrice>{flashDealPrice}</FlashDealCardFlashPrice>
            <FlashDealCardSavingsBadge>{flashDealSavings}</FlashDealCardSavingsBadge>
          </FlashDealCardPricingRow>

          <FlashDealCardCTA>Select this seat</FlashDealCardCTA>
        </FlashDealCard>
      </MapSectionInfoCardContainer>
    );
  }

  return (
    <MapSectionInfoCardContainer left={left} top={top} isVisible={isVisible}>
      <MapSectionInfoCard>
        {isFlashDeal && (
          <FlashDealBanner>
            <FlashDealTitle>⚡ Flash Deal</FlashDealTitle>
            <FlashDealMeta>{metaLabel}</FlashDealMeta>
          </FlashDealBanner>
        )}

        <Header style={isFlashDeal ? { borderRadius: 0 } : undefined}>
          <HeaderLeft style={isFlashDeal ? { borderTopLeftRadius: 0 } : undefined}>
            {theatreType !== THEATRE_TYPES.ABBA_ARENA
              ? `${sectionInfo?.theatreSectionLabel}`
              : `${sectionInfo?.blockName} - ${sectionInfo?.theatreSectionLabel}`}
          </HeaderLeft>
          <HeaderRight style={isFlashDeal ? { borderTopRightRadius: 0 } : undefined}>
            {sectionInfo?.rows}
          </HeaderRight>
        </Header>

        <Body>
          {sectionInfo?.quickInfo.map((info, index) => (
            <QuickInfo key={index}>
              <IconWrapper>
                <info.icon />
              </IconWrapper>

              <P>{info.label}</P>
            </QuickInfo>
          ))}

          <HR />

          <P>{sectionInfo?.description}</P>
        </Body>
      </MapSectionInfoCard>
    </MapSectionInfoCardContainer>
  );
};

export default MapHoverInfoCard;
