export type TSection = {
  title: string;
  items: (string | { text: string; subItems: Array<string> })[];
};
