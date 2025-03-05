import { useContext, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { SwiperProps } from 'swiper/react';
import type { Swiper as TSwiper } from 'swiper/types';
import { Button, Text } from '@headout/eevee';
import { getIntlDate } from '@headout/espeon/utils';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import SwipeableTabs from 'components/common/SwipeableTabs';
import { getQnaCommonDataEvents } from 'components/QnA/LfcQnA/utils';
import { createTabItem } from 'components/QnA/QnASnippetSection';
import { DrawerStyles } from 'components/QnA/QnASnippetSection/styles';
import { QnAContainer } from 'components/StaticBanner';
import Swiper from 'components/Swiper';
import { MBContext } from 'contexts/MBContext';
import { QnaContext } from 'contexts/QnaContext';
import { truncateNumber } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHostName, truncate } from 'utils/helper';
import { getCountryFlagUrl, getRandomReviewerImage } from 'utils/reviewUtils';
import { sentenceCase } from 'utils/stringUtils';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  UID_TO_COUNT_MAPPING,
} from 'const/index';
import { strings } from 'const/strings';
import { INVERTED_BLUE_QUOTES } from 'assets/invertedBlueQuotes';
import { QnaPlus } from 'assets/qnaPlus';
import { UNDERLINE } from 'assets/underline';
import { QnA } from '../LfcDWebSection/components/QnaLfcDwebRow/types';
import {
  Answer,
  AnswerCardWrapper,
  AnswerContainer,
  AnswerCount,
  CountryFlag,
  DP,
  Heading,
  Icon,
  InfoCopy,
  Name,
  QuestionContainer,
  SwiperWrapper,
  Timestamp,
  UnderlinedText,
  UserCountry,
  UserImage,
  UserInfo,
  UserMeta,
  Wrapper,
} from './styles';
import { TQnaSnippetProps } from './types';

const UpdatedQnaSnippet = ({
  qnaSnippets,
  qnaSections,
  collectionId,
}: TQnaSnippetProps) => {
  const { isMobile, uid } = useRecoilValue(appAtom);
  const { setShowDrawer, showDrawer } = useContext(QnaContext);
  const { lang, isDev, host } = useContext(MBContext);
  const mbName = getHostName(isDev, host);
  const [swiper, setSwiper] = useState<TSwiper | null>(null);

  // Will need this piece of code in next iteration

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         const swiperWrapper =
  //           sectionRef.current.querySelector('.swiper-wrapper');
  //         if (swiperWrapper) {
  //           swiperWrapper.classList.add('animate-carousel');
  //           swiperWrapper.addEventListener(
  //             'animationend',
  //             () => {
  //               swiperWrapper.classList.remove('animate-carousel');
  //               setstartAutoscroll(true);
  //             },
  //             { once: true }
  //           );
  //         }
  //       }
  //     },
  //     { threshold: 0.7 }
  //   );

  //   if (sectionRef.current) {
  //     observer.observe(sectionRef.current);
  //   }

  //   return () => {
  //     if (sectionRef.current) {
  //       observer.unobserve(sectionRef.current);
  //     }
  //   };
  // }, []);

  const events = useMemo(() => {
    return getQnaCommonDataEvents({
      lang,
      isMobile,
      mbName,
      collectionId,
    });
  }, [lang, isMobile, mbName, collectionId]);

  const swiperParams: SwiperProps = {
    spaceBetween: 10,
    slidesPerView: 'auto',
    loop: true,
    initialSlide: 0,
    speed: 550,
    loopedSlides: qnaSnippets.length,
    onSwiper: (swiper) => setSwiper(swiper),
    onTouchEnd: () => {
      if (swiper) {
        swiper.autoplay.stop();
      }
    },
    onClick: () => {
      if (swiper) {
        swiper.autoplay.stop();
      }
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
  };

  const tabsLabelArray = qnaSections.map((qnaSection: QnAContainer) =>
    sentenceCase(qnaSection.type)
  );
  const isTabsVisible = tabsLabelArray.length > 1;
  let tabsArray:
    | { header: any; body: any; trackingLabel?: string }[]
    | { body: React.JSX.Element; header: any }[] = useMemo(() => {
    return qnaSections.map((section: QnAContainer) => createTabItem(section));
  }, [qnaSections]);

  const trackCardClickEvent = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.QNA_EVENTS.QNA_BANNER_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: 'QnA Snippet',
      ...events,
    });
  };

  return (
    <Wrapper>
      <Icon>{INVERTED_BLUE_QUOTES}</Icon>
      <Heading>
        {strings.formatString(
          strings.ADVICE,
          <UnderlinedText>
            <span className="blue">
              {truncateNumber(
                UID_TO_COUNT_MAPPING[uid as keyof typeof UID_TO_COUNT_MAPPING]
              ).toUpperCase()}
              +
            </span>
            {UNDERLINE}
          </UnderlinedText>
        )}
      </Heading>
      <InfoCopy
        dangerouslySetInnerHTML={{
          __html: strings.REAL_TIPS,
        }}
      />
      <SwiperWrapper>
        <Swiper {...swiperParams}>
          {qnaSnippets.map((snippet: QnA, index: number) => (
            <AnswerCard
              snippet={snippet}
              key={index}
              handleClick={() => {
                setShowDrawer(true);
                trackCardClickEvent();
              }}
            />
          ))}
        </Swiper>
      </SwiperWrapper>
      <Button
        variant="secondary"
        size="small"
        as="button"
        primaryText={strings.SEE_ALL_QNA}
        btnType="black"
        onClick={() => setShowDrawer(true)}
      />
      <Conditional if={showDrawer && isMobile}>
        <Drawer
          $drawerStyles={DrawerStyles({ isTabsVisible })}
          closeHandler={() => setShowDrawer(false)}
          noMargin
          coverHeaderInShadow
        >
          <h2>
            {strings.formatString(
              strings.ADVICE_FROM_TRAVELLERS,
              `${truncateNumber(
                UID_TO_COUNT_MAPPING[uid as keyof typeof UID_TO_COUNT_MAPPING]
              ).toUpperCase()}+`
            )}
          </h2>
          <SwipeableTabs tabs={tabsArray} />
        </Drawer>
      </Conditional>
    </Wrapper>
  );
};

