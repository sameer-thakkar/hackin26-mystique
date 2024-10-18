import Conditional from 'components/common/Conditional';
import COLORS from 'const/colors';
import EmptyMarker from 'assets/emptyMarkerIcon';
import { TNumberedMarkerIcon } from './interface';
import { IconWrapper, MarkerText } from './styles';

const NumberedMarkerIcon = ({
  title,
  stopNumber,
  color = COLORS.BRAND.PURPS,
  hideNumber = false,
}: TNumberedMarkerIcon) => {
  return (
    <IconWrapper>
      <EmptyMarker color={color} fill={color} aria-placeholder={title} />
      <Conditional if={!hideNumber}>
        <MarkerText>{stopNumber}</MarkerText>
      </Conditional>
    </IconWrapper>
  );
};

export default NumberedMarkerIcon;
