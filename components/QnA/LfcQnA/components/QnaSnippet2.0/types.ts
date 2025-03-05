import { QnAContainer } from 'components/StaticBanner';
import { QnA } from '../LfcDWebSection/components/QnaLfcDwebRow/types';

export type TQnaSnippetProps = {
  qnaSnippets: QnA[];
  qnaSections: QnAContainer[];
  collectionId: number;
};
