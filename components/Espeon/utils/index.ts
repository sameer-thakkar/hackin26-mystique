type TRecord = Record<string | number | symbol, unknown>;

export const pickByKeys = <T extends TRecord, K extends keyof T>(
  obj: T,
  keys: K[]
) => {
  return keys.reduce(
    (newObj, key) => ({ ...newObj, [key]: obj[key] }),
    {} as Pick<T, K>
  );
};

/**
 * Creates a debounced function that delays invoking the provided callback.
 *
 * @param {F} callback - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @param {boolean} [immediate=false] - Invoke on the leading edge.
 * @returns {function} - A new debounced function.
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  callback: F,
  wait: number,
  immediate = false
) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function <U>(this: U, ...args: Parameters<typeof callback>) {
    const later = () => {
      timeout = null;
      if (!immediate) callback.apply(this, args);
    };
    if (typeof timeout === 'number') clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (immediate && !timeout) callback.apply(this, args);
  };
}
