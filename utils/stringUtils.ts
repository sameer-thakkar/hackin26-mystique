export const isAlphabeticString = (str) => /^[a-z]*$/gi.test(str);
export const titleCase = (str) => {
  return str.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};
