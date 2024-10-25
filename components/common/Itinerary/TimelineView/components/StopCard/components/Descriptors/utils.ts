export const checkIfDescriptorsExist = (
  descriptors: Record<string, any>,
  includeLocationDescriptor = true
) => {
  let descriptorKeys = Object.keys(descriptors);

  if (!includeLocationDescriptor) {
    descriptorKeys = descriptorKeys.filter((key) => key !== 'location');
  }

  if (descriptorKeys.length === 0) {
    return false;
  }

  const filteredDescriptors = descriptorKeys.map((key) => descriptors[key]);

  return Object.values(filteredDescriptors).some(
    (descriptorValue) => descriptorValue
  );
};
