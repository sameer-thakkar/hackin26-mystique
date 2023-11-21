import React from 'react';
import { SortFiltersProps } from 'components/CatAndSubCatPage/SubCategoryCards/SortFilters/interface';
import {
  FilterItem,
  FiltersContainer,
} from 'components/CatAndSubCatPage/SubCategoryCards/SortFilters/styles';
import Conditional from 'components/common/Conditional';
import COLORS from 'const/colors';
import { TickSvg } from 'assets/SvgIcons';

const SortFilters: React.FC<SortFiltersProps> = (props) => {
  const { filters, onChange, currentValue } = props;

  return (
    <FiltersContainer>
      {filters.map((filter, index) => {
        const { label, value } = filter;
        const isActive = currentValue === value;
        const isClickable = !isActive && onChange;

        return (
          <FilterItem
            $isActive={isActive}
            key={index}
            onClick={isClickable ? () => onChange(filter) : undefined}
          >
            <span className="label-text">{label}</span>
            <Conditional if={isActive}>
              <TickSvg strokeColor={COLORS.GRAY.G2} />
            </Conditional>
          </FilterItem>
        );
      })}
    </FiltersContainer>
  );
};

export default SortFilters;
