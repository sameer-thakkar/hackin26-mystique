import React, { useContext, useEffect, useMemo, useRef } from 'react';
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
import { sentenceCase } from 'utils/stringUtils';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  UID_TO_COUNT_MAPPING,
} from 'const/index';
import { strings } from 'const/strings';
import { UNDERLINE } from 'assets/underline';
import { createTabItem } from '../QnASnippetSection';
import { DrawerStyles } from '../QnASnippetSection/styles';
import LfcDWebSection from './components/LfcDWebSection';
import QnaAccordionSection from './components/QnaAccordionSection';
import QnaModal from './components/QnaModal';
import {
  Heading,
  InfoCopy,
  UnderlinedText,
} from './components/QnaSnippet2.0/styles';
import ViewAllBtn from './components/ViewAllBtn';
import { QNA_LFC_SECTION } from './constants';
import { CrawlableContent, StyledLfcQnaSection } from './styles';
import { TLfcQnaProps } from './types';
import { getQnaCommonDataEvents } from './utils';

const LfcQnaChild = ({ qnaSections, isMobile, collectionId }: TLfcQnaProps) => {
  const { setShowModal, setShowDrawer, showDrawer, setQnaCommonEvents } =
    useContext(QnaContext);
  const { lang, isDev, host } = useContext(MBContext);
  const mbName = getHostName(isDev, host);
  const { uid } = useRecoilValue(appAtom);

  const lfcSectionRef = useRef<HTMLDivElement>(null);

  const isIntersecting = useOnScreen({ ref: lfcSectionRef, unobserve: true });

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
    if (isIntersecting)
      trackEvent({
        eventName: ANALYTICS_EVENTS.MICROSITE_PAGE_SECTION_VIEWED,
        [ANALYTICS_PROPERTIES.SECTION]: QNA_LFC_SECTION,
        ...events,
      });
  }, [isIntersecting, events]);

  const handleOnCtaClick = () => {
    if (isMobile) {
      setShowDrawer(true);
      return;
    }
    setShowModal(true);
  };

  const tabsLabelArray = qnaSections.map((qnaSection: QnAContainer) =>
    sentenceCase(qnaSection.type)
  );

  let tabsArray = useMemo(() => {
    return qnaSections.map((section) => createTabItem(section));
  }, [qnaSections]);

  const isTabsVisible = tabsArray.length > 1;

  return (
    <StyledLfcQnaSection ref={lfcSectionRef}>
      <Heading>
        {strings.formatString(
          strings.ADVICE,
          <UnderlinedText>
            <span className="blue">
              {truncateNumber(
                UID_TO_COUNT_MAPPING[uid as keyof typeof UID_TO_COUNT_MAPPING]
              ).toUpperCase()}
              +
            </span>
            {UNDERLINE}
          </UnderlinedText>
        )}
        <InfoCopy
          dangerouslySetInnerHTML={{
            __html: strings.REAL_TIPS,
          }}
        />
      </Heading>
      <div className="lfc-qna-body-wrapper">
        <Conditional if={isMobile}>
          <QnaAccordionSection
            isLfcSection={true}
            qnaSections={qnaSections[0]?.qna?.slice?.(0, 2) || []}
          />
          <CrawlableContent>
            {qnaSections.map((sections: QnAContainer, index: number) => {
              return (
                <QnaAccordionSection qnaSections={sections.qna} key={index} />
              );
            })}
          </CrawlableContent>
        </Conditional>
        <Conditional if={!isMobile}>
          <LfcDWebSection
            qnaSections={qnaSections[0]?.qna?.slice?.(0, 2) || []}
          />
          <CrawlableContent>
            {qnaSections.map((sections: QnAContainer, index: number) => {
              return <LfcDWebSection qnaSections={sections.qna} key={index} />;
            })}
          </CrawlableContent>
          <QnaModal tabsArray={tabsLabelArray} qnaSections={qnaSections} />
        </Conditional>

        <ViewAllBtn
          sectionName={QNA_LFC_SECTION}
          handleOnClickFn={handleOnCtaClick}
        />
      </div>
      <Conditional if={showDrawer && isMobile}>
        <Drawer
          $drawerStyles={DrawerStyles({ isTabsVisible })}
          closeHandler={() => setShowDrawer(false)}
          noMargin
          coverHeaderInShadow
        >
          <h2>
            {strings.formatString(
              strings.ADVICE_FROM_TRAVELLERS,
              `${truncateNumber(
                UID_TO_COUNT_MAPPING[uid as keyof typeof UID_TO_COUNT_MAPPING]
              ).toUpperCase()}+`
            )}
          </h2>
          <SwipeableTabs tabs={tabsArray} />
        </Drawer>
      </Conditional>
    </StyledLfcQnaSection>
  );
};

const LfcQna = (props: TLfcQnaProps) => {
  return (
    <QnaContextProvider>
      <LfcQnaChild {...props} />
    </QnaContextProvider>
  );
};

export default React.memo(LfcQna);
