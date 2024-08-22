import dynamic from 'next/dynamic';
import {
  HeroIllustrationContainer,
  HeroSectionContainer,
  HeroText,
  MarginWrapper,
} from 'components/AirportTransfers/HeroSection/style';
import Conditional from 'components/common/Conditional';
import { DescriptorWrapper } from 'components/StaticBanner/styles';
import { getBannerDescriptorsArray } from 'components/StaticBanner/utils';
import Image from 'UI/Image';
import { strings } from 'const/strings';
import { swiperParams } from '.';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);

type TIllustrationBannerProps = {
  isMobile: boolean;
  cityName: string;
  bannerDescriptors: Array<{ icon: string; text: string }>;
  illustrationUrl: string;
};

export const IllustrationBanner = ({
  isMobile,
  cityName,
  bannerDescriptors,
  illustrationUrl,
}: TIllustrationBannerProps) => {
  return (
    <>
      <HeroSectionContainer>
        <MarginWrapper $hasSearchUnit={true} $isIllustrationBanner={true}>
          <HeroText $hasSearchUnit={true} $isIllustrationBanner={true}>
            {strings.formatString(strings.CRUISES.BANNER_HEADING, cityName)}
          </HeroText>
          <Conditional if={isMobile}>
            <HeroIllustrationContainer
              $hasSearchUnit={true}
              $noTabs={true}
              $isIllustrationBanner={true}
            >
              <Image
                url={illustrationUrl}
                alt="banner illustration"
                fill={true}
              />
            </HeroIllustrationContainer>
          </Conditional>
          <DescriptorWrapper>
            {isMobile && bannerDescriptors?.length ? (
              <Swiper {...swiperParams}>
                {getBannerDescriptorsArray(bannerDescriptors)}
              </Swiper>
            ) : (
              getBannerDescriptorsArray(bannerDescriptors)
            )}
          </DescriptorWrapper>
        </MarginWrapper>
        <Conditional if={!isMobile}>
          <HeroIllustrationContainer
            $hasSearchUnit={true}
            $noTabs={true}
            $isIllustrationBanner={true}
          >
            <Image
              url={illustrationUrl}
              alt="banner illustration"
              height={170}
              width={635}
            />
          </HeroIllustrationContainer>
        </Conditional>
      </HeroSectionContainer>
    </>
  );
};
