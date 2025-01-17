import { useEffect, useState } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import Conditional from 'components/common/Conditional';
import TrustBooster from 'components/MicrositeV2/BannerV2TrustBooster';
import { TCategoryPageBannerProps } from 'components/MicrositeV2/CategoryPageBanner/interface';
import {
  BannerContent,
  Container,
  Gradient,
  ImageContainer,
  Separator,
  Wrapper,
} from 'components/MicrositeV2/CategoryPageBanner/styles';
import Image from 'UI/Image';

const CategoryPageBanner: React.FC<
  React.PropsWithChildren<TCategoryPageBannerProps>
> = ({
  heading,
  bannerImgUrl,
  isMobile,
  breadcrumbs = {},
  isMonthOnMonthPage = false,
  showTrustBoosters = true,
  trustBoosters = [],
  isEntertainmentBanner = false,
}) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!window) return;
    const scrollHandler = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      // Remove the scroll event listener when the component unmounts
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return (
    <Wrapper
      hasScrolled={hasScrolled}
      $isMonthOnMonthPage={isMonthOnMonthPage}
      $hasBannerImage={!!bannerImgUrl}
    >
      <Container>
        <Conditional if={Object.keys(breadcrumbs).length}>
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            isMobile={isMobile}
            isCategoryPage
          />
        </Conditional>
        <BannerContent>
          <h1>{heading}</h1>
          <Conditional if={bannerImgUrl}>
            <ImageContainer>
              <Image
                url={bannerImgUrl}
                width={isMobile ? 155 : 555}
                height={isMobile ? 56 : 156}
                alt={`${heading} Illustration`}
              />
              <Gradient hasScrolled={hasScrolled} />
            </ImageContainer>
          </Conditional>
        </BannerContent>
        <Separator />
      </Container>
      <Conditional if={showTrustBoosters}>
        <TrustBooster
          isMobile={isMobile}
          trustBoosters={trustBoosters}
          isEntertainmentBanner={isEntertainmentBanner}
        />
      </Conditional>
    </Wrapper>
  );
};

export default CategoryPageBanner;
