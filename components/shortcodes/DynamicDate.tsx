import dayjs from 'dayjs';

type DateProps = {
  format?: string;
};

/**
 *
 * Use the `date` shortcode to render dynamic date. Useful when you want to show Current Year in the document
 *
 * Example Use:
 *
 * ```js
 * {date format='YYYY'}
 * ```
 *
 */

const DynamicDate = ({ format = 'DD-MMM-YY' }: DateProps) => {
  const date = dayjs();

  return date.format(format);
};

export default DynamicDate;
