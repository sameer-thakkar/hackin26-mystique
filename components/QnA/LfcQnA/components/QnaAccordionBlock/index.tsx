import { useContext, useEffect, useRef } from 'react';
import Conditional from 'components/common/Conditional';
import { Answer } from 'components/StaticBanner';
import Chevron from 'UI/Chevron';
import { QnaContext } from 'contexts/QnaContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import {
  MIN_VISIBLE_ANSWER_COUNT,
  QNA_LFC_SECTION,
  QNA_MODAL,
} from '../../constants';
import { CrawlableContent } from '../../styles';
import QnaAnswerCard from '../QnaAnswerCard';
import {
  StyledAnswersContainer,
  StyledAnswerWrapper,
  StyledQnaAccordionBlock,
  StyledQuestionContainer,
} from './styles';
import { TQnaAccordionBlock } from './types';

const QnaAccordionBlock = ({
  isActive,
  handleClickFn,
  question,
  answers,
  onLoadMore,
  totalAnswersCount,
  questionId,
  resetAnswerLimit,
  isLastBlock = false,
  crawlableAnswers,
  tabName,
  questionIndex = 0,
  isLfcSection = false,
}: TQnaAccordionBlock) => {
  const { qnaCommonEvents, showModal } = useContext(QnaContext);
  const questionRef = useRef<HTMLDivElement>(null);
  const isQuestionIntersecting = useOnScreen({
    ref: questionRef,
    unobserve: true,
  });

  useEffect(() => {
    if (isQuestionIntersecting) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.QNA_EVENTS.QNA_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: showModal ? QNA_MODAL : QNA_LFC_SECTION,
        [ANALYTICS_PROPERTIES.TAB_NAME]: tabName,
        ...(questionIndex !== undefined && {
          [ANALYTICS_PROPERTIES.POSITION]: questionIndex + 1,
        }),
        ...qnaCommonEvents,
      });
    }
  }, [isQuestionIntersecting]);

  return (
    <StyledQnaAccordionBlock
      id={questionId}
      ref={questionRef}
      $isLastBlock={isLastBlock}
    >
      <StyledQuestionContainer onClick={handleClickFn}>
        <h4>{question}</h4>
        <Chevron isActive={isActive} className="chevron-icon" />
      </StyledQuestionContainer>
      <StyledAnswerWrapper isVisible={isActive}>
        <StyledAnswersContainer>
          {answers.map((answer: Answer, answerIndex: number) => {
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
                answerId={`answer-${questionId}-${answerIndex}`}
                answerIndex={answerIndex}
                tabName={tabName}
                isLfcSection={isLfcSection}
              />
            );
          })}
        </StyledAnswersContainer>
        <CrawlableContent>
          {crawlableAnswers.map(
            (answer: Record<string, any>, answerIndex: number) => {
              const { content, customer, rating, timestamp } = answer;

              return (
                <QnaAnswerCard
                  key={answerIndex}
                  content={content}
                  customerName={customer.name}
                  rating={rating}
                  customerImgUrl={customer.profileImageUrl}
                  timestamp={timestamp}
                  answerId={`answer-${questionId}-${answerIndex}`}
                />
              );
            }
          )}
        </CrawlableContent>
        <Conditional if={totalAnswersCount > MIN_VISIBLE_ANSWER_COUNT}>
          <Conditional if={totalAnswersCount > answers.length}>
            <button className="more-responses-cta" onClick={onLoadMore}>
              {strings.SEE_MORE_RESPONSES}
            </button>
          </Conditional>
          <Conditional if={totalAnswersCount <= answers.length}>
            <button className="hide-responses-cta" onClick={resetAnswerLimit}>
              {strings.HIDE_RESPONSES}
            </button>
          </Conditional>
        </Conditional>
      </StyledAnswerWrapper>
    </StyledQnaAccordionBlock>
  );
};

export default QnaAccordionBlock;
