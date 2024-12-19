export type TQnaAnswerCard = {
  content: string;
  customerName: string;
  rating: number;
  customerImgUrl: string | null;
  timestamp: string;
  minContentLen?: number;
  answerId?: string;
  $lastBlock?: boolean;
  tabName?: string;
  answerIndex?: number;
  isLfcSection?: boolean;
};
