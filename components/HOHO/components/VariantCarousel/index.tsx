import { useContext } from 'react';
import dynamic from 'next/dynamic';
import Conditional from 'components/common/Conditional';
import VariantCard from 'components/HOHO/components/VariantCard';
import { VariantCarouselProps } from 'components/HOHO/components/VariantCarousel/interface';
import { MBContext } from 'contexts/MBContext';
import { LANGUAGE_CODE_MAP } from 'const/index';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);

const SINGLE_LINE_CHAR_LIMIT = {
  DESKTOP: 30,
  MOBILE: 27,
};

const VariantCarousel: React.FC<VariantCarouselProps> = (props) => {
  const {
    isMobile,
    swiperParams,
    variants,
    tgid,
    tourGroupName,
    currency,
    isSingleVariant,
  } = props;
  const { lang } = useContext(MBContext);
  const finalVariants = variants?.filter(
    (variant: Record<string, any>) => variant?.listingPrice !== null
  );
  const characterLimit = isMobile
    ? SINGLE_LINE_CHAR_LIMIT.MOBILE
    : SINGLE_LINE_CHAR_LIMIT.DESKTOP;
  let showDummyScratchPrice = false;
  let maxDescriptors = 0;
  let maxHeadingLines = 1;

  finalVariants?.forEach((el: Record<string, any>) => {
    const { name, variantInfo } = el;
    const descriptorsArray = variantInfo?.split('- ')?.filter(Boolean);
    const sliceIndex = lang === LANGUAGE_CODE_MAP.EN ? -2 : undefined;

    const finalDescriptors = descriptorsArray
      ?.slice(0, sliceIndex)
      ?.slice(0, 6);
    if (finalDescriptors?.length > maxDescriptors)
      maxDescriptors = finalDescriptors?.length;

    const headingChar = name?.length;
    if (headingChar > characterLimit) {
      maxHeadingLines = 2;
    }
  });

  const VariantCards = finalVariants?.map(
    (el: Record<string, any>, index: number) => {
      const {
        id: variantId,
        name: variantName,
        listingPrice: variantListingPrice,
        variantInfo,
        tours,
      } = el;
      const { id: tourId } = tours?.[0] || {};
      let showDummyHeading = false;
      const { originalPrice, finalPrice } = variantListingPrice;
      if (originalPrice > finalPrice) showDummyScratchPrice = true;
      if (maxHeadingLines > 1 && variantName.length < characterLimit)
        showDummyHeading = true;
      const props = {
        variantId,
        variantName,
        variantListingPrice,
        variantInfo,
        isBestseller: index === 0 && !isSingleVariant,
        tgid,
        tourId,
        tourGroupName,
        index,
      };
      return (
        <VariantCard
          key={variantId}
          isMobile={isMobile}
          showDummyScratchPrice={showDummyScratchPrice}
          showDummyHeading={showDummyHeading}
          maxDescriptors={maxDescriptors}
          currency={currency}
          isSingleVariant={isSingleVariant}
          {...props}
        />
      );
    }
  );

  return (
    <>
      <Conditional if={!isMobile}>
        <Conditional if={!isSingleVariant}>
          <Swiper {...swiperParams}>{VariantCards}</Swiper>
        </Conditional>
        <Conditional if={isSingleVariant}>{VariantCards}</Conditional>
      </Conditional>

      <Conditional if={isMobile}>
        <Conditional if={!isSingleVariant}>
          <Swiper {...swiperParams}>{VariantCards}</Swiper>
        </Conditional>
        <Conditional if={isSingleVariant}>{VariantCards}</Conditional>
      </Conditional>
    </>
  );
};
export default VariantCarousel;
