import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import Conditional from 'components/common/Conditional';
import Pill from 'components/common/Pill';
import { trackEvent } from 'utils/analytics';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  FILTER_TYPE,
} from 'const/index';
import { PillsContainer, PillsSection } from './styles';
import { SubCategoryFiltersProps } from './types';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);
const OverflowScroll = dynamic(
  () => import(/* webpackChunkName: "OverflowScroll" */ 'UI/OverflowScroll')
);

const SubCategoryFilters: React.FC<SubCategoryFiltersProps> = (props) => {
  const { subCategoryPills, isMobile, setActiveSubCat } = props;
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [_activeIndex, setActiveIndex] = useState(0);
  const [activePill, setActivePill] = useState(0);
  const pillsSectionRef = useRef<HTMLDivElement>(null);

  const adjustContainerScroll = useCallback(
    (targetElement: any, container: any) => {
      if (!targetElement || !container) return;
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const isElementVisible =
        targetRect.left >= containerRect.left + 10 &&
        targetRect.right <= containerRect.right - 10;

      if (!isElementVisible) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    },
    []
  );

  useEffect(() => {
    if (!swiper) return;
    setActiveIndex(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  const updateIndex = useCallback(() => {
    if (isMobile || !swiper) return;
    setActiveIndex(swiper.realIndex);
  }, [swiper, isMobile]);

  const swiperParams: SwiperProps = {
    slidesPerView: 'auto',
    spaceBetween: 12,
    preventInteractionOnTransition: true,
    onSwiper: (swiper: TSwiper) => setSwiperInstance(swiper),
    onSlideChange: () => updateIndex(),
  };

  const handlePillClick = ({
    event,
    id,
    subCatId,
    label,
    index,
  }: {
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
    id: number;
    subCatId: number | undefined;
    label: string;
    index: number;
  }) => {
    event.preventDefault();
    setActivePill(id);
    setActiveSubCat(subCatId ?? 0);
    trackEvent({
      eventName: ANALYTICS_EVENTS.FILTER_APPLIED,
      [ANALYTICS_PROPERTIES.FILTER_TYPE]: FILTER_TYPE.SUB_CATEGORY,
      [ANALYTICS_PROPERTIES.FILTER_NAME]: label,
      [ANALYTICS_PROPERTIES.RANK]: index + 1,
    });
    const container = pillsSectionRef.current;
    const pill = document.getElementById(`pill-${label}`);
    adjustContainerScroll(pill, container);
  };

  const PillsCarousel = subCategoryPills.map((subCategoryPill, index) => {
    const { id, label, iconUrl, subCatId } = subCategoryPill;
    let isHighlighted = activePill === 0;
    isHighlighted = id === activePill;

    return (
      <button
        key={id}
        id={`pill-${label}`}
        onClick={(e) =>
          handlePillClick({
            event: e,
            id: id,
            subCatId,
            label,
            index,
          })
        }
      >
        <Pill
          iconUrl={iconUrl}
          label={label}
          isHighlighted={isHighlighted}
          isSubCategoryPage={false}
          isDarkVariant={true}
        />
      </button>
    );
  });

  return (
    <PillsSection ref={pillsSectionRef}>
      <PillsContainer>
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

export default SubCategoryFilters;
