import Conditional from 'components/common/Conditional';
import { CrawlableContent } from 'components/QnA/LfcQnA/styles';
import { Answer } from 'components/StaticBanner';
import { strings } from 'const/strings';
import { RightArrowSvg } from 'assets/rightArrowSvg';
import QnaAnswerCard from '../../../QnaAnswerCard';
import { StyledLfcDWebRow } from '../../styles';

const QnaLfcDWebRow = ({
  question,
  answers,
  onLoadMore,
  tag,
  crawlableAnswers,
}: {
  question: string;
  answers: Answer[];
  onLoadMore: () => void;
  tag: string;
  crawlableAnswers: Answer[];
}) => {
  return (
    <StyledLfcDWebRow>
      <button className="question-block" onClick={onLoadMore}>
        <div className="question-block-header">
          <p>{tag}</p>
          <h4>{question}</h4>
        </div>
        <button className="see-more-responses-cta">
          {strings.SEE_MORE_RESPONSES}
          <RightArrowSvg />
        </button>
      </button>
      <div className="reviews-container">
        {answers.map((answer: Record<string, any>, index: number) => {
          const { content, customer, rating, timestamp } = answer;

          return (
            <>
              <div className="answer-card-wrapper">
                <QnaAnswerCard
                  key={index}
                  content={content}
                  customerName={customer.name}
                  rating={rating}
                  customerImgUrl={customer.profileImageUrl}
                  timestamp={timestamp}
                  minContentLen={160}
                  isLfcSection={true}
                />
              </div>
              <Conditional if={index === 0}>
                <div className="vertical-line"></div>
              </Conditional>
            </>
          );
        })}
        {
          <CrawlableContent>
            {crawlableAnswers.map(
              (answer: Record<string, any>, index: number) => {
                const { content, customer, rating, timestamp } = answer;

                return (
                  <>
                    <div className="answer-card-wrapper">
                      <QnaAnswerCard
                        key={index}
                        content={content}
                        customerName={customer.name}
                        rating={rating}
                        customerImgUrl={customer.profileImageUrl}
                        timestamp={timestamp}
                        minContentLen={160}
                      />
                    </div>
                  </>
                );
              }
            )}
          </CrawlableContent>
        }
      </div>
    </StyledLfcDWebRow>
  );
};

export default QnaLfcDWebRow;
