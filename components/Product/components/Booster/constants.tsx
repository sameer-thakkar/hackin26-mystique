import { BoosterType, TBoosterInfo } from 'components/Product/interface';
import { strings } from 'const/strings';
import { CrownIconSVG, Diamond, Spark, YellowDiamond } from 'assets/boosters';
import { BoosterRiveIcon } from './BoosterRiveIcon';

export const getBoosterInfo = (
  boosterType: BoosterType,
  shouldAnimateBooster?: boolean
): TBoosterInfo => {
  const BOOSTER_INFO = {
    [BoosterType.BESTSELLER]: {
      title: strings.HOHO.BESTSELLER,
      icon: <Diamond />,
      theme: '#6321AE',
      transform: 'translate(-68%,-10%)',
      borderTheme:
        'linear-gradient(90deg, #B283E7 -3.09%, rgba(178, 131, 231, 0.7) 100%)',
      iconHeight: 32,
      mobileStyles: {
        top: 16,
        left: 32,
      },
      textColor: '#fff',
      rotateDeg: -4,
      iconStyles: {
        top: 0,
        left: 0,
      },
      boosterStyles: {
        top: 0.75,
        left: 1.8,
      },
    },
    [BoosterType.SELLING_OUT_FAST]: {
      title: strings.SHOW_PAGE_V2.SELLING_OUT_FAST,
      icon: <Spark />,
      theme: '#CE007C',
      transform: 'translate(-64%,-11%)',
      borderTheme:
        'linear-gradient(90deg, #fdb0d5 0%, rgba(253, 176, 213, 0.7) 100%)',
      iconHeight: 35,
      mobileStyles: {
        top: 16,
        left: 28,
      },
      textColor: '#fff',
      rotateDeg: -4,
      iconStyles: {
        top: 0,
        left: 0,
      },
      boosterStyles: {
        top: 0.75,
        left: 1.8,
      },
    },
    [BoosterType.MUST_DO_EXP]: {
      title: strings.SHOW_PAGE_V2.MUST_DO_EXP,
      icon: <YellowDiamond />,
      theme: '#FFD766',
      transform: 'translate(-68%,-10%)',
      borderTheme: 'linear-gradient(90deg, #FFD766 -3.09%, #FFD766 100%)',
      iconHeight: 48,
      mobileStyles: {
        top: 16,
        left: 36.8,
      },
      textColor: '#6B2811',
      rotateDeg: -4,
      iconStyles: {
        top: -6,
        left: -1,
      },
      boosterStyles: {
        top: 0.75,
        left: 2.1,
      },
    },

    [BoosterType.MOST_LOVED]: {
      title: strings.BOOSTERS.MOST_LOVED,
      icon: (
        <BoosterRiveIcon
          artboard="mostLoved"
          shouldAnimateBooster={shouldAnimateBooster}
        />
      ),
      theme: '#CE007C',
      transform: 'translate(-68%,-9%)',
      borderTheme: 'initial',
      iconHeight: 28,
      mobileStyles: {
        top: 12,
        left: 7,
      },
      textColor: '#fff',
      rotateDeg: -4,
      iconStyles: {
        top: 0,
        left: 0,
      },
      boosterStyles: {
        top: 1,
        left: 2.2,
      },
    },

    [BoosterType.SPECIAL_DEAL]: {
      title: strings.BOOSTERS.SPECIAL_DEAL,
      icon: (
        <BoosterRiveIcon
          artboard="specialDeal"
          shouldAnimateBooster={shouldAnimateBooster}
        />
      ),
      theme: '#088943',
      transform: 'translate(-68%,-10%)',
      iconHeight: 30,
      borderTheme: 'initial',
      mobileStyles: {
        top: 12,
        left: 7,
      },
      textColor: '#fff',
      rotateDeg: -4,
      iconStyles: {
        top: 0,
        left: -1,
      },
      boosterStyles: {
        top: 1,
        left: 2.2,
      },
    },

    [BoosterType.HEADOUT_EXCLUSIVE]: {
      title: strings.BOOSTERS.HEADOUT_EXCLUSIVE,
      icon: <Diamond />,
      theme: '#6321AE',
      transform: 'translate(-68%,-10%)',
      borderTheme:
        'linear-gradient(90deg, #B283E7 -3.09%, rgba(178, 131, 231, 0.7) 100%)',
      iconHeight: 32,
      mobileStyles: {
        top: 16,
        left: 32,
      },
      textColor: '#fff',
      rotateDeg: -4,
      iconStyles: {
        top: 0,
        left: 0,
      },
      boosterStyles: {
        top: 0.75,
        left: 1.8,
      },
    },
    [BoosterType.PREMIUM]: {
      title: strings.BOOSTERS.PREMIUM,
      icon: <CrownIconSVG />,
      theme: '#6321AE',
      transform: 'translate(-20px,-2.5px)',
      borderTheme: 'none',
      iconHeight: 26,
      mobileStyles: {
        top: 8,
        left: 28,
      },
      padding: '1px 6px 3px 8px',
      lineHeight: 18,
      textColor: '#fff',
      rotateDeg: 0,
      iconStyles: {
        top: 1.5,
        left: 0,
      },
      boosterStyles: {
        top: 2.125,
        left: 3.25,
      },
    },
  };

  return BOOSTER_INFO[boosterType];
};
