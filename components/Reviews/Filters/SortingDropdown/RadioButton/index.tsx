import { cx } from '@headout/pixie/css';
import { radioStyles } from './styles';
import { RadioButtonProps } from './types';

export const RadioButton = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  radioPosition = 'front',
  className,
  spacedOut = false,
}: RadioButtonProps) => {
  const styles = radioStyles({ spacedOut });

  return (
    <div
      className={cx(styles.container, className)}
      data-qa-marker={`qaid-review-sorting-dropdown-item-${name
        .toLowerCase()
        .replaceAll(' ', '-')}`}
    >
      <label htmlFor={id} className={styles.label}>
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => {
            onChange(e.currentTarget.checked);
          }}
          className={styles.input}
        />
        {radioPosition === 'front' && (
          <span
            className={styles.control}
            aria-hidden="true"
            data-active={checked}
          />
        )}
        {label}
        {radioPosition === 'back' && (
          <span
            className={styles.control}
            aria-hidden="true"
            data-active={checked}
          />
        )}
      </label>
    </div>
  );
};
