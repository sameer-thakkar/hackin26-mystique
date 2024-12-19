import { sentenceCase } from 'utils/stringUtils';
import {
  ANALYTICS_PLATFORM,
  ANALYTICS_PROPERTIES,
  PAGE_TYPES,
} from 'const/index';
import { TScrollToElementProps } from './components/QnaAccordionSection/types';
import {
  ANSWER_AUTO_SCROLL_BUFFER,
  INITIAL_VISIBLE_QUESTIONS_COUNT,
} from './constants';

export const getInitialAccordionStatus = ({
  tabsArray,
  dashedQnaType,
}: {
  tabsArray?: string[];
  dashedQnaType: string;
}): Record<string, boolean> => {
  if (!tabsArray || !tabsArray.length) {
    return { [`${dashedQnaType}-0`]: true };
  }

  return tabsArray.reduce((acc, tab) => {
    const dashedTabLabel = tab.replace(/ /g, '-');
    return { ...acc, [`${dashedTabLabel}-0`]: true };
  }, {} as Record<string, boolean>);
};

export const getQnaCommonDataEvents = (props: Record<string, any>) => {
  const { lang, collectionId, mbName, isMobile } = props;
  const events = {
    [ANALYTICS_PROPERTIES.LANGUAGE]: lang,
    [ANALYTICS_PROPERTIES.COLLECTION_ID]: collectionId,
    [ANALYTICS_PROPERTIES.PAGE_TYPE]: PAGE_TYPES.COLLECTION,
    [ANALYTICS_PROPERTIES.MB_NAME]: mbName,
    [ANALYTICS_PROPERTIES.PLATFORM_NAME]: isMobile
      ? ANALYTICS_PLATFORM.MOBILE
      : ANALYTICS_PLATFORM.DESKTOP,
  };

  return events;
};

export const formatCustomerName = (name: string) => {
  if (!name) return '';

  const sentenceCased = sentenceCase(name);

  return sentenceCased.length > 25
    ? `${sentenceCased.slice(0, 22)}...`
    : sentenceCased;
};

export const scrollToBottom = (wrapper: HTMLElement, buffer = 5) => {
  wrapper.scrollTo({
    top: wrapper.scrollHeight - wrapper.clientHeight - buffer,
    behavior: 'smooth',
  });
};

export const getInitialVisibleQuestionsCount = (tabsArray: string[]) => {
  return tabsArray.reduce((acc, _, index) => {
    return {
      ...acc,
      [index]: INITIAL_VISIBLE_QUESTIONS_COUNT,
    };
  }, {} as Record<number, number>);
};

export const scrollToElement = ({
  questionIndex = 0,
  scrollToAnswerPosition = 0,
  scrollToQuestion = false,
  openAccordion = false,
  event,
  scrollThreshold,
  prefixId = '',
  wrapper,
}: TScrollToElementProps & { wrapper: HTMLElement }) => {
  if (!wrapper) return;

  if (openAccordion && event) {
    const targetElement = event.target as HTMLElement;
    const clickedElemRect = targetElement?.getBoundingClientRect?.();

    if (!clickedElemRect) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const elementRelativePosition = clickedElemRect.top - wrapperRect.top;
    const distanceToBottom = wrapperRect.height - elementRelativePosition;
    const shouldScroll = distanceToBottom < scrollThreshold;

    if (shouldScroll) {
      requestAnimationFrame(() => {
        wrapper.scrollTo({
          top: wrapper.scrollTop + (scrollThreshold - distanceToBottom),
          behavior: 'smooth',
        });
      });
    }
    return;
  }

  const baseId = prefixId ? `${prefixId}-${questionIndex}` : `${questionIndex}`;
  const elementId = scrollToQuestion
    ? baseId
    : `answer-${baseId}-${scrollToAnswerPosition}`;

  const targetElement = wrapper.querySelector(`#${elementId}`);
  if (!targetElement) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const targetElemRect = targetElement.getBoundingClientRect();
  const scrollTop = targetElemRect.top - wrapperRect.top + wrapper.scrollTop;

  requestAnimationFrame(() => {
    wrapper.scrollTo({
      top: scrollTop - ANSWER_AUTO_SCROLL_BUFFER,
      behavior: 'smooth',
    });
  });
};
