import { useCallback, useRef, useState } from 'react';
import Conditional from 'components/common/Conditional';
import { StyledAnswersContainer } from 'components/QnA/LfcQnA/components/QnaAccordionBlock/styles';
import { scrollToElementWrapper } from 'components/QnA/LfcQnA/components/QnaAccordionSection/utils';
import QnaAnswerCard from 'components/QnA/LfcQnA/components/QnaAnswerCard';
import ViewAllBtn from 'components/QnA/LfcQnA/components/ViewAllBtn';
import {
  INITIAL_VISIBLE_QUESTIONS_COUNT,
  MIN_VISIBLE_ANSWER_COUNT,
  QNA_DRAWER,
} from 'components/QnA/LfcQnA/constants';
import { scrollToBottom } from 'components/QnA/LfcQnA/utils';
import { QnAContainer } from 'components/StaticBanner';
import Chevron from 'UI/Chevron';
import { strings } from 'const/strings';
import {
  StyledAccordionBlock,
  StyledLfcQnaSnippet,
  StyledQnaAccordionContainer,
  StyledQuestionContainer,
} from './styles';
import { TAccordionBlock } from './types';

const LfcQnaSnippet = ({ qnaSections }: { qnaSections: QnAContainer }) => {
  const [visibleQnaSections, setVisibleQnaSections] = useState(
    INITIAL_VISIBLE_QUESTIONS_COUNT
  );
  const [accordionActiveIndexesMap, setAccordionActiveIndexesMap] = useState<
    Record<string, boolean>
  >({ 0: true });
  const [answerLimits, setAnswerLimits] = useState<number[]>([]);

  const scrollableWrapperRef = useRef<HTMLDivElement>(null);

  const totalQuestionsCount = qnaSections?.qna?.length;

  const increaseAnswerLimit = (sectionIndex: number) => {
    setAnswerLimits((prev) => {
      const newLimits = [...prev];
      const currentLimit = prev[sectionIndex] ?? 2;
      const totalAnswersCount = qnaSections?.qna[sectionIndex].answers.length;
      newLimits[sectionIndex] = Math.min(currentLimit + 3, totalAnswersCount);
      return newLimits;
    });
  };

  const decreaseAnswerLimit = ({
    sectionIndex,
    noScroll = false,
  }: {
    sectionIndex: number;
    noScroll?: boolean;
  }) => {
    setAnswerLimits((prev) => {
      const newLimits = [...prev];
      newLimits[sectionIndex] = 2;
      return newLimits;
    });

    if (!noScroll) {
      scrollToElementWrapper({
        questionIndex: sectionIndex,
        scrollToQuestion: true,
        scrollToAnswerPosition: 0,
        scrollableWrapperRef,
      });
    }
  };

  const handleAccordionClick = ({
    index,
    event,
  }: {
    index: number;
    event?: React.MouseEvent<HTMLElement>;
  }) => {
    setAccordionActiveIndexesMap((prev) => {
      const isUserActionClose = prev[index];
      const newState = {
        ...prev,
        [index]: !prev[index],
      };

      if (isUserActionClose) {
        decreaseAnswerLimit({ sectionIndex: index, noScroll: true });
      } else {
        scrollToElementWrapper({
          questionIndex: index,
          openAccordion: true,
          event,
          scrollableWrapperRef,
        });
      }

      return newState;
    });
  };

  const handleViewAllQnA = useCallback(() => {
    setVisibleQnaSections((prev) =>
      Math.min(prev + 3, qnaSections?.qna?.length)
    );

    const wrapperRef = scrollableWrapperRef?.current;
    if (!wrapperRef) return;

    setTimeout(() => {
      scrollToBottom(wrapperRef);
    }, 200);
  }, [qnaSections?.qna?.length]);

  const onLoadMoreFn = (questionIndex: number) => {
    const visibleAnswersCount =
      answerLimits[questionIndex] || MIN_VISIBLE_ANSWER_COUNT;

    increaseAnswerLimit(questionIndex);
    scrollToElementWrapper({
      questionIndex,
      scrollToAnswerPosition: visibleAnswersCount,
      scrollableWrapperRef,
    });
  };

  return (
    <StyledLfcQnaSnippet ref={scrollableWrapperRef}>
      <StyledQnaAccordionContainer>
        {qnaSections?.qna
          ?.slice(0, visibleQnaSections)
          .map(
            (questionSection: Record<string, any>, questionIndex: number) => {
              const { question, answers } = questionSection;
              const isCurrentQuestionActive =
                accordionActiveIndexesMap[questionIndex];
              const currentAnswerLimit = isCurrentQuestionActive
                ? answerLimits[questionIndex] || 2
                : 0;

              return (
                <AccordionBlock
                  key={questionIndex}
                  isActive={isCurrentQuestionActive}
                  handleClickFn={(e: React.MouseEvent<HTMLElement>) =>
                    handleAccordionClick({ index: questionIndex, event: e })
                  }
                  question={question.content}
                  answers={answers.slice(0, currentAnswerLimit)}
                  onLoadMore={() => onLoadMoreFn(questionIndex)}
                  onHideMore={() =>
                    decreaseAnswerLimit({ sectionIndex: questionIndex })
                  }
                  totalAnswersCount={answers.length}
                  isLastBlock={
                    questionIndex === totalQuestionsCount - 1 ||
                    questionIndex === visibleQnaSections - 1
                  }
                  isFirstBlock={questionIndex === 0}
                  currentAnswerLimit={currentAnswerLimit}
                  questionId={`${questionIndex}`}
                />
              );
            }
          )}
        {visibleQnaSections < qnaSections?.qna?.length && (
          <ViewAllBtn
            sectionName={QNA_DRAWER}
            handleOnClickFn={handleViewAllQnA}
            label={strings.EXPLORE_MORE_QUESTIONS}
          />
        )}
      </StyledQnaAccordionContainer>
    </StyledLfcQnaSnippet>
  );
};

