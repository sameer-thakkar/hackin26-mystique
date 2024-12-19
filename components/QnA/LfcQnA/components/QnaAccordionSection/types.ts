export type TQnaAccordionSection = {
  qnaSections: Record<string, any>[];
  increaseAnswerOnLoadMore?: boolean;
  qnaType?: string;
  tabsArray?: string[];
  scrollableWrapperRef?: React.RefObject<HTMLElement>;
  isLfcSection?: boolean;
};

export type TScrollToElementProps = {
  questionIndex?: number;
  scrollToAnswerPosition?: number;
  scrollToQuestion?: boolean;
  openAccordion?: boolean;
  event?: React.MouseEvent<HTMLElement>;
  scrollThreshold: number;
  prefixId?: string;
};

export type TUserAction = 'Open' | 'Close';

export type TScrollWrapperProps = {
  scrollableWrapperRef?: React.RefObject<HTMLElement>;
  dashedQnaType?: string;
  questionIndex?: number;
  scrollToAnswerPosition?: number;
  scrollToQuestion?: boolean;
  openAccordion?: boolean;
  event?: React.MouseEvent<HTMLElement>;
};
