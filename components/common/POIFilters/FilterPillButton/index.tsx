import { useRef } from 'react';
import { Text } from '@headout/eevee';
import { scrollParentToChildInline } from '../utils';
import { TFilterPillButtonProps } from './interface';
import { filterPillButtonStyles, filterTextStyle } from './styles';

export const FilterPillButton = ({
  icon,
  text,
  isSelected,
  onClick,
  disabled,
}: TFilterPillButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (disabled) return;

    if (!isSelected && ref.current) {
      scrollParentToChildInline(
        ref.current.closest('#POI_FILTERS')!,
        ref.current
      );
    }

    onClick?.();
  };

  return (
    <button
      data-selected={isSelected}
      ref={ref}
      className={filterPillButtonStyles}
      onClick={handleClick}
      data-disabled={disabled}
    >
      {icon}
      <Text
        className={filterTextStyle}
        color={
          isSelected
            ? 'core.primary.white'
            : disabled
            ? 'semantic.text.disabled'
            : 'semantic.text.grey.2'
        }
      >
        {text}
      </Text>
    </button>
  );
};
