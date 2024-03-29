import Conditional from 'components/common/Conditional';
import { TDiscountTagProps } from 'components/Product/interface';
import { DiscountTagOpener } from 'assets/discountTag';
import { DiscountTagContainer, DiscountTextContainer } from './styles';

const DiscountTag = ({
  discount,
  showAngledTag = true,
  shouldPointLeft = false,
}: TDiscountTagProps) => {
  return (
    <DiscountTagContainer $shouldPointLeft={shouldPointLeft}>
      <Conditional if={showAngledTag && !shouldPointLeft}>
        <DiscountTagOpener />
      </Conditional>
      <DiscountTextContainer $showAngledTag={showAngledTag}>
        <p className="discount-text">{discount}</p>
      </DiscountTextContainer>
      <Conditional if={showAngledTag && shouldPointLeft}>
        <DiscountTagOpener />
      </Conditional>
    </DiscountTagContainer>
  );
};

export default DiscountTag;
