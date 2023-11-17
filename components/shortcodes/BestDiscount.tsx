type BestDiscountProps = {
  bestDiscount?: number;
};
/**
 *
 * Use the `best-discount` shortcode to render the best discount %, retrieved from the rendered products in the page
 *
 */

const BestDiscount = (_: any, props: BestDiscountProps) => {
  const { bestDiscount } = props;
  return bestDiscount ? `${bestDiscount}%` : '';
};

export default BestDiscount;
