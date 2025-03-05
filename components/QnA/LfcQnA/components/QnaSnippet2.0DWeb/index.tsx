import { useContext, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import { Text } from '@headout/eevee';
import Conditional from 'components/common/Conditional';
import { QnAContainer } from 'components/StaticBanner';
import Swiper from 'components/Swiper';
import { MBContext } from 'contexts/MBContext';
import { QnaContext } from 'contexts/QnaContext';
import { truncateNumber } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHostName } from 'utils/helper';
import { sentenceCase } from 'utils/stringUtils';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  UID_TO_COUNT_MAPPING,
} from 'const/index';
import { strings } from 'const/strings';
import { INVERTED_BLUE_QUOTES_DWEB } from 'assets/invertedBlueQuotesDweb';
import LttChevronLeft from 'assets/lttChevronLeft';
import LttChevronRight from 'assets/lttChevronRight';
import { UNDERLINE } from 'assets/underline';
import { getQnaCommonDataEvents } from '../../utils';
import { QnA } from '../LfcDWebSection/components/QnaLfcDwebRow/types';
import QnaModal from '../QnaModal';
import { AnswerCard } from '../QnaSnippet2.0';
import { Heading, UnderlinedText } from '../QnaSnippet2.0/styles';
import {
  Arrows,
  Container,
  Copy,
  Icon,
  Navigation,
  RealTips,
  SeeAll,
  SwiperWrapper,
  Wrapper,
} from './styles';

const UpdatedQnaSnippetDweb = ({
  qnaSnippets,
  qnaSections,
  collectionId,
}: {
  qnaSnippets: QnA[];
  qnaSections: QnAContainer[];
  collectionId: number;
}) => {
  const { uid, isMobile } = useRecoilValue(appAtom);
  const [swiper, setSwiperInstance] = useState<TSwiper | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const { showModal, setShowModal } = useContext(QnaContext);
  const { lang, isDev, host } = useContext(MBContext);
  const mbName = getHostName(isDev, host);

  const events = useMemo(() => {
    return getQnaCommonDataEvents({
      lang,
      isMobile,
      mbName,
      collectionId,
    });
  }, [lang, isMobile, mbName, collectionId]);

  const swiperParams: SwiperProps = {
    slidesPerView: 3,
    spaceBetween: 20,
    onSwiper: (swiper: any) => setSwiperInstance(swiper),
    initialSlide: 0,
  };

  useEffect(() => {
    if (!swiper) return;
    setActiveSlideIdx(swiper.activeIndex);
  }, [swiper?.activeIndex, swiper]);

  const goNext = () => {
    if (swiper !== null && activeSlideIdx + 3 <= qnaSnippets.length) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx + 1;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
    }
  };

  const goPrev = () => {
    if (swiper !== null) {
      const currIdx = swiper.activeIndex;
      const newIndex = currIdx - 1;
      swiper.slideTo(newIndex);
      setActiveSlideIdx(newIndex);
    }
  };

  const tabsLabelArray = qnaSections.map((qnaSection: QnAContainer) =>
    sentenceCase(qnaSection.type)
  );

  const trackCardClickEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.QNA_EVENTS.QNA_BANNER_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: 'QnA Snippet',
      ...events,
    });
  };

  return (
    <Wrapper>
      <Icon>{INVERTED_BLUE_QUOTES_DWEB}</Icon>
      <Container>
        <Copy>
          <Heading>
            {strings.formatString(
              strings.ADVICE,
              <UnderlinedText>
                <span className="blue">
                  {truncateNumber(
                    UID_TO_COUNT_MAPPING[
                      uid as keyof typeof UID_TO_COUNT_MAPPING
                    ]
                  ).toUpperCase()}
                  +
                </span>
                {UNDERLINE}
              </UnderlinedText>
            )}
            <Text
              textStyle={'Semantics/UI Label/Medium'}
              color={'Color/Semantic/Text/grey-2'}
              className={RealTips}
              dangerouslySetInnerHTML={{
                __html: strings.REAL_TIPS,
              }}
            />
          </Heading>

          <Navigation>
            <SeeAll onClick={() => setShowModal(true)}>
              {strings.SEE_ALL_Q}
            </SeeAll>
            <Arrows>
              <LttChevronLeft onClick={goPrev} disabled={activeSlideIdx <= 0} />
              <LttChevronRight
                onClick={goNext}
                disabled={activeSlideIdx + 3 > qnaSnippets.length - 1}
              />
            </Arrows>
          </Navigation>
        </Copy>

        <SwiperWrapper>
          <Swiper {...swiperParams}>
            {qnaSnippets.map((snippet: QnA, index: number) => (
              <AnswerCard
                snippet={snippet}
                key={index}
                handleClick={() => {
                  setShowModal(true);
                  trackCardClickEvent();
                }}
              />
            ))}
          </Swiper>
        </SwiperWrapper>
      </Container>
      <Conditional if={showModal}>
        <QnaModal tabsArray={tabsLabelArray} qnaSections={qnaSections} />
      </Conditional>
    </Wrapper>
  );
};

export default UpdatedQnaSnippetDweb;
