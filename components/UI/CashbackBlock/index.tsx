import { COIN } from 'assets/SvgIcons';
import { CashbackTextWrapper, CashbackWrapper } from 'UI/CashbackBlock/styles';
import { strings } from 'const/strings';

interface CashbackProps {
  cashbackValue: number;
}

const CashbackBlock = ({ cashbackValue }: CashbackProps): JSX.Element => {
  return (
    <CashbackWrapper>
      {COIN()}
      <CashbackTextWrapper>
        {strings.formatString(strings.GET_CASHBACK, `${cashbackValue}`)}
      </CashbackTextWrapper>
    </CashbackWrapper>
  );
};

export default CashbackBlock;
