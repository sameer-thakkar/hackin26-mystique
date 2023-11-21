import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { scroller } from 'react-scroll';
import dynamic from 'next/dynamic';
import { useRecoilState } from 'recoil';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import { SubCategoryPillsProps } from 'components/CatAndSubCatPage/SubCategoryPills/interface';
import {
  PillsContainer,
  PillsSection,
  SwiperControls,
} from 'components/CatAndSubCatPage/SubCategoryPills/styles';
import { handleCarouselControlTracking } from 'components/CityPageContainer/utils';
import Conditional from 'components/common/Conditional';
import Pill from 'components/common/Pill';
import { trackEvent } from 'utils/analytics';
import { throttle } from 'utils/gen';
import { getCatAndSubcatPageLabel } from 'utils/helper';
import { appAtom } from 'store/atoms/app';
import { ALL, SECTIONS } from 'const/catAndSubcatPage';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  CAROUSEL_DIR,
} from 'const/index';
import { LTT_CHEVRON_LEFT, LTT_CHEVRON_RIGHT } from 'assets/SvgIcons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);
const OverflowScroll = dynamic(() =>
  import(/* webpackChunkName: "OverflowScroll" */ 'UI/OverflowScroll')
);

const SubCategoryPills: React.FC<SubCategoryPillsProps> = (props) => {
  const {
    subCategoryPills,
    subCategoryData,
    isSubCategoryPage,
    isMobile,
  } = props;
  const { id: subCategoryId } = subCategoryData || {};
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [_activeIndex, setActiveIndex] = useState(0);
  const [isSectionAtTop, setIsSectionAtTop] = useState(false);
  const pillsSectionRef = useRef<HTMLDivElement>(null);
  const [appState, setAppState] = useRecoilState(appAtom);

  useEffect(() => {
    if (!swiper) return;
    setActiveIndex(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  const updateIndex = useCallback(() => {
    if (isMobile || !swiper) return;
    setActiveIndex(swiper.realIndex);
  }, [swiper, isMobile]);

  const updateSliderPosition = useCallback(() => {
    if (!swiper) return;
    setIsBeginning(swiper?.isBeginning);
    setIsEnd(swiper?.isEnd);
  }, [swiper]);

  useEffect(() => {
    if (!swiper) return;
    updateSliderPosition();
  }, [swiper]);

  const goNext = () => {
    if (!swiper) return;
    swiper?.slideNext();
    updateSliderPosition();
    handleCarouselControlTracking({
      direction: CAROUSEL_DIR.NEXT,
      section: SECTIONS.SUB_CATEGORY_PIILS,
    });
  };

  const goPrev = () => {
    if (!swiper) return;
    swiper?.slidePrev();
    updateSliderPosition();
    handleCarouselControlTracking({
      direction: CAROUSEL_DIR.PREV,
      section: SECTIONS.SUB_CATEGORY_PIILS,
    });
  };

  const swiperParams: SwiperProps = {
    slidesPerView: 'auto',
    spaceBetween: 8,
    preventInteractionOnTransition: true,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onSlideChange: () => updateIndex(),
    onTouchEnd: () => {},
  };

  const handlePillClick = ({
    event,
    subCategoryName,
    ranking,
  }: {
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
    subCategoryName: string;
    ranking: number;
  }) => {
    if (!isSubCategoryPage) {
      event.preventDefault();
      const className = subCategoryName.toLowerCase().replace(' ', '-');
      scroller.scrollTo(className, {
        duration: 1300,
        offset: isMobile ? -60 : -145,
        smooth: 'easeInOutQuart',
      });
    }
    trackEvent({
      eventName: ANALYTICS_EVENTS.CAT_SUBCAT_PAGE.SUBCATEGORY_PILL_CLICKED,
      [ANALYTICS_PROPERTIES.SUB_CAT_NAME]: subCategoryName,
      [ANALYTICS_PROPERTIES.RANKING]: ranking,
    });
  };

  useLayoutEffect(() => {
    if (!window || isSubCategoryPage) return;

    const scrollHandler = () => {
      if (!pillsSectionRef.current) return;

      const pillsRowScrollPos = pillsSectionRef.current.getBoundingClientRect()
        .top;
      const SCROLL_CUTOFF = isMobile ? 56 : 44;
      if (isSectionAtTop && pillsRowScrollPos > SCROLL_CUTOFF) {
        setIsSectionAtTop(false);
        setAppState({ ...appState, isPillBarSticky: false });
      }
      if (!isSectionAtTop && pillsRowScrollPos <= SCROLL_CUTOFF) {
        setIsSectionAtTop(true);
        setAppState({ ...appState, isPillBarSticky: true });
      }
    };

    const throttledScrollHandler = throttle(scrollHandler, 300);
    window.addEventListener('scroll', throttledScrollHandler, {
      passive: true,
    });
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [isSectionAtTop]);

  const PillsCarousel = subCategoryPills.map((subCategoryPill, index) => {
    const { id, name, label, url, iconUrl } = subCategoryPill;
    const isHighlighted = subCategoryId ? id === subCategoryId : label === ALL;
    const formattedLabel = getCatAndSubcatPageLabel({ label });

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        key={id}
        onClick={(e) =>
          handlePillClick({
            event: e,
            subCategoryName: name,
            ranking: index + 1,
          })
        }
      >
        <Pill
          iconUrl={iconUrl}
          label={formattedLabel}
          isHighlighted={isHighlighted}
          isSubCategoryPage={isSubCategoryPage}
          {...(isSubCategoryPage && {
            height: isMobile ? '2.4rem' : '3rem',
          })}
        />
      </a>
    );
  });

  return (
    <PillsSection
      $isSubCategoryPage={isSubCategoryPage}
      $isSticky={isSectionAtTop}
      ref={pillsSectionRef}
    >
      <PillsContainer>
        <Conditional if={!isMobile}>
          <SwiperControls $isBeginning={isBeginning} $isEnd={isEnd}>
            <Conditional if={!isBeginning}>
              <span className="prev-pill">
                <LTT_CHEVRON_LEFT onClick={goPrev} />
              </span>
            </Conditional>
            <Conditional if={!isEnd}>
              <span className="next-pill">
                <LTT_CHEVRON_RIGHT onClick={goNext} />
              </span>
            </Conditional>
          </SwiperControls>
        </Conditional>
        <Conditional if={!isMobile}>
          <Swiper {...swiperParams}>{PillsCarousel}</Swiper>
        </Conditional>
        <Conditional if={isMobile}>
          <OverflowScroll
            unsetWrapperMargin={true}
            unsetChildrenMargin={true}
            unsetChildrenPadding={true}
            gap={0.5}
          >
            {PillsCarousel}
          </OverflowScroll>
        </Conditional>
      </PillsContainer>
    </PillsSection>
  );
};

export default SubCategoryPills;