const AccordionBlock = ({
  isActive,
  handleClickFn,
  question,
  answers,
  onLoadMore,
  onHideMore,
  totalAnswersCount,
  isLastBlock = false,
  isFirstBlock = false,
  currentAnswerLimit,
  questionId = 'no-type',
}: TAccordionBlock) => {
  return (
    <StyledAccordionBlock
      id={questionId}
      $isLastBlock={isLastBlock}
      $isFirstBlock={isFirstBlock}
    >
      <StyledQuestionContainer onClick={handleClickFn}>
        <h4>{question}</h4>
        <Chevron
          isActive={isActive}
          activeCursor={true}
          className={'chevron-icon'}
        />
      </StyledQuestionContainer>
      <Conditional if={isActive}>
        <StyledAnswersContainer>
          {answers.map((answer: Record<string, any>, answerIndex: number) => {
            const { content, customer, rating, timestamp } = answer;
            const { name, profileImageUrl } = customer;

            return (
              <QnaAnswerCard
                key={answerIndex}
                content={content}
                customerName={name}
                rating={rating}
                customerImgUrl={profileImageUrl}
                timestamp={timestamp}
                $lastBlock={answerIndex === answers.length - 1}
                answerId={`answer-${questionId}-${answerIndex}`}
              />
            );
          })}
        </StyledAnswersContainer>
        {currentAnswerLimit < totalAnswersCount && (
          <button className="more-responses-cta" onClick={onLoadMore}>
            {strings.SEE_MORE_RESPONSES}
          </button>
        )}
        {totalAnswersCount > 2 && currentAnswerLimit === totalAnswersCount && (
          <button className="hide-responses-cta" onClick={onHideMore}>
            {strings.HIDE_RESPONSES}
          </button>
        )}
      </Conditional>
    </StyledAccordionBlock>
  );
};

export default LfcQnaSnippet;
