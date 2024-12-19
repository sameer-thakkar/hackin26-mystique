import { useContext, useEffect, useRef, useState } from 'react';
import { getIntlDate } from '@headout/espeon/utils';
import Conditional from 'components/common/Conditional';
import { RatingStars } from 'components/ReviewsPage/components/ReviewCount';
import Image from 'UI/Image';
import { QnaContext } from 'contexts/QnaContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { isMobile } from 'utils/helper';
import { getRandomReviewerImage } from 'utils/reviewUtils';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { QNA_LFC_SECTION, QNA_MODAL } from '../../constants';
import {
  StyledAnswerCardInfoRight,
  StyledAnswerCardInfoWrapper,
  StyledAnswerContent,
  StyledImgWrapper,
  StyledQnaAnswerCard,
} from './styles';
import { TQnaAnswerCard } from './types';

const QnaAnswerCard = ({
  content,
  customerName,
  rating,
  customerImgUrl,
  timestamp,
  answerId,
  $lastBlock,
  tabName = 'no-type',
  answerIndex,
  isLfcSection = false,
}: TQnaAnswerCard) => {
  const isDesktop = !isMobile();

  const [isContentTruncated, setIsContentTruncated] = useState(false);
  const [showReadMoreCta, setShowReadMoreCta] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen({ ref: contentRef, unobserve: true });

  const { setShowModal, setShowDrawer, showModal, qnaCommonEvents } =
    useContext(QnaContext);

  useEffect(() => {
    const checkTruncation = () => {
      const contentElement = contentRef.current;
      if (!contentElement) return;

      const isTruncated =
        contentElement.scrollHeight > contentElement.clientHeight;

      setIsContentTruncated(isTruncated);
    };

    checkTruncation();
  }, [isIntersecting]);

  const handleOnBtnClick = () => {
    if (!isContentTruncated && !isLfcSection) {
      return;
    }

    trackEvent({
      eventName: showReadMoreCta
        ? ANALYTICS_EVENTS.QNA_EVENTS.READ_MORE_CLICKED
        : ANALYTICS_EVENTS.QNA_EVENTS.READ_LESS_CLICKED,
      [ANALYTICS_PROPERTIES.SECTION]: showModal ? QNA_MODAL : QNA_LFC_SECTION,
      [ANALYTICS_PROPERTIES.TAB_NAME]: tabName,
      ...(answerIndex && { [ANALYTICS_PROPERTIES.POSITION]: answerIndex + 1 }),
      ...qnaCommonEvents,
    });

    if (isLfcSection) {
      if (isDesktop) {
        setShowModal(true);
      } else {
        setShowDrawer(true);
      }
      return;
    }

    setShowReadMoreCta((prev) => !prev);
  };

  return (
    <StyledQnaAnswerCard id={answerId} $lastBlock={$lastBlock}>
      <StyledAnswerCardInfoWrapper>
        <StyledImgWrapper>
          <Image
            className="reviewer-image"
            url={customerImgUrl ?? getRandomReviewerImage(customerName)}
            alt="critic"
          />
        </StyledImgWrapper>
        <StyledAnswerCardInfoRight>
          <div className="reviewer-info">
            <p className="reviewer-name">{customerName}</p>
            <div className="reviewer-rating">
              <RatingStars averageRating={rating} />
            </div>
          </div>
          <p className="date-block">
            {getIntlDate({
              lang: 'en',
              date: new Date(timestamp).toString(),
              dateFormat: 'MMM-YYYY',
            })}
          </p>
        </StyledAnswerCardInfoRight>
      </StyledAnswerCardInfoWrapper>

      <StyledAnswerContent
        onClick={handleOnBtnClick}
        $showReadMore={showReadMoreCta}
      >
        <p ref={contentRef}>{content}</p>
        <Conditional if={isContentTruncated}>
          <button className="read-more">
            <span>{strings.READ_MORE}</span>
            <span className="plus-icon">+</span>
          </button>
          <button className="show-less">
            <span>{strings.SHOW_LESS}</span>
            <span className="minus-icon">-</span>
          </button>
        </Conditional>
      </StyledAnswerContent>
    </StyledQnaAnswerCard>
  );
};
export default QnaAnswerCard;
