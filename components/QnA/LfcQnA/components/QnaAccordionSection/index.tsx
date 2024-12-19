import { useContext, useState } from 'react';
import { QnaContext } from 'contexts/QnaContext';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import {
  DEFAULT_QNA_TYPE,
  MIN_VISIBLE_ANSWER_COUNT,
  QNA_LFC_SECTION,
} from '../../constants';
import { getInitialAccordionStatus } from '../../utils';
import QnaAccordionBlock from '../QnaAccordionBlock';
import { StyledQnaAccordionContainer } from './styles';
import { TQnaAccordionSection } from './types';
import { scrollToElementWrapper } from './utils';

const QnaAccordionSection = ({
  qnaSections,
  increaseAnswerOnLoadMore = false,
  qnaType,
  tabsArray,
  scrollableWrapperRef,
  isLfcSection,
}: TQnaAccordionSection) => {
  const { setShowDrawer, qnaCommonEvents } = useContext(QnaContext);
  const dashedQnaType = qnaType?.replace(/ /g, '-') || DEFAULT_QNA_TYPE;

  const initialAccordionStatus = getInitialAccordionStatus({
    tabsArray,
    dashedQnaType,
  });

  const [accordionStatusMap, setAccordionStatusMap] = useState<
    Record<string, boolean>
  >(initialAccordionStatus);
  const [answerLimits, setAnswerLimits] = useState<Record<string, number>>({});

  const increaseAnswerLimit = (sectionIndex: number) => {
    const uniqueQuestionKey = `${dashedQnaType}-${sectionIndex}`;
    setAnswerLimits((prev) => ({
      ...prev,
      [uniqueQuestionKey]:
        (prev[uniqueQuestionKey] || MIN_VISIBLE_ANSWER_COUNT) + 3,
    }));
  };

  const resetAnswerLimit = (sectionIndex: number, noScroll = false) => {
    const uniqueQuestionKey = `${dashedQnaType}-${sectionIndex}`;

    trackEvent({
      eventName: ANALYTICS_EVENTS.QNA_EVENTS.HIDE_RESPONSES_CLICKED,
      [ANALYTICS_PROPERTIES.TAB_NAME]: dashedQnaType,
      [ANALYTICS_PROPERTIES.QUESTION_RANK]: sectionIndex + 1,
      ...qnaCommonEvents,
    });

    setAnswerLimits((prev) => ({
      ...prev,
      [uniqueQuestionKey]: MIN_VISIBLE_ANSWER_COUNT,
    }));

    if (!noScroll) {
      scrollToElementWrapper({
        questionIndex: sectionIndex,
        scrollToAnswerPosition: 0,
        scrollToQuestion: true,
        scrollableWrapperRef,
        dashedQnaType,
      });
    }
  };

  const handleAccordionClick = ({
    index,
    event,
  }: {
    index: number;
    event: React.MouseEvent<HTMLElement>;
  }) => {
    const clickedAccordionKey = `${dashedQnaType}-${index}`;
    const isActionClose = accordionStatusMap[clickedAccordionKey];

    trackEvent({
      eventName: ANALYTICS_EVENTS.QNA_EVENTS.QUESTION_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: QNA_LFC_SECTION,
      [ANALYTICS_PROPERTIES.TAB_NAME]: dashedQnaType,
      [ANALYTICS_PROPERTIES.POSITION]: index + 1,
      [ANALYTICS_PROPERTIES.ACTION]: isActionClose ? 'Close' : 'Open',
      [ANALYTICS_PROPERTIES.QUESTION_TEXT]:
        qnaSections[index]?.question?.content,
      ...qnaCommonEvents,
    });

    if (isActionClose) {
      resetAnswerLimit(index, true);
    } else {
      scrollToElementWrapper({
        questionIndex: index,
        openAccordion: true,
        event,
        scrollableWrapperRef,
        dashedQnaType,
      });
    }

    setAccordionStatusMap((prev) => ({
      ...prev,
      [clickedAccordionKey]: !prev[clickedAccordionKey],
    }));
  };

  const onLoadMoreFn = (questionIndex: number) => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.QNA_EVENTS.SEE_MORE_RESPONSES_CLICKED,
      [ANALYTICS_PROPERTIES.TAB_NAME]: dashedQnaType,
      [ANALYTICS_PROPERTIES.QUESTION_RANK]: questionIndex + 1,
      ...qnaCommonEvents,
    });

    if (increaseAnswerOnLoadMore) {
      const uniqueQuestionKey = `${dashedQnaType}-${questionIndex}`;
      const visibleAnswersCount =
        answerLimits[uniqueQuestionKey] || MIN_VISIBLE_ANSWER_COUNT;

      increaseAnswerLimit(questionIndex);
      scrollToElementWrapper({
        questionIndex,
        scrollToAnswerPosition: visibleAnswersCount,
        scrollableWrapperRef,
        dashedQnaType,
      });

      return;
    }

    setShowDrawer(true);
  };

  const questionCount = qnaSections.length;

  return (
    <StyledQnaAccordionContainer>
      {qnaSections?.map((questionSection, questionIndex) => {
        const { question, answers } = questionSection;
        const uniqueQuestionKey = dashedQnaType + '-' + questionIndex;
        const currentAnswerLimit =
          answerLimits[uniqueQuestionKey] || MIN_VISIBLE_ANSWER_COUNT;
        const isAccordionActive = accordionStatusMap[uniqueQuestionKey];

        return (
          <QnaAccordionBlock
            isActive={isAccordionActive}
            key={questionIndex}
            handleClickFn={(e: React.MouseEvent<HTMLElement>) =>
              handleAccordionClick({ index: questionIndex, event: e })
            }
            question={question.content}
            answers={answers.slice(0, currentAnswerLimit)}
            crawlableAnswers={answers}
            onLoadMore={() => onLoadMoreFn(questionIndex)}
            totalAnswersCount={answers.length}
            questionId={`${dashedQnaType}-${questionIndex}`}
            tabName={dashedQnaType}
            resetAnswerLimit={() => resetAnswerLimit(questionIndex)}
            isLastBlock={questionIndex === questionCount - 1}
            questionIndex={questionIndex}
            isLfcSection={isLfcSection}
          />
        );
      })}
    </StyledQnaAccordionContainer>
  );
};

export default QnaAccordionSection;
