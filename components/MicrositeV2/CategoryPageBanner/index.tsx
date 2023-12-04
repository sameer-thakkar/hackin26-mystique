import { useEffect, useState } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
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

const CategoryPageBanner: React.FC<TCategoryPageBannerProps> = ({
  heading,
  bannerImgUrl,
  isMobile,
  breadcrumbs,
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
    <Wrapper hasScrolled={hasScrolled}>
      <Container>
        <Breadcrumbs
          breadcrumbs={breadcrumbs}
          isMobile={isMobile}
          isCategoryPage
        />
        <BannerContent>
          <h1>{heading}</h1>
          <ImageContainer>
            <Image
              url={bannerImgUrl}
              width={isMobile ? 155 : 555}
              height={isMobile ? 56 : 156}
              alt={`${heading} Illustration`}
            />
            <Gradient hasScrolled={hasScrolled} />
          </ImageContainer>
        </BannerContent>
        <Separator />
      </Container>
      <TrustBooster isMobile={isMobile} />
    </Wrapper>
  );
};

export default CategoryPageBanner;
