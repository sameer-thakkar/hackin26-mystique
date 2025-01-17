import {
  Answer,
  Question,
} from '../LfcDWebSection/components/QnaLfcDwebRow/types';

export type TQnaAccordionBlock = {
  isActive: boolean;
  handleClickFn: (e: React.MouseEvent<HTMLElement>) => void;
  question: Question['content'];
  answers: Answer[];
  onLoadMore: () => void;
  totalAnswersCount: number;
  questionId?: string;
  resetAnswerLimit?: () => void;
  isLastBlock?: boolean;
  tabName?: string;
  questionIndex?: number;
  isLfcSection?: boolean;
  crawlableAnswers: Answer[];
};
