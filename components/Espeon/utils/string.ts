/**
 * Populates a string template with provided arguments.
 *
 * @param {string} str - The string template to populate. It should contain placeholders in the format `{index}`, where `index` is the index of the argument to insert.
 * @param {...string} args - The arguments to insert into the string template.
 * @returns {string} The populated string. If an argument is not provided for a placeholder, the placeholder is left as is.
 *
 * @example - populateStringTemplate('Hello, {0}', 'World'); // Returns 'Hello, World'
 */
export const populateStringTemplate = (str: string, ...args: Array<string>) => {
  if (!str) return '';
  return str.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== 'undefined' ? args[index] : match;
  });
};

export const stringIdfy = (string: string) => {
  return string
    ?.trim()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();
};

export const truncate = (string: string, length: number) =>
  string?.length > length ? `${string.slice(0, length).trim()}...` : string;

export const toKebabCase = (string: string): string =>
  string
    ?.replace(/([a-z])([A-Z])/g, '$1-$2')
    ?.replace(/\s+/g, '-')
    ?.toLowerCase();

export const toConstantCase = (str: string) =>
  str
    ?.replace(/([a-z])([A-Z])/g, '$1_$2') // convert any camelCase to snake_case
    ?.replace(/(\d)/g, '_$1_') // add an underscore before and after any numbers
    ?.replace(/[\s.-]+/g, '_') // replace any spaces, dots, or hyphens with underscores
    ?.toUpperCase(); // convert all letters to uppercase

export const titleCase = (str: string) => {
  if (!str) return '';
  return str.replace('_', ' ').replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};
