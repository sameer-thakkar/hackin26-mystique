import React from 'react';
import Conditional from 'components/common/Conditional';
import { TReviewProps } from 'components/Product/interface';
import { ReviewCardWrapper } from 'components/Product/styles';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import DoubleQuotesIcon from 'assets/doubleQuotesIcon';

const Reviews = ({ reviewText, className, children }: TReviewProps) => {
  const trackClick = () => {
    trackEvent({
      eventName: ANALYTICS_EVENTS.EXP_COMPONENT_CLICKED,
      [ANALYTICS_PROPERTIES.COMPONENT_NAME]: 'Review Component',
    });
  };
  return (
    <ReviewCardWrapper onClick={trackClick} className={className}>
      <Conditional if={children}>{children}</Conditional>
      <Conditional if={!children}>
        <p className="review-label">{reviewText}</p>
        {DoubleQuotesIcon}
      </Conditional>
    </ReviewCardWrapper>
  );
};

export default Reviews;
