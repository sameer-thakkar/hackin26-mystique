import COLORS from 'const/colors';
import EmptyMarker from 'assets/emptyMarkerIcon';
import { TNumberedMarkerIcon } from './interface';
import { IconWrapper, MarkerText } from './styles';

const NumberedMarkerIcon = ({
  title,
  stopNumber,
  color = COLORS.BRAND.PURPS,
}: TNumberedMarkerIcon) => {
  return (
    <IconWrapper>
      <EmptyMarker color={color} fill={color} aria-placeholder={title} />
      <MarkerText>{stopNumber}</MarkerText>
    </IconWrapper>
  );
};

export default NumberedMarkerIcon;
