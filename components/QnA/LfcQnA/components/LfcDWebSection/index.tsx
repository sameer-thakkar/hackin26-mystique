import { useContext } from 'react';
import { QnAEntry } from 'components/StaticBanner';
import { QnaContext } from 'contexts/QnaContext';
import QnaLfcDWebRow from './components/QnaLfcDwebRow';
import { StyledLfcDWebSection } from './styles';
import { TLfcDwebSection } from './types';

const LfcDWebSection = ({ qnaSections }: TLfcDwebSection) => {
  const { setShowModal } = useContext(QnaContext);

  const openModal = () => {
    setShowModal(true);
  };
  return (
    <StyledLfcDWebSection>
      {qnaSections?.map((questionSection: QnAEntry, index: number) => {
        const { question, answers } = questionSection;
        const { content, tag } = question;

        return (
          <QnaLfcDWebRow
            key={index}
            question={content}
            answers={answers.slice(0, 2)}
            crawlableAnswers={answers}
            onLoadMore={openModal}
            tag={tag}
          />
        );
      })}
    </StyledLfcDWebSection>
  );
};

export default LfcDWebSection;
