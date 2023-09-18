import { SpecialProductDetailLabelWrapper } from 'components/Product/styles';

const SpecialProductDetailLabel = ({
  icon,
  detail,
}: {
  icon?: any;
  detail: string;
}) => (
  <SpecialProductDetailLabelWrapper>
    {icon}
    <div className="label-detail">{detail}</div>
  </SpecialProductDetailLabelWrapper>
);

export default SpecialProductDetailLabel;
