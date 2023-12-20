export interface IListicleSectionProps {
  type: string;
  title: string;
  prismicDocsForListicle: Array<any>;
  collectionsInListicles: Record<any, any>;
  childSlices?: Array<any>;
  settings?: string;
}
