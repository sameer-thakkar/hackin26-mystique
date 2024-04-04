export interface IListicleTypeProps {
  items: Experience[];
  index: number;
  listicleSectionTitle: string;
  type?: string;
  settings?: string;
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
