import React from 'react';
import { Text } from '@headout/eevee';
import Plus from 'components/Espeon/Assets/Plus';
import { extraDescriptorsContainer } from './styles';
import type { TMoreDescriptors } from './types';

const MoreDescriptors = ({
  moreLabel,
  onMouseEnter,
  onMouseLeave,
}: TMoreDescriptors) => {
  return (
    <div
      className={extraDescriptorsContainer}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Plus />
      <Text as="span">{moreLabel}</Text>
    </div>
  );
};

export default MoreDescriptors;
