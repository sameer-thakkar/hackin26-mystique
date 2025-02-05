import type { TGetIntlUnit } from './types';

/**
 * Formats a number with a unit based on the specified language and unit display option.

 * @param {TGetIntlUnit} params - An object containing the following properties:
 *   - `lang`: The language code for the desired locale.
 *   - `number`: The number to be formatted.
 *   - `options`: Optional object containing the following property:
     - `unitDisplay`: How to display the unit (e.g., 'short', 'long', 'narrow').
	 - `unit`: list of supported units. ex: percent, yard, weeks,

 * @returns {string} The formatted number with a unit.
 */

export const getIntlUnit = ({ lang, number, options }: TGetIntlUnit) =>
  new Intl.NumberFormat(lang, {
    style: 'unit',
    ...options,
  }).format(number);
