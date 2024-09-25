import { cx } from '@headout/pixie/css';
import { strings } from 'const/strings';
import { PRIVATE_AT_FEATURES_DATA } from '../constants';
import { Feature } from './Feature';
import { GradientCircle } from './GradientCircle';
import {
  COLOR_CLASSNAME_LIST,
  featureSectionContainerStyle,
  featureStyle,
  gradientCircleBottomStyle,
  gradientCircleTopStyle,
} from './style';

export const FeatureSection = () => {
  return (
    <div className={featureSectionContainerStyle}>
      {PRIVATE_AT_FEATURES_DATA(strings).map((feature, index) => (
        <Feature
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          className={featureStyle}
        >
          <GradientCircle
            className={cx(gradientCircleTopStyle, COLOR_CLASSNAME_LIST[index])}
          />
          <GradientCircle
            className={cx(
              gradientCircleBottomStyle,
              COLOR_CLASSNAME_LIST[index]
            )}
          />
        </Feature>
      ))}
    </div>
  );
};
