export interface F1TrustBoostersProp {
  boosterHeading: string;
  svgIcon: JSX.Element;
  boosterSubtext?: string;
}

export interface F1TrustBoosterProp {
  f1TrustBooster: F1TrustBoostersProp[];
  isMobile?: boolean;
}
