import { useCallback, useContext } from 'react';
import { QnaContext } from 'contexts/QnaContext';
import { trackEvent } from 'utils/analytics';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { StyledViewAllBtn } from './styles';
import { TViewAllBtnProps } from './types';

const ViewAllBtn = ({
  handleOnClickFn,
  sectionName,
  label,
}: TViewAllBtnProps) => {
  const { qnaCommonEvents } = useContext(QnaContext);

  const handleOnViewAllCtaClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      trackEvent({
        eventName: ANALYTICS_EVENTS.QNA_EVENTS.VIEW_ALL_CTA_CLICKED,
        [ANALYTICS_PROPERTIES.SECTION]: sectionName,
        ...qnaCommonEvents,
      });

      handleOnClickFn(e);
    },
    [handleOnClickFn, sectionName, qnaCommonEvents]
  );

  const btnLabel = label || strings.EXPLORE_ALL;

  return (
    <StyledViewAllBtn
      onClick={handleOnViewAllCtaClick}
      className="all-qas-cta"
      type="button"
      aria-label="View all questions and answers"
    >
      {btnLabel}
    </StyledViewAllBtn>
  );
};

export default ViewAllBtn;
