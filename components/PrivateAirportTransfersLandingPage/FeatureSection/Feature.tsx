import { ReactNode } from 'react';
import { cx } from '@headout/pixie/css';
import {
  descriptionStyle,
  featureContainerStyle,
  iconContainerStyle,
  titleStyle,
} from './style';

export const Feature = ({
  icon,
  title,
  description,
  className,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div className={cx(featureContainerStyle, className)}>
      <div className={iconContainerStyle}>{icon}</div>
      <h3 className={titleStyle}>{title}</h3>
      <p className={descriptionStyle}>{description}</p>
      {children}
    </div>
  );
};
