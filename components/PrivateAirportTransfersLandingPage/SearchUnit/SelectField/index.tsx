import { forwardRef } from 'react';
import { TSelectFieldProps } from './interface';
import { FieldWrapper, PlaceHolderText, TopLabel, Value } from './style';

export const SelectField = forwardRef<HTMLDivElement, TSelectFieldProps>(
  (
    {
      value,
      icon,
      topLabel,
      placeHolderText,
      onClick,
      isFocused,
      error = false,
      className = '',
    },
    ref
  ) => {
    return (
      <FieldWrapper
        onClick={onClick}
        ref={ref}
        $isFocused={isFocused}
        className={`select-field ${className}`}
        $hasError={error}
      >
        {icon}

        <TopLabel $hasValue={!!value}>{topLabel}</TopLabel>

        <PlaceHolderText $hasValue={!!value} $isFocused={isFocused}>
          {placeHolderText}
        </PlaceHolderText>

        {value && <Value>{value}</Value>}
      </FieldWrapper>
    );
  }
);

SelectField.displayName = 'SelectField';
