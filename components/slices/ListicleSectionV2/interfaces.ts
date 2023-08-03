export interface IListicleSectionProps {
  type: string;
  title: string;
  prismicDocsForListicle: Array<any>;
  collectionsInListicles: Record<any, any>;
  slices?: Array<any>;
  settings?: string;
}
