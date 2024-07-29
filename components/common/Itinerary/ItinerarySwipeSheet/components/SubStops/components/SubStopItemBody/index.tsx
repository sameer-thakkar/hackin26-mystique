import { SubStopCardProps } from '../../types';
import { BodyContainer, Description } from './styles';

const SubStopItemBody = ({ description }: SubStopCardProps) => {
  return (
    <BodyContainer>
      <Description
        className="description-text"
        dangerouslySetInnerHTML={{ __html: description! }}
      />
    </BodyContainer>
  );
};

export default SubStopItemBody;
