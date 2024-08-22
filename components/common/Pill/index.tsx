import React from 'react';
import Conditional from 'components/common/Conditional';
import { PillProps } from 'components/common/Pill/interface';
import {
  AllIcon,
  PillContainer,
  PillIcon,
  PillLabel,
} from 'components/common/Pill/styles';
import GridIcon from 'assets/gridIcon';

const Pill: React.FC<PillProps> = (props) => {
  const {
    iconUrl,
    label,
    isHighlighted = false,
    isSubCategoryPage,
    isDarkVariant,
    height,
  } = props;

  return (
    <PillContainer
      $isHighlighted={isHighlighted}
      $isSubCategoryPage={isSubCategoryPage}
      $height={height}
      $isDarkVariant={isDarkVariant}
    >
      <Conditional if={iconUrl}>
        <PillIcon
          $iconUrl={iconUrl}
          $isHighlighted={isHighlighted}
          $isDarkVariant={isDarkVariant}
        />
      </Conditional>
      <Conditional if={!iconUrl && isSubCategoryPage}>
        <AllIcon>
          <GridIcon />
        </AllIcon>
      </Conditional>
      <PillLabel $isDarkVariant={isDarkVariant}>{label}</PillLabel>
    </PillContainer>
  );
};

export default Pill;
