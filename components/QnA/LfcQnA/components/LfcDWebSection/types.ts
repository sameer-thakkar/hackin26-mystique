import { Answer, Question } from 'components/StaticBanner';

export type TLfcDwebSection = {
  qnaSections: {
    question: Question;
    answers: Answer[];
  }[];
};
