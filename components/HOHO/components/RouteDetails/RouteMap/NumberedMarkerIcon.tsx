import NumberedMarker from 'assets/numberedMarker';
import { TNumberedMarkerIcon } from './interface';
import { IconWrapper, MarkerText } from './styles';

const NumberedMarkerIcon = ({ stopNumber }: TNumberedMarkerIcon) => {
  return (
    <IconWrapper>
      <NumberedMarker />
      <MarkerText>
        <span>{stopNumber}</span>
      </MarkerText>
    </IconWrapper>
  );
};

export default NumberedMarkerIcon;
