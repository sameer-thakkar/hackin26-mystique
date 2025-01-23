import { ItineraryDetails } from 'types/itinerary.type';
import Conditional from 'components/common/Conditional';
import { ITINERARY_DESCRIPTORS_DATA } from 'const/itinerary';
import type { TItineraryDescriptorsComponentProps } from './interface';
import { StyledItineraryDescriptorsContainer } from './styles';

const ItineraryDescriptors = ({
  type,
  itinerary,
  componentType = 'vertical',
  lang,
}: TItineraryDescriptorsComponentProps) => {
  const additionalMeta = {
    lang,
  };
  const {
    icon: DescriptorIcon,
    label,
    fieldIdentifier,
    fieldTransformer = (value) => Object.values(value).join(', '),
    ctaLabel,
    useCTA,
    onCTAClick,
    getIcon,
    getLabel,
    qaMarker,
  } = ITINERARY_DESCRIPTORS_DATA[type];

  const getValueObject = () => {
    return fieldIdentifier.reduce((prev, curr) => {
      prev[curr] = itinerary.details[curr as keyof ItineraryDetails];
      return prev;
    }, {} as Record<string, any>);
  };
  const valueObject = getValueObject();
  const descriptorLabel = getLabel ? getLabel(valueObject) : label;
  const subtext = fieldTransformer(valueObject, additionalMeta);
  const Icon = getIcon ? getIcon(valueObject) : DescriptorIcon;

  const handleCTAClick = () => {
    onCTAClick?.(valueObject);
  };

  return (
    <StyledItineraryDescriptorsContainer
      $componentType={componentType}
      data-qa-marker={qaMarker}
    >
      {Icon && (
        <div className="descriptor-icon-container">
          <div className="icon">
            <Icon />
          </div>
        </div>
      )}
      <div className="descriptor-content-container">
        <span className="descriptor-label">{descriptorLabel}</span>
        <Conditional if={useCTA}>
          <button className="descriptor-cta" onClick={handleCTAClick}>
            {ctaLabel}
          </button>
        </Conditional>
        <Conditional if={!useCTA}>
          <span className="descriptor-subtext">{subtext}</span>
        </Conditional>
      </div>
    </StyledItineraryDescriptorsContainer>
  );
};

export default ItineraryDescriptors;