export const AnswerCard = ({
  snippet,
  handleClick,
}: {
  snippet: QnA;
  handleClick: () => void;
}) => {
  const { question, answer, totalAnswersCount } = snippet;
  const { customer } = answer;

  return (
    <AnswerCardWrapper onClick={handleClick}>
      <QuestionContainer>{truncate(question.content, 87)}</QuestionContainer>
      <AnswerContainer>
        <Answer>{`"${answer.content}"`}</Answer>
        <UserInfo>
          <DP>
            <UserImage
              src={
                customer.profileImageUrl ??
                getRandomReviewerImage(customer.name)
              }
            />
            <Conditional if={answer.customer.countryCode}>
              <CountryFlag
                src={getCountryFlagUrl(answer.customer.countryCode)}
              />
            </Conditional>
          </DP>
          <UserMeta>
            <Text
              textStyle={'Semantics/UI Label/Regular (Heavy)'}
              color={COLORS.GRAY.G1}
              className={Name}
            >
              {customer.name}
            </Text>
            <UserCountry>
              <Conditional if={customer.countryName}>
                <Text
                  textStyle={'Semantics/UI Label/Small'}
                  color={COLORS.GRAY.G3}
                  className={Timestamp}
                >
                  {customer.countryName}
                </Text>
                <span className="dot">{' • '}</span>
              </Conditional>
              <Text
                textStyle={'Semantics/UI Label/Small'}
                color={COLORS.GRAY.G3}
                className={Timestamp}
              >
                {getIntlDate({
                  lang: 'en',
                  date: new Date(answer.timestamp).toString(),
                  dateFormat: 'MMM-YYYY',
                })}
              </Text>
            </UserCountry>
          </UserMeta>
        </UserInfo>
        <AnswerCount>
          {QnaPlus}{' '}
          <u>
            {strings.formatString(strings.ANSWERS_COUNT, totalAnswersCount)}
          </u>
        </AnswerCount>
      </AnswerContainer>
    </AnswerCardWrapper>
  );
};

export default UpdatedQnaSnippet;
