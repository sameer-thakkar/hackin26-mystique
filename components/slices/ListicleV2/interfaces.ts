export interface IListicleTypeProps {
  items: Experience[];
  index: number;
  listicleSectionTitle: string;
  type?: string;
  settings?: string;
  enforceParentIndex?: boolean;
}

export interface IDataEventProps {
  cardSize: string;
  experienceType: string;
  index: number;
  listicleSectionTitle: string;
  heading: string;
  experienceName: string;
  experienceId: string;
}
