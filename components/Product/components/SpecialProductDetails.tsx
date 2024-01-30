import { SwiperProps } from 'swiper/react';
import SpecialProductDetailLabel from 'components/Product/components/SpecialProductDetailLabel';
import { SpecialProductDetailsWrapper } from 'components/Product/styles';
import SwiperWrapper from 'components/Swiper';
import { strings } from 'const/strings';
import EngagingStoriesIcon from 'assets/engagingStoriesIcon';
import LocalGuideIcon from 'assets/localGuideIcon';
import TopRatedIcon from 'assets/topRatedIcon';

const SpecialProductDetailLabelListDesktop = () => (
  <div className="special-product-details-labels">
    <SpecialProductDetailLabel
      icon={LocalGuideIcon}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.LOCAL_GUIDES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={EngagingStoriesIcon}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.ENGAGING_STORIES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={TopRatedIcon}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.TOP_RATED}
    />
  </div>
);

const swiperConfig: SwiperProps = {
  spaceBetween: 12,
  centeredSlides: true,
  speed: 3000,
  autoplay: {
    delay: 0,
    disableOnInteraction: true,
  },
  loop: true,
  slidesPerView: 'auto',
  allowTouchMove: false,
  createElements: true,
};

const SpecialProductDetailLabelListMobile = () => (
  <SwiperWrapper className="special-product-details-labels" {...swiperConfig}>
    <SpecialProductDetailLabel
      icon={LocalGuideIcon}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.LOCAL_GUIDES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={EngagingStoriesIcon}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.ENGAGING_STORIES}
    />
    <div className="special-product-details-separator" />
    <SpecialProductDetailLabel
      icon={TopRatedIcon}
      detail={strings.SPECIAL_PRODUCT_DESCRIPTORS.TOP_RATED}
    />
    <div className="special-product-details-separator" />
  </SwiperWrapper>
);

const SpecialProductDetails = ({
  isMobile,
  isOpeningAnimationComplete,
}: {
  isMobile: boolean;
  isOpeningAnimationComplete: boolean;
}) => (
  <SpecialProductDetailsWrapper
    $isOpeningAnimationComplete={isOpeningAnimationComplete}
  >
    <div className="special-product-header-wrapper">
      <div className="special-product-header">
        {strings.SPECIAL_PRODUCT_HEADING}
      </div>
    </div>
    <div className="special-product-header-separator" />
    {isMobile ? (
      <SpecialProductDetailLabelListMobile />
    ) : (
      <SpecialProductDetailLabelListDesktop />
    )}
  </SpecialProductDetailsWrapper>
);

export default SpecialProductDetails;
