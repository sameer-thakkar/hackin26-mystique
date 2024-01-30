import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { PrismicRichText } from '@prismicio/react';
import { useWindowWidth } from '@react-hook/window-size';
import { SwiperProps } from 'swiper/react';
import Conditional from 'components/common/Conditional';
import CategoryTags from 'components/slices/ListicleV2/LargeListicle/CategoryTags';
import { IContentContainerProps } from 'components/slices/ListicleV2/LargeListicle/ContentContainer/interfaces';
import {
  LargeListicleContentWrapper,
  RichContentWrapper,
  RichTextWrapper,
  SwiperControls,
  Tab,
  TabContainer,
  TabHeadingsWrapper,
  TabRichContentWrapper,
  TabsWrapper,
} from 'components/slices/ListicleV2/LargeListicle/ContentContainer/styles';
import PracticalInfo from 'components/slices/ListicleV2/LargeListicle/PracticalInfo';
import Button from 'UI/Button';
import RichContent from 'UI/RichContent';
import { shortCodeSerializer } from 'utils/shortCodes';
import ChevronRightCircle from 'assets/chevronRightCircle';

const Swiper = dynamic(
  () => import(/* webpackChunkName: "Swiper" */ 'components/Swiper'),
  { ssr: false }
);

const swiperParams: SwiperProps = {
  slidesPerView: 'auto',
  spaceBetween: 24,
};

const ContentContainer = ({
  heading,
  categoryTags,
  practicalInfo,
  tabData,
  richTextData,
  isMobile,
  ctaText,
  isModalOpen,
  ctaUrl,
  onClickCTAButton,
  onClickMapLink,
}: IContentContainerProps) => {
  const tabsContanier = useRef(null);
  const [swiper, updateSwiper] = useState(null);
  const [_, updateCurrentIndex] = useState(0);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const windowWidth = useWindowWidth();

  const updateIndex = () => {
    if (isMobile) {
      return;
    }

    // @ts-expect-error TS(2531): Object is possibly 'null'.
    updateCurrentIndex(swiper.realIndex);
  };

  const updateSliderPosition = () => {
    setIsBeginning((swiper as any)?.isBeginning);
    setIsEnd((swiper as any)?.isEnd);
  };

  const goNext = () => {
    if (swiper !== null) {
      (swiper as any)?.slideNext();
      updateSliderPosition();
    }
  };

  const goPrev = () => {
    if (swiper !== null) {
      (swiper as any)?.slidePrev();
      updateSliderPosition();
    }
  };

  const onTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <LargeListicleContentWrapper
      isModalOpen={isModalOpen}
      className={'large-listicle-content'}
    >
      <h2 id="title">{heading}</h2>
      <CategoryTags categoryTags={categoryTags} />
      <PracticalInfo
        practicalInfo={practicalInfo}
        isMobile={isMobile}
        onClickMapLink={onClickMapLink}
      />
      <RichTextWrapper>
        <PrismicRichText
          field={richTextData}
          components={shortCodeSerializer}
        />
      </RichTextWrapper>
      <Conditional if={!isMobile}>
        <TabContainer>
          <TabHeadingsWrapper ref={tabsContanier}>
            <Swiper
              {...swiperParams}
              // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<null>>' is not assig... Remove this comment to see the full error message
              onSwiper={updateSwiper}
              onSlideChange={updateIndex}
            >
              {tabData.map((tab, index: number) => (
                <Tab
                  isActive={activeTabIndex === index}
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabChange(index);
                  }}
                >
                  {tab.title}
                </Tab>
              ))}
            </Swiper>
            <Conditional if={windowWidth <= 950}>
              <SwiperControls>
                <Conditional if={!isBeginning}>
                  <div
                    className="prev-slide"
                    role="button"
                    tabIndex={0}
                    onClick={goPrev}
                  >
                    {ChevronRightCircle}
                  </div>
                </Conditional>
                <Conditional if={!isEnd}>
                  <div
                    className="next-slide"
                    role="button"
                    tabIndex={0}
                    onClick={goNext}
                  >
                    {ChevronRightCircle}
                  </div>
                </Conditional>
              </SwiperControls>
            </Conditional>
          </TabHeadingsWrapper>
          <div className="tab-content-wrap">
            <Conditional if={tabData.length}>
              <RichContentWrapper>
                <RichContent render={tabData[activeTabIndex]?.text} />
              </RichContentWrapper>
            </Conditional>
          </div>
        </TabContainer>
        <Conditional if={ctaUrl}>
          <div>
            <Button className="cta-button">
              <a
                href={ctaUrl}
                target={'_blank'}
                onClick={onClickCTAButton}
                rel="noreferrer noopener"
              >
                {ctaText}
              </a>
            </Button>
          </div>
        </Conditional>
      </Conditional>

      <Conditional if={isMobile && isModalOpen}>
        <TabsWrapper>
          {tabData?.map((item, index) => {
            const { title, text } = item;
            return (
              <div key={index} className="tab-content-wrapper">
                <TabHeadingsWrapper>{title}</TabHeadingsWrapper>
                <TabRichContentWrapper>
                  <RichContent render={text} />
                </TabRichContentWrapper>
              </div>
            );
          })}
        </TabsWrapper>
      </Conditional>
    </LargeListicleContentWrapper>
  );
};
export default ContentContainer;
