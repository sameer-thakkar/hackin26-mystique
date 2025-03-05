export type TQnaLfcDwebRow = {
  question: string;
  answers: Answer[];
  onLoadMore: () => void;
  tag: string;
};

export interface Customer {
  id: string;
  name: string;
  profileImageUrl: string | null;
  countryCode: string;
  countryName: string;
}

export interface Answer {
  content: string;
  timestamp: string;
  customer: Customer;
  rating: number;
}

export interface Question {
  id: number;
  content: string;
  tag: string;
}

export interface QnA {
  question: Question;
  answer: Answer;
  totalAnswersCount: number;
}
