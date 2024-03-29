import CrossiconSvg from 'assets/crossiconSvg';
import { ButtonContainer } from './styles';
import { TCloseButtonProps } from './types';

const CloseButton = ({ isHighlighted = false, onClick }: TCloseButtonProps) => {
  return (
    <ButtonContainer $isHighlighted={isHighlighted} onClick={onClick}>
      <CrossiconSvg />
    </ButtonContainer>
  );
};

export default CloseButton;
