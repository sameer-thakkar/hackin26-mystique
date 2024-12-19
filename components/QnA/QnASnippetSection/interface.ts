import { QnAContainer } from 'components/StaticBanner';
import { QnA } from '../LfcQnA/components/LfcDWebSection/components/QnaLfcDwebRow/types';

export type TQnASnippetSectionProps = {
  isMobile: boolean;
  qnaSnippets: QnA[];
  qnaSections: QnAContainer[];
  collectionId?: number;
};
