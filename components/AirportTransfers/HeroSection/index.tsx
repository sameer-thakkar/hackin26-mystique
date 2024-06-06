import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useRecoilState } from 'recoil';
import type { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import { DescriptorWrapper } from 'components/StaticBanner/styles';
import { getBannerDescriptorsArray } from 'components/StaticBanner/utils';
import Image from 'UI/Image';
import { hasPrivateAirportTransfers } from 'utils/airportTransfersUtils';
import {
  AIRPORT_TRANSFER_PRIMARY_SUBCATEGORY_ID,
  AT_HERO_ILLUSTRATION_IMG_URL,
} from 'const/airportTransfers';
import { SUB_CATEGORY_BANNER } from 'const/bannerDescriptors';
import { strings } from 'const/strings';
import { SearchUnit } from '../SearchUnit';
import { SearchResults } from '../SharedTransferSearchResults';
import { TAirportTransferHeroSectionProps } from './interface';
import { selectedSearchTabState } from './state';
import {
  HeroIllustrationContainer,
  HeroSectionContainer,
  HeroText,
  MarginWrapper,
} from './style';
import { getTravelModes } from './utils';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

const swiperParams: SwiperProps = {
  spaceBetween: 16,
  centeredSlides: true,
  speed: 5000,
  autoplay: {
    delay: 500,
    disableOnInteraction: false,
  },
  loop: true,
  preventInteractionOnTransition: true,
  allowTouchMove: false,
  slidesPerView: 'auto',
  slidesOffsetBefore: 90,
};

const ROTATE_ANIMATION_DURATION_MS = 3000;

export const AirportTransferHeroSection = ({
  isMobile,
  cityName,
  tours,
  tgidScorpioDataMap,
  shouldShowSearch,
}: TAirportTransferHeroSectionProps) => {
  const bannerDescriptors =
    SUB_CATEGORY_BANNER()[AIRPORT_TRANSFER_PRIMARY_SUBCATEGORY_ID];

  const hasPrivateTransfers = hasPrivateAirportTransfers(tours);

  const travelModesText = getTravelModes(strings, hasPrivateTransfers);

  const [selectedSearchTab, setSelectedSearchTab] = useRecoilState(
    selectedSearchTabState
  );

  useEffect(() => {
    if (
      Router?.query?.airport_transfer_type === 'private' &&
      hasPrivateTransfers
    ) {
      setSelectedSearchTab('PRIVATE_TAB');
    }
  }, [hasPrivateTransfers, setSelectedSearchTab]);

  useEffect(() => {
    let index = 0;
    const textElement = document.querySelector(
      '.travel-mode-text'
    ) as HTMLElement;

    if (!textElement) return;

    const changeText = () => {
      const text = travelModesText[index++ % travelModesText.length];
      textElement.textContent = text;
      textElement.style.animation = 'none'; // Reset animation
      void textElement.offsetHeight; // Trigger reflow
      textElement.style.animation = `rotate ${ROTATE_ANIMATION_DURATION_MS}ms  cubic-bezier(0.7, 0, 0.3, 1)  infinite`;
    };

    changeText(); // Initial text change

    const interval = setInterval(changeText, ROTATE_ANIMATION_DURATION_MS);

    return () => {
      clearInterval(interval);
      textElement.style.animation = '';
    };
  }, [travelModesText]);

  return (
    <>
      <HeroSectionContainer>
        <MarginWrapper $hasSearchUnit={shouldShowSearch}>
          <HeroText $hasSearchUnit={shouldShowSearch}>
            {strings.formatString(
              strings.AIRPORT_TRANSFER.EFFORT_LESS_AIRPORT_TRANSFERS,
              cityName
            )}{' '}
            <span className="relative">
              <span className="travel-mode-text">{travelModesText[0]}</span>
            </span>
          </HeroText>

          <Conditional if={shouldShowSearch}>
            <SearchUnit
              isMobile={isMobile}
              hasBothTransferTypes={hasPrivateTransfers}
              selectedTab={selectedSearchTab}
              setSelectedTab={setSelectedSearchTab}
            />
          </Conditional>

          <HeroIllustrationContainer
            $hasSearchUnit={shouldShowSearch}
            $noTabs={!hasPrivateTransfers}
          >
            <Image
              url={AT_HERO_ILLUSTRATION_IMG_URL}
              alt="Airport transfer illustration"
              height={isMobile ? 87 : 195}
              width={isMobile ? 370 : 698}
            />
          </HeroIllustrationContainer>

          <DescriptorWrapper>
            {isMobile && bannerDescriptors?.length ? (
              <Swiper {...swiperParams} speed={6000}>
                {getBannerDescriptorsArray(bannerDescriptors)}
              </Swiper>
            ) : (
              getBannerDescriptorsArray(bannerDescriptors)
            )}
          </DescriptorWrapper>
        </MarginWrapper>
      </HeroSectionContainer>

      <Conditional if={selectedSearchTab === 'SHARED_TAB'}>
        <SearchResults
          isMobile={isMobile}
          tours={tours}
          tgidScorpioDataMap={tgidScorpioDataMap}
        />
      </Conditional>
    </>
  );
};
