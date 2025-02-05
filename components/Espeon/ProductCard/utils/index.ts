import {
  DESCRIPTOR_RANKING_LOGIC,
  MAX_DESCRIPTORS_DISPLAYED,
} from 'components/Espeon/ProductCard/constants';
import {
  EDescriptorCode,
  type TDescriptorCodes,
} from 'components/Espeon/ProductCard/Descriptor/types';

export const getDescriptorCodes = (
  descriptors: any,
  rankingLogic?: readonly string[]
) => {
  const descriptorCodes = descriptors.reduce(
    (results: any, descriptor: any) => {
      if (descriptor.code) {
        results.push(descriptor.code);
      }
      return results;
    },
    [] as TDescriptorCodes
  );

  descriptorCodes.push(EDescriptorCode.DURATION);

  return getRankedDescriptorCodes(descriptorCodes, rankingLogic).slice(
    0,
    MAX_DESCRIPTORS_DISPLAYED
  );
};

export const getRankedDescriptorCodes = (
  descriptors: TDescriptorCodes,
  rankingLogic: readonly string[] = DESCRIPTOR_RANKING_LOGIC
) => {
  const filteredDescriptors = descriptors?.filter((descriptor) =>
    rankingLogic?.includes(descriptor)
  );

  const rankedDescriptorCodes = Array.from(filteredDescriptors).sort(
    (a, b) => rankingLogic.indexOf(a) - rankingLogic.indexOf(b)
  );

  return rankedDescriptorCodes;
};
