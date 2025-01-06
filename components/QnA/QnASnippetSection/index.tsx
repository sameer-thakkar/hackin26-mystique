import React, { useContext, useEffect, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import Drawer from 'components/common/Drawer';
import SwipeableTabs from 'components/common/SwipeableTabs';
import { QnAContainer } from 'components/StaticBanner';
import { MBContext } from 'contexts/MBContext';
import { QnaContext, QnaContextProvider } from 'contexts/QnaContext';
import useOnScreen from 'hooks/useOnScreen';
import { truncateNumber } from 'utils';
import { trackEvent } from 'utils/analytics';
import { getHostName } from 'utils/helper';
import { getRandomReviewerImage } from 'utils/reviewUtils';
import { sentenceCase } from 'utils/stringUtils';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  UID_TO_COUNT_MAPPING,
} from 'const/index';
import { strings } from 'const/strings';
import GreenTickSvg from 'assets/greenTick';
import QnaCharacter from 'assets/qnaCharacter';
import { SmileySvg } from 'assets/smiley';
import QnaModal from '../LfcQnA/components/QnaModal';
import { QNA_SNIPPET_SECTION } from '../LfcQnA/constants';
import { LfcSectionHeading } from '../LfcQnA/styles';
import { getQnaCommonDataEvents } from '../LfcQnA/utils';
import LfcQnaSnippet from './components/Qna';
import SnippetCard from './components/SnippetCard';
import { TQnASnippetSectionProps } from './interface';
import {
  CardContainer,
  Character,
  DrawerStyles,
  SmileyContainer,
  SnippetContainer,
  Wrapper,
} from './styles';

const QnaSnippetSectionChild = ({
  isMobile,
  qnaSnippets,
  qnaSections,
  collectionId,
}: TQnASnippetSectionProps) => {
  const { uid } = useRecoilValue(appAtom);
  const { showDrawer, setShowDrawer, setShowModal, setQnaCommonEvents } =
    useContext(QnaContext);
  const snippetRef = React.useRef(null);
  const isSnippetIntersecting = useOnScreen({
    ref: snippetRef,
    unobserve: true,
  });

  const { lang, isDev, host } = useContext(MBContext);
  const mbName = getHostName(isDev, host);

  const events = useMemo(() => {
    return getQnaCommonDataEvents({
      lang,
      isMobile,
      mbName,
      collectionId,
    });
  }, [lang, isMobile, mbName, collectionId]);

  useEffect(() => {
    if (Object.keys(events).length > 0) {
      setQnaCommonEvents(events);
    }
  }, [events, setQnaCommonEvents]);

  useEffect(() => {
    if (isSnippetIntersecting)
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: QNA_SNIPPET_SECTION,
        ...events,
      });
  }, [isSnippetIntersecting, events]);

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

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    trackCardClickEvent();

    if (isMobile) setShowDrawer(true);
    else {
      setShowModal(true);
    }
  };

  const tabsLabelArray = qnaSections.map((qnaSection: QnAContainer) =>
    sentenceCase(qnaSection.type)
  );

  const imageUrls = useMemo(() => {
    return qnaSnippets.map(({ answer: { customer } }) => ({
      id: customer.id,
      imageUrl: getRandomReviewerImage(customer?.name),
    }));
  }, [qnaSnippets]);

  const isTabsVisible = tabsLabelArray.length > 1;

  return (
    <SnippetContainer ref={snippetRef}>
      <Conditional if={!isMobile}>
        <Character>
          <QnaCharacter />
        </Character>
        <SmileyContainer>
          <SmileySvg />
        </SmileyContainer>
      </Conditional>
      <Wrapper>
        <LfcSectionHeading>
          <h2 className="section-heading">{strings.ASKED_AND_ANSWERED}</h2>

          <div className="guest-count">
            <div>
              <GreenTickSvg />
              <p className="guest-count-number">
                {truncateNumber(
                  UID_TO_COUNT_MAPPING[uid as keyof typeof UID_TO_COUNT_MAPPING]
                ).toUpperCase()}
                +
              </p>
            </div>

            <span>{strings.RESPONSES}</span>
          </div>
        </LfcSectionHeading>

        <CardContainer>
          {qnaSnippets.map(({ question, answer }, index) => (
            <SnippetCard
              cardIndex={index}
              isMobile={isMobile}
              handleCardClick={handleCardClick}
              imageUrl={imageUrls[index].imageUrl}
              key={index}
              question={question}
              answer={answer}
            />
          ))}
        </CardContainer>
      </Wrapper>
      <Conditional if={showDrawer && isMobile}>
        <Drawer
          $drawerStyles={DrawerStyles({ isTabsVisible })}
          closeHandler={() => setShowDrawer(false)}
          noMargin
          coverHeaderInShadow
        >
          <h2>{strings.ASKED_AND_ANSWERED}</h2>
          <SwipeableTabs tabs={tabsArray} />
        </Drawer>
      </Conditional>
      <Conditional if={!isMobile}>
        <QnaModal tabsArray={tabsLabelArray} qnaSections={qnaSections} />
      </Conditional>
    </SnippetContainer>
  );
};

const QnASnippetSection = (props: TQnASnippetSectionProps) => {
  return (
    <QnaContextProvider>
      <QnaSnippetSectionChild {...props} />
    </QnaContextProvider>
  );
};
type TabItemType = {
  body: React.ReactNode;
  header: any;
};

export const createTabItem = (section: QnAContainer): TabItemType => {
  return {
    body: <LfcQnaSnippet qnaSections={section} />,
    header: sentenceCase(section.type),
  };
};

export default QnASnippetSection;
