import { stringIdfy } from '../../utils/helper';

const AnchorPoint = ({ id }) => {
  return <div id={stringIdfy(id)} />;
};

export default AnchorPoint;
