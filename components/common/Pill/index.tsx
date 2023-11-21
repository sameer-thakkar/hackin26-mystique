import React from 'react';
import Conditional from 'components/common/Conditional';
import { PillProps } from 'components/common/Pill/interface';
import {
  PillContainer,
  PillIcon,
  PillLabel,
} from 'components/common/Pill/styles';

const Pill: React.FC<PillProps> = (props) => {
  const {
    iconUrl,
    label,
    isHighlighted = false,
    isSubCategoryPage,
    height,
  } = props;

  return (
    <PillContainer
      $isHighlighted={isHighlighted}
      $isSubCategoryPage={isSubCategoryPage}
      $height={height}
    >
      <Conditional if={iconUrl}>
        <PillIcon $iconUrl={iconUrl} $isHighlighted={isHighlighted} />
      </Conditional>
      <PillLabel>{label}</PillLabel>
    </PillContainer>
  );
};

export default Pill;
