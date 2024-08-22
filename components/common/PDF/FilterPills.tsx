import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import Conditional from '../Conditional';
import { Pill, PillsContainer, PillsSection } from './styles';
import { TFilterPills } from './types';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper')
);
const OverflowScroll = dynamic(
  () => import(/* webpackChunkName: "OverflowScroll" */ 'UI/OverflowScroll')
);

const FilterPills = (props: TFilterPills) => {
  const { pdfData = [], activeIndex, setActiveIndex } = props || {};
  const { isMobile } = useRecoilValue(appAtom);

  const handlePillClick = ({
    event,
    index,
    name,
  }: {
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>;
    index: number;
    name: string;
  }) => {
    event.preventDefault();
    setActiveIndex(index);
    trackEvent({
      eventName: ANALYTICS_EVENTS.FOOD_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.RANK]: index + 1,
      [ANALYTICS_PROPERTIES.TAB_NAME]: name,
    });
  };

  const PillsCarousel = pdfData?.map((item, index) => {
    const { name } = item;
    const isHighlighted = activeIndex === index;

    return (
      <Pill
        key={index}
        onClick={(e) =>
          handlePillClick({
            event: e,
            index,
            name,
          })
        }
        $isHighlighted={isHighlighted}
      >
        {name}
      </Pill>
    );
  });

  const swiperParams: SwiperProps = {
    slidesPerView: 'auto',
    spaceBetween: 12,
    preventInteractionOnTransition: true,
  };

  return (
    <PillsSection>
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

export default FilterPills;
