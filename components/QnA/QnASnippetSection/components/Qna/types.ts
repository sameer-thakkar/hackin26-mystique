export type TAccordionBlock = {
  isActive: boolean;
  handleClickFn: (e: any) => void;
  question: Record<string, any>;
  answers: Record<string, any>;
  onLoadMore: () => void;
  onHideMore: () => void;
  totalAnswersCount: number;
  isLastBlock?: boolean;
  isFirstBlock?: boolean;
  currentAnswerLimit: number;
  questionId?: string;
};
