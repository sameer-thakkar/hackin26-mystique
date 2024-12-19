export type TQnaSnippetCard = {
  handleCardClick: (e: React.MouseEvent) => void;
  question: Record<string, any>;
  answer: Record<string, any>;
  isMobile: boolean;
  cardIndex: number;
  imageUrl: string;
};
