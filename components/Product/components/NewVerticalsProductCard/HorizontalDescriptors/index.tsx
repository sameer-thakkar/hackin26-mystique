import { DESCRIPTORS } from 'const/index';
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
  modifyAudioGuideDescriptor = false,
}: THorizontalDescriptors) => {
  const filteredDescriptors = descriptorArray?.reduce((acc, item) => {
    if (HORIZONTAL_DESCRIPTORS?.includes(item)) {
      acc.push(item);
    }
    if (modifyAudioGuideDescriptor && item === DESCRIPTORS.AUDIO_GUIDE) {
      acc.push(DESCRIPTORS.MULTILINGUAL_AUDIO_GUIDE);
    }
    return acc;
  }, [] as string[]);

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
