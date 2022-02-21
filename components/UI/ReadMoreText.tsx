import { useState } from 'react';
import styled from 'styled-components';
import { trackEvent } from 'utils/analytics';
import { strings } from 'const/strings';
import { COLORS } from 'const/ui-constants';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';

const ReadMoreButton = styled.span`
  font-size: 0.875rem;
  color: ${COLORS.PURPS3};
  cursor: pointer;
`;

interface Props {
  text: string;
  textLimit: number;
  reviewIndex: number;
  tgid: number;
}

const ReadMoreText: React.FC<Props> = ({
  text,
  textLimit,
  reviewIndex,
  tgid,
}) => {
  const [isReadMore, setIsReadMore] = useState(true);

  const readMoreClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.READ_MORE_REVIEWS_CLICKED,
      [ANALYTICS_PROPERTIES.REVIEW_RANK]: reviewIndex,
      [ANALYTICS_PROPERTIES.TGID]: tgid,
    });
    setIsReadMore(false);
  };

  return (
    <>
      {isReadMore && text.length > textLimit ? (
        <>
          <span>{`${text.slice(0, textLimit)}...`}</span>
          <ReadMoreButton role="button" tabIndex={-1} onClick={readMoreClick}>
            {` ${strings.READ_MORE} +`}
          </ReadMoreButton>
        </>
      ) : (
        <span>{text}</span>
      )}
    </>
  );
};

export default ReadMoreText;
