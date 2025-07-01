export interface IParticleAnimationProps {
  particleIllustration: React.ReactNode;
  minAssetSize?: number;
  count?: number;
  animationDurationInSeconds?: number;
  origin?: 'top' | 'bottom';
}

export interface IParticleIllustration extends IParticleAnimationProps {
  illustrationType: 'particle';
}

export interface IHolidayRiveProps {
  variant: 'header' | 'desktop' | 'mobile';
  riveSrc: string;
  artboard?: string;
  anchor?: 'top' | 'bottom';
}

export interface IHolidayBaseProps {
  regions: string[];
  startDate: string;
  endDate: string;
  disabledCities?: string[];
}

export interface IRiveAnimation {
  illustrationType: 'animation';
  assetUrl: string;
  artboard?: string;
  anchor?: 'top' | 'bottom';
}

export interface IHolidayGalleryConfig extends IHolidayBaseProps {
  animationConfig: {
    desktop: IRiveAnimation | IParticleIllustration;
    mobile?: IRiveAnimation | IParticleIllustration;
  };
}

export interface IHolidayHeaderConfig extends IHolidayBaseProps {
  assetUrl?: string;
}
