type PromiseWithLabel<T> = {
  promise: Promise<T>;
  label: string;
};

/**
 * Aggregates a list of labeled promises and returns an object with each key as the label and the value as the resolved promise result.
 *
 * @template T - An array of objects, each containing a promise and a label.
 *
 * @param {Array<{ promise: Promise<any>, label: string }>} promisesWithLabels - The array of labeled promises.
 * @param {Promise<any>} promisesWithLabels[].promise - The promise to be resolved.
 * @param {string} promisesWithLabels[].label - The label associated with the promise.
 *
 * @returns {Promise<object>} A promise that resolves to an object where each key is a label and each value is the resolved result of the corresponding promise.
 *
 * @example
 * const categoryDataPromise = new Promise(resolve => setTimeout(() => resolve({ id: 1, name: 'Category' }), 1000));
 * const collectionDataPromise = new Promise(resolve => setTimeout(() => resolve(['item1', 'item2', 'item3']), 2000));
 *
 * const promisesWithLabels = [
 *   { promise: categoryDataPromise, label: 'categoryData' },
 *   { promise: collectionDataPromise, label: 'collectionData' },
 * ];
 *
 * const response = await resolvePromisesWithLabels(promisesWithLabels)
 * console.log(result);
 * // Output: { categoryData: { id: 1, name: 'Category' }, collectionData: ['item1', 'item2', 'item3'] }
 */
export const labeledPromiseAllSettled = async <
  T extends readonly PromiseWithLabel<any>[]
>(
  promisesWithLabels: T
): Promise<{
  [K in T[number] as K['label']]: Awaited<K['promise']>;
}> => {
  const results = await Promise.allSettled(
    promisesWithLabels.map((p) => p.promise)
  );

  return results.reduce((acc, result, index) => {
    const label = promisesWithLabels[index].label;

    if (result.status === 'fulfilled') {
      acc[label] = result.value;
    }

    return acc;
  }, {} as any);
};

/**
 * Executes a promise callback based on a condition.
 * @template T
 * @param {boolean} condition - The condition determining whether to execute the promise callback.
 * @param {T} promiseCallback - The callback function that returns a promise.
 * @returns {ReturnType<T> | null} The result of the promise callback if condition is true, otherwise null.
 */
export const conditionalPromise = <T extends (...args: any[]) => any>(
  condition: boolean,
  promiseCallback: T
): ReturnType<T> => (condition ? promiseCallback() : null);
