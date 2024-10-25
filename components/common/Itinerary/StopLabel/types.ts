export enum EStopLabelType {
  Stop = 'Stop',
  PassBy = 'PassBy',
}

export type TStopLabelProps = {
  labelText: string;
  type: EStopLabelType;
  skipAnimation?: boolean;
};
