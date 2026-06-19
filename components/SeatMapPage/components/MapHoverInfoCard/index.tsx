import { THEATRE_TYPES } from 'const/index';
import { IconWrapper } from '../InteractiveMap/styles';
import { TMapHoverInfoCardParams } from './interface';
import {
  Body,
  FlashDealBanner,
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
}: TMapHoverInfoCardParams) => {
  const metaLabel = flashDealSeatsLeft != null
    ? `${flashDealSeatsLeft} seat${flashDealSeatsLeft !== 1 ? 's' : ''} left · ${flashDealDiscount}`
    : flashDealDiscount;

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
