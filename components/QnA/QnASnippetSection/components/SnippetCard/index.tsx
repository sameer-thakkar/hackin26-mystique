import { useContext, useEffect, useRef } from 'react';
import {
  StyledAnswerCardInfoRight,
  StyledAnswerCardInfoWrapper,
  StyledImgWrapper,
} from 'components/QnA/LfcQnA/components/QnaAnswerCard/styles';
import { TAG_COLOR_OPTIONS } from 'components/QnA/LfcQnA/constants';
import { formatCustomerName } from 'components/QnA/LfcQnA/utils';
import { RatingStars } from 'components/ReviewsPage/components/ReviewCount';
import Image from 'UI/Image';
import { QnaContext } from 'contexts/QnaContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { truncate } from 'utils/helper';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import BlackRightArrow from 'assets/blackRightArrow';
import { Answer, Card, CTA, Tag } from '../../styles';
import { TQnaSnippetCard } from './types';

const SnippetCard = ({
  handleCardClick,
  question,
  answer,
  isMobile,
  cardIndex,
  imageUrl,
}: TQnaSnippetCard) => {
  const { tag } = question;
  const { content, customer, rating } = answer;
  const truncatedContent = truncate(content, isMobile ? 97 : 179);
  const { bgColor, textColor } = TAG_COLOR_OPTIONS[cardIndex % 3];
  const { qnaCommonEvents } = useContext(QnaContext);

  const cardRef = useRef(null);
  const isCardIntersecting = useOnScreen({
    ref: cardRef,
    unobserve: true,
    options: {
      threshold: 0.5,
    },
  });

  useEffect(() => {
    if (isCardIntersecting && isMobile) {
      trackEvent({
        eventName: ANALYTICS_EVENTS.QNA_EVENTS.QNA_BANNER_VIEWED,
        [ANALYTICS_PROPERTIES.POSITION]: cardIndex + 1,
        ...qnaCommonEvents,
      });
    }
  }, [isCardIntersecting]);

  return (
    <Card ref={cardRef} onClick={handleCardClick} className="snippet-card">
      <Tag $bgColor={bgColor} $textColor={textColor}>
        {tag}
      </Tag>
      <StyledAnswerCardInfoWrapper>
        <StyledImgWrapper $isSnippetSection={true}>
          <Image className="reviewer-image" url={imageUrl} alt="critic" />
        </StyledImgWrapper>
        <StyledAnswerCardInfoRight $isSnippetSection={true}>
          <div className="reviewer-info">
            <p className="reviewer-name">
              {truncate(formatCustomerName(customer.name), isMobile ? 18 : 28)}
            </p>
            <div className="reviewer-rating">
              <RatingStars averageRating={rating} />
            </div>
          </div>
        </StyledAnswerCardInfoRight>
      </StyledAnswerCardInfoWrapper>
      <div className="answer-body">
        <Answer>{truncatedContent}</Answer>
        <CTA className="see-more-responses-cta">
          <span>{strings.SEE_MORE_RESPONSES}</span>
          {BlackRightArrow}
        </CTA>
      </div>
    </Card>
  );
};

export default SnippetCard;
