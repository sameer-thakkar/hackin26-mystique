import { IReadMoreProps } from 'components/slices/ListicleV2/SmallListicle/ReadMore/interface';
import { ReadMoreWrapper } from 'components/slices/ListicleV2/SmallListicle/ReadMore/styles';

const ReadMore = ({ text, onClick }: IReadMoreProps) => {
  return <ReadMoreWrapper onClick={onClick}>{text}</ReadMoreWrapper>;
};
export default ReadMore;
