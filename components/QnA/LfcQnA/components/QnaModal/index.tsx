import {
  createRef,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactModal from 'react-modal';
import { useRecoilValue } from 'recoil';
import Conditional from 'components/common/Conditional';
import CloseButton from 'components/Product/components/Popup/CloseButton';
import { QnaContext } from 'contexts/QnaContext';
import { truncateNumber } from 'utils';
import { trackEvent } from 'utils/analytics';
import { appAtom } from 'store/atoms/app';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PROPERTIES,
  UID_TO_COUNT_MAPPING,
} from 'const/index';
import { strings } from 'const/strings';
import { QNA_MODAL } from '../../constants';
import { getInitialVisibleQuestionsCount, scrollToBottom } from '../../utils';
import QnaAccordionSection from '../QnaAccordionSection';
import QnaTabs from '../QnaTabs';
import ViewAllBtn from '../ViewAllBtn';
import {
  StyledBottomSpacer,
  StyledCloseBtnWrapper,
  StyledModalHeader,
  StyledModalHeaderTop,
  StyledQnaModalBody,
  StyledQnaModalContainer,
} from './styles';
import { TQnaModal } from './types';

const QnaModal = ({ qnaSections, tabsArray }: TQnaModal) => {
  const initialVisibleQuestionsCount =
    getInitialVisibleQuestionsCount(tabsArray);

  const { showModal, setShowModal, qnaCommonEvents } = useContext(QnaContext);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [visibleQuestionsCount, setVisibleQuestionsCount] = useState<
    Record<number, number>
  >(initialVisibleQuestionsCount);
  const { uid } = useRecoilValue(appAtom);

  const scrollRefs = useRef<Record<number, RefObject<HTMLDivElement>>>({});
  const popupStyles = {
    overlay: {
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      transition: 'opacity .5s cubic-bezier(0.7, 0, 0.3, 1)',
      opacity: isVisible ? 1 : 0,
    },
    content: {
      maxWidth: 792,
      margin: '2rem auto 2.625rem',
      borderRadius: 12,
      overflow: 'hidden',
      padding: 0,
      border: 'none',
      top: '2.5rem',
      transition: 'all .5s cubic-bezier(0.7, 0, 0.3, 1)',
      opacity: isVisible ? 1 : 0,
      transform: `scale(${isVisible ? 1 : 0.8})`,
    },
  };

  const getScrollRef = useCallback((tabIndex: number) => {
    if (!scrollRefs?.current[tabIndex]) {
      scrollRefs.current[tabIndex] = createRef<HTMLDivElement>();
    }
    return scrollRefs.current[tabIndex];
  }, []);

  const trackModalToggleEvent = (isOpen: boolean) => {
    trackEvent({
      eventName: isOpen
        ? ANALYTICS_EVENTS.QNA_EVENTS.QNA_MODAL_OPENED
        : ANALYTICS_EVENTS.QNA_EVENTS.QNA_MODAL_CLOSED,
      [ANALYTICS_PROPERTIES.FLOW_TYPE]: QNA_MODAL,
      ...qnaCommonEvents,
    });
  };

  const open = () => {
    setTimeout(() => setIsVisible(true), 100);
    trackModalToggleEvent(true);
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowModal(false);
      setVisibleQuestionsCount(initialVisibleQuestionsCount);
      setActiveTabIndex(0);
    }, 500);

    document.body.style.overflow = 'auto';
    trackModalToggleEvent(false);
  };

  const activeSection = useMemo(
    () => qnaSections[activeTabIndex],
    [qnaSections, activeTabIndex]
  );
  const visibleQuestions = useMemo(
    () => activeSection?.qna?.slice?.(0, visibleQuestionsCount[activeTabIndex]),
    [activeSection, visibleQuestionsCount, activeTabIndex]
  );

  const handleViewAllQnA = (scrollableRef?: RefObject<HTMLDivElement>) => {
    setVisibleQuestionsCount((prev) => ({
      ...prev,
      [activeTabIndex]: Math.min(
        prev[activeTabIndex] + 3,
        activeSection?.qna?.length
      ),
    }));

    const wrapper = scrollableRef?.current;

    if (!wrapper) {
      return;
    }

    setTimeout(() => {
      scrollToBottom(wrapper);
    }, 200);
  };

  const handleTabClickFn = (index: number) => {
    setActiveTabIndex(index);

    trackEvent({
      eventName: ANALYTICS_EVENTS.QNA_EVENTS.QNA_TAB_CLICKED,
      [ANALYTICS_PROPERTIES.FLOW_TYPE]: QNA_MODAL,
      [ANALYTICS_PROPERTIES.TAB_NAME]: tabsArray[index],
      ...qnaCommonEvents,
    });
  };

  useEffect(() => {
    if (showModal) {
      open();
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  const totalQuestionsInTab = qnaSections[activeTabIndex]?.qna?.length;
  const isTabsVisible = tabsArray.length > 1;

  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={() => {
        close();
      }}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      shouldReturnFocusAfterClose
      preventScroll={true}
      style={popupStyles}
      portalClassName={`popup-qna`}
    >
      <StyledQnaModalContainer>
        <StyledModalHeader $isTabsVisible={isTabsVisible}>
          <StyledModalHeaderTop>
            <h4>
              {strings.formatString(
                strings.ADVICE_FROM_TRAVELLERS,
                `${truncateNumber(
                  UID_TO_COUNT_MAPPING[uid as keyof typeof UID_TO_COUNT_MAPPING]
                ).toUpperCase()}+`
              )}
            </h4>
            <StyledCloseBtnWrapper>
              <CloseButton isHighlighted={true} onClick={close} />
            </StyledCloseBtnWrapper>
          </StyledModalHeaderTop>
          <Conditional if={isTabsVisible}>
            <QnaTabs
              activeTabIndex={activeTabIndex}
              handleTabClickFn={handleTabClickFn}
              tabsArray={tabsArray}
            />
          </Conditional>
        </StyledModalHeader>
        {tabsArray.map((_, index) => {
          const scrollableRef = getScrollRef(index);

          return (
            <StyledQnaModalBody
              $isActiveTab={index === activeTabIndex}
              ref={scrollableRef}
              key={index}
              $isTabsVisible={isTabsVisible}
            >
              <QnaAccordionSection
                increaseAnswerOnLoadMore={true}
                qnaSections={visibleQuestions}
                qnaType={tabsArray[activeTabIndex]}
                tabsArray={tabsArray}
                scrollableWrapperRef={scrollableRef}
              />
              <Conditional
                if={visibleQuestionsCount[activeTabIndex] < totalQuestionsInTab}
              >
                <ViewAllBtn
                  sectionName={QNA_MODAL}
                  handleOnClickFn={() => handleViewAllQnA(scrollableRef)}
                  label={strings.EXPLORE_MORE_QUESTIONS}
                />
              </Conditional>

              <StyledBottomSpacer />
            </StyledQnaModalBody>
          );
        })}
      </StyledQnaModalContainer>
    </ReactModal>
  );
};

export default QnaModal;
