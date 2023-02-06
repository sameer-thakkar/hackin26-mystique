import { stringIdfy } from '../../utils/helper';

const AnchorPoint = ({
  id
}: any) => {
  return <div id={stringIdfy(id)} />;
};

export default AnchorPoint;
