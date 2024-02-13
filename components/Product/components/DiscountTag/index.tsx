import { TDiscountTagProps } from 'components/Product/interface';
import { DiscountTagOpener } from 'assets/discountTag';
import { DiscountTagContainer, DiscountTextContainer } from './styles';

const DiscountTag = ({ discount }: TDiscountTagProps) => {
  return (
    <DiscountTagContainer>
      <DiscountTagOpener />
      <DiscountTextContainer>
        <p className="discount-text">{discount}</p>
      </DiscountTextContainer>
    </DiscountTagContainer>
  );
};

export default DiscountTag;
