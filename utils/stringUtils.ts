export const isAlphabeticString = (str: any) => /^[a-z]*$/gi.test(str);

export const parseCaption = (string: string) => {
  let newString = string;
  const mentions = string?.match(/(?:^|\s)(@[a-z0-9]+\.?\w*)/gi); //regex to identify words starting with @ i.e usernames
  const accountNames = mentions?.map((v: any) => v.trim().substring(1));

  mentions?.forEach((el, i) => {
    const regex = new RegExp(mentions[i], 'g');
    newString = newString?.replace(
      regex,
      `<a href="https://www.instagram.com/${accountNames?.[i]}" target="_blank"
      rel="noreferrer noopener">${el}</a>`
    );
  });

  //regex to identify url encoded characters
  const encoded = /(%[A-Za-z0-9]+(%[A-Za-z0-9]+)+)|%27/g;
  newString = newString?.replace(encoded, (match: any) =>
    decodeURIComponent(match)
  );
  return newString;
};

export const titleCase = (str: string) => {
  return str.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};

export const constantCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // convert any camelCase to snake_case
    .replace(/(\d)/g, '_$1_') // add an underscore before and after any numbers
    .replace(/[\s.-]+/g, '_') // replace any spaces, dots, or hyphens with underscores
    .toUpperCase(); // convert all letters to uppercase
};
