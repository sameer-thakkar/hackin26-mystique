import { ProductDescriptors } from '../../ProductDescriptors';
import { HORIZONTAL_DESCRIPTORS } from './const';
import { HorizontalTags } from './styles';
import { THorizontalDescriptors } from './types';

const HorizontalDescriptors = ({
  minDuration,
  maxDuration,
  lang,
  isMobile,
  descriptorArray,
}: THorizontalDescriptors) => {
  const filteredDescriptors = descriptorArray?.filter((item) =>
    HORIZONTAL_DESCRIPTORS?.includes(item)
  );
  const finalDescriptors = filteredDescriptors?.sort(
    (a, b) =>
      HORIZONTAL_DESCRIPTORS.indexOf(a) - HORIZONTAL_DESCRIPTORS.indexOf(b)
  );

  return (
    <HorizontalTags>
      <ProductDescriptors
        minDuration={minDuration}
        maxDuration={maxDuration}
        lang={lang}
        showLanguages={false}
        horizontal={true}
        showIcons={false}
        isMobile={isMobile}
        showGuidedTourDescriptor={false}
        descriptorArray={finalDescriptors}
      />
    </HorizontalTags>
  );
};

export default HorizontalDescriptors;
