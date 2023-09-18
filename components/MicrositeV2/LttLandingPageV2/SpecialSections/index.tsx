import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import dynamic from 'next/dynamic';
import SwiperType from 'swiper';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import VerticalProductCard from 'components/MicrositeV2/LttLandingPageV2/ProductCards/VerticalProductCard';
import {
  SeeAllShowsCard,
  SpecialSectionWrapper,
  TitleRow,
} from 'components/MicrositeV2/LttLandingPageV2/SpecialSections/style';
import Image from 'UI/Image';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { VERTICAL_PRODUCT_IMAGE_PLACEHOLDER } from 'assets/SvgIcons';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);

interface ISpecialSections {
  allTours: any;
  isMobile: boolean;
  title: string;
  actions: {
    actionName: string;
    onClick: () => any[] | Promise<any[]>;
  }[];
  updateActions?: (actions: any) => void;
  totalNumberOfShows: number;
  seeAllCardText: string;
  preselectedActionName?: string;
  maxNumberOfShows?: number;
  hideSeeAll?: boolean;
  showSeeAll?: boolean;
  useForcedSekeltonLoaders?: boolean;
  handleSeaAllClicked?: () => void;
}

const CHEVRON_LEFT = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="chevron-left"
    onClick={onClick}
  >
    <circle
      cx="18"
      cy="18"
      r="17.5089"
      transform="matrix(-1 0 0 1 36 0)"
      stroke={disabled ? '#79797930' : '#79797960'}
      strokeOpacity="0.6"
      strokeWidth="0.982287"
    />
    <path
      d="M21.334 11.3337L14.6673 18.0003L21.334 24.667"
      stroke={disabled ? '#ffffff60' : '#ffffff'}
      strokeWidth="1.47343"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CHEVRON_RIGHT = ({
  onClick,
  disabled,
  strokeColor,
}: {
  onClick: () => void;
  disabled?: boolean;
  strokeColor?: string;
}) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    className="chevron-right"
  >
    <circle
      cx="18"
      cy="18"
      r="17.5089"
      stroke={strokeColor ?? (disabled ? '#79797930' : '#79797960')}
      strokeOpacity="0.6"
      strokeWidth="0.982287"
    />
    <path
      d="M14.666 11.3337L21.3327 18.0003L14.666 24.667"
      stroke={disabled ? '#ffffff60' : '#ffffff'}
      strokeWidth="1.47343"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpecialSections = ({
  preselectedActionName,
  isMobile,
  title,
  actions,
  updateActions,
  totalNumberOfShows,
  seeAllCardText,
  maxNumberOfShows = 12,
  hideSeeAll,
  showSeeAll,
  useForcedSekeltonLoaders,
  handleSeaAllClicked,
}: ISpecialSections) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [selectedActionName, setSelectedActionName] = useState(
    preselectedActionName ?? actions[0]?.actionName
  );
  const [currentShowList, setCurrentShowList] = useState<any[]>([]);
  const [hasIntersectingEventFired, sethasIntersectingEventFired] = useState(
    false
  );
  const [forceShowSkeletonLoader, setForceShowSkeletonLoader] = useState(false);

  const sectionRef = useRef(null);
  const isSectionIntersecting = useOnScreen({
    ref: sectionRef,
    unobserve: true,
  });

  useEffect(() => {
    const actionNameToBeAutoSelected = actions[0]?.actionName;
    setSelectedActionName(actionNameToBeAutoSelected);
    const selectedAction = actions.find(
      ({ actionName }) => actionName === actionNameToBeAutoSelected
    );
    const loadFirstProducts = async () => {
      const shows = await selectedAction?.onClick();
      if (shows && shows.length)
        setCurrentShowList(shows?.slice(0, maxNumberOfShows));
      else {
        updateActions?.(actions.splice(1));
      }
    };

    loadFirstProducts();
  }, [actions]);

  useEffect(() => {
    if (!swiper) return;
    setActiveSlideIdx(swiper.activeIndex);
  }, [swiper?.activeIndex]);

  useEffect(() => {
    if (isSectionIntersecting && !hasIntersectingEventFired) {
      sethasIntersectingEventFired(true);
      trackEvent({
        eventName: ANALYTICS_EVENTS.PAGE_SECTION_VIEWED,
        Category: title,
        [ANALYTICS_PROPERTIES.RANKING]: 1,
      });
    }
  }, [isSectionIntersecting]);

  const swiperParams: SwiperProps = {
    slidesPerView: isMobile ? 'auto' : 6,
    spaceBetween: isMobile ? 16 : 24,
    style: { overflow: 'visible' },
    freeMode: {
      enabled: true,
    },
    onSwiper: (swiper: any) => setSwiper(swiper),
  };
  const goNext = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + 6;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Next',
        Category: title,
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          6,
          swiperSlides?.length - newIndex
        ),
      });
    }
  };
  const goPrev = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx - 6;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
      trackEvent({
        eventName: ANALYTICS_EVENTS.CHEVRON_CLICKED,
        Direction: 'Previous',
        Category: title,
        [ANALYTICS_PROPERTIES.NEXT_ITEMS_COUNT]: Math.min(
          6,
          swiperSlides?.length - newIndex
        ),
      });
    }
  };

  const swiperSlidesArray = Object.values(currentShowList);
  const swiperSlides = swiperSlidesArray.map((product, index) => (
    <div key={index}>
      <Conditional if={forceShowSkeletonLoader}>
        <div key={index}>
          <div className="skeleton-placeholder-image">
            <VERTICAL_PRODUCT_IMAGE_PLACEHOLDER
              $width={isMobile ? 120 : 180}
              $height={isMobile ? 184 : 274}
            />
          </div>
          <Skeleton
            baseColor={`${COLORS.BRAND.WHITE}66`}
            enableAnimation={false}
            height={isMobile ? 8 : 12}
            width={isMobile ? 60 : 90}
          />
          <Skeleton
            baseColor={`${COLORS.BRAND.WHITE}66`}
            enableAnimation={false}
            height={isMobile ? 8 : 12}
            width={isMobile ? 120 : 180}
          />
          <Skeleton
            baseColor={`${COLORS.BRAND.WHITE}66`}
            enableAnimation={false}
            height={isMobile ? 10 : 14}
            width={isMobile ? 80 : 120}
          />
        </div>
      </Conditional>
      <Conditional if={!forceShowSkeletonLoader}>
        <VerticalProductCard
          product={product}
          isMobile={isMobile}
          background="DARK"
          key={index}
        />
      </Conditional>
    </div>
  ));

  if (isMobile && showSeeAll) {
    swiperSlides.push(
      <SeeAllShowsCard>
        <span className="number">+ {totalNumberOfShows}</span>
        <span className="see-all-text">
          {seeAllCardText} {selectedActionName?.toLocaleLowerCase()}
        </span>
        <CHEVRON_RIGHT strokeColor={COLORS.BRAND.WHITE} onClick={() => {}} />
      </SeeAllShowsCard>
    );
  }
  const onActionSelect = async (action: {
    actionName: string;
    onClick: () => any[] | Promise<any[]>;
  }) => {
    const shows = await action.onClick();

    setCurrentShowList(shows.slice(0, maxNumberOfShows));
    setSelectedActionName(action.actionName);
    if (useForcedSekeltonLoaders) {
      setForceShowSkeletonLoader(true);
      setTimeout(() => {
        setForceShowSkeletonLoader(false);
      }, 1500);
    }
    swiper?.slideTo(0);
    setActiveSlideIdx(0);
    trackEvent({
      eventName: 'MB Experiences Filtered',
      Category: title,
      Filter: action.actionName,
    });
  };

  return (
    <SpecialSectionWrapper ref={sectionRef}>
      <div className="right-corner-illustration">
        <Image
          url={
            'https://cdn-imgix.headout.com/assets/images/ltt/BG+Illustration.png'
          }
          alt="right-corner-illustration"
          priority
          height={isMobile ? 160 : 287.81}
          width={isMobile ? 375 : 798.6}
          autoCrop={true}
          fetchPriority="high"
          fitCrop={true}
        />
      </div>
      <div className="right-corner" />
      <div className="content">
        <div className="title">{title}</div>
        <TitleRow>
          <div className="chips">
            {actions.map((action, index) => (
              <span
                key={action.actionName}
                onClick={() => onActionSelect(action)}
                role="button"
                tabIndex={index}
                className={`action ${
                  action.actionName === selectedActionName ? 'selected' : ''
                }`}
              >
                {action.actionName}
              </span>
            ))}
          </div>
          <div className="controls">
            <Conditional if={!isMobile && !hideSeeAll}>
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
              <span className="see-all" onClick={handleSeaAllClicked}>
                {strings.LTT_LANDING_PAGE.SEE_ALL}
              </span>
            </Conditional>
            <Conditional if={!isMobile && swiperSlides.length > 6}>
              <CHEVRON_LEFT onClick={goPrev} disabled={activeSlideIdx <= 0} />
              <CHEVRON_RIGHT
                onClick={goNext}
                disabled={activeSlideIdx + 6 >= swiperSlides.length}
              />
            </Conditional>
          </div>
        </TitleRow>
        <Swiper isFreeMode {...swiperParams}>
          {swiperSlides}
        </Swiper>
      </div>
    </SpecialSectionWrapper>
  );
};

export default SpecialSections;
