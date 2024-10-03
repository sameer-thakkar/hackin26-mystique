export type TBreadcrumbItem = {
  level: number;
  label: string;
  url: string;
};
export type TBreadcrumbs = Record<string, TBreadcrumbItem>;
