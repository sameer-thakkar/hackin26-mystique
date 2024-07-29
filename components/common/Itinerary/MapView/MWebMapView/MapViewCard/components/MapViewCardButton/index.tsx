import Conditional from 'components/common/Conditional';
import type { TMapViewCardButtonProps } from 'components/common/Itinerary/MapView/MWebMapView/MapViewCard/interface';
import { StyledMapViewCardButton } from 'components/common/Itinerary/MapView/MWebMapView/MapViewCard/styles';

const MapViewCardButton = ({
  type = 'primary',
  onClick,
  label,
  icon,
  iconPosition = 'left',
}: TMapViewCardButtonProps) => {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <StyledMapViewCardButton $type={type} onClick={handleClick}>
      <Conditional if={icon && iconPosition === 'left'}>{icon}</Conditional>
      <Conditional if={label}>
        <p className="label">{label}</p>
      </Conditional>
      <Conditional if={icon && iconPosition === 'right'}>{icon}</Conditional>
    </StyledMapViewCardButton>
  );
};

export default MapViewCardButton;
