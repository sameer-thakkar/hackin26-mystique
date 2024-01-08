import React, { useContext, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import VerticalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard';
import { TSimilarShowsProps } from 'components/MicrositeV2/LttShowPageV2/SimilarShows/interface';
import {
  SimilarShowsWrapper,
  TitleRow,
} from 'components/MicrositeV2/LttShowPageV2/SimilarShows/style';
import { MBContext } from 'contexts/MBContext';
import { getHeadoutLanguagecode } from 'utils';
import { trackEvent } from 'utils/analytics';
import { fetchMediaResource, fetchTourGroupsByCategory } from 'utils/apiUtils';
import { currencyAtom } from 'store/atoms/currency';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT } from 'assets/SvgIcons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);
const SimilarShows = ({
  tgid,
  primarySubCategoryID,
  cityCode,
  isMobile,
  allShowPagesDocuments,
}: TSimilarShowsProps) => {
  const [similarProductData, setSimilarProductData] = useState([]);
  const { lang } = useContext(MBContext);
  const currency = useRecoilValue(currencyAtom);
  const similarShowsRef = useRef(null);

  useEffect(() => {
    const fetchSimilarShows = async () => {
      const data =
        (await fetchTourGroupsByCategory({
          categoryId: primarySubCategoryID,
          isSubCategory: true,
          city: cityCode,
          language: lang,
          limit: '100',
          currency: currency ?? '',
        })) ?? {};

      const { pageData } = data;

      const filteredData = pageData?.items?.filter(
        (element: any) => element.id !== tgid
      );
      if (filteredData?.length) {
        const verticalImagesDataMap = new Map<string, any>();
        const mediaData = await fetchMediaResource({
          language: getHeadoutLanguagecode(lang),
          entityIds: filteredData
            .map((product: Record<string, any>) => product.id)
            .join(','),
          resourceType: 'MB_EXPERIENCE',
        });
        mediaData?.resourceEntityMedias?.forEach((resource) => {
          const verticalImageData = resource.medias.find(
            (media) => media.type === 'IMAGE'
          );
          if (verticalImageData) {
            verticalImagesDataMap.set(
              resource.resourceEntityId,

              {
                url: verticalImageData.url,
                height: verticalImageData.metadata.height,
                width: verticalImageData.metadata.width,
                altText: verticalImageData.metadata.altText,
              }
            );
          }
        });
        setSimilarProductData(
          filteredData.map((product: Record<string, any>) => ({
            ...product,
            showPageUid: allShowPagesDocuments?.find(
              (doc: Record<string, any>) => doc.data.tgid === product.id
            )?.uid,
            verticalImage: verticalImagesDataMap.get(product?.id?.toString()),
          }))
        );
      }
    };

    fetchSimilarShows();
  }, []);

  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [slidesPerView, setSlidesPerView] = useState(6);

  useEffect(() => {
    if (!swiper) return;
    setActiveSlideIdx(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  const goNext = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + slidesPerView;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
    }
  };
  const goPrev = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx - slidesPerView;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
    }
  };
  const swiperParams: SwiperProps = {
    slidesPerView: isMobile ? 'auto' : 6,
    spaceBetween: isMobile ? 16 : 24,
    style: { overflow: 'visible' },
    freeMode: {
      enabled: true,
    },
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    onBreakpoint: (swiper, { slidesPerView }) => {
      if (swiper && slidesPerView && typeof slidesPerView === 'number') {
        setSlidesPerView(slidesPerView);
      }
    },
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
      1100: {
        slidesPerView: 6,
        spaceBetween: 24,
      },
    },
  };

  useEffect(() => {
    if (!similarShowsRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent({
          eventName: ANALYTICS_EVENTS.SHOW_PAGE_SECTION_VIEWED,
          [ANALYTICS_PROPERTIES.SECTION]: 'You might also like',
          [ANALYTICS_PROPERTIES.RANKING]: 15,
        });
        observer.unobserve(entry.target);
      }
    }, {});

    observer.observe(similarShowsRef.current);

    return () => {
      observer?.disconnect();
    };
  }, [similarShowsRef]);

  return (
    <SimilarShowsWrapper ref={similarShowsRef}>
      <Conditional if={similarProductData.length}>
        <TitleRow>
          <h2 className="title">{strings.LTT_SHOW_PAGE.SIMILAR_SHOWS}</h2>
          <div className="controls">
            <Conditional
              if={!isMobile && similarProductData.length > slidesPerView}
            >
              <LTT_CHEVRON_LEFT
                onClick={goPrev}
                disabled={activeSlideIdx <= 0}
              />
              <LTT_CHEVRON_RIGHT
                onClick={goNext}
                disabled={
                  activeSlideIdx + slidesPerView >= similarProductData.length
                }
              />
            </Conditional>
          </div>
        </TitleRow>

        <Swiper isFreeMode {...swiperParams}>
          {similarProductData.map((product: Record<string, any>) => (
            <VerticalProductCard
              product={{ ...product, title: product.name }}
              key={tgid}
              isMobile={isMobile}
            />
          ))}
        </Swiper>
      </Conditional>
    </SimilarShowsWrapper>
  );
};

export default SimilarShows;
