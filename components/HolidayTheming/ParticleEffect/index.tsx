import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';
import { cx } from '@headout/pixie/css';
import type { IParticleAnimationProps } from '../interface';
import { bottomStyles, particleStyles, topStyles } from './styles';

const ParticleAnimation = ({
  particleIllustration,
  minAssetSize = 10,
  count = 30,
  animationDurationInSeconds = 2,
  origin = 'top',
}: IParticleAnimationProps) => {
  const particles: {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
  }[] = useMemo(
    () =>
      [...Array(count)].map((_, i) => ({
        id: i,
        left: (i * 100) / count,
        delay: Math.random() * 3,
        duration: animationDurationInSeconds + Math.random() * 2,
        size: minAssetSize + Math.random() * 15,
      })),
    []
  );

  const fromTop = origin === 'top';

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cx(particleStyles, fromTop ? topStyles : bottomStyles)}
          style={
            {
              '--var-left': `${particle.left}%`,
              '--var-delay': `${particle.delay}s`,
              '--var-duration': `${particle.duration}s`,
              '--var-animation-name': fromTop ? 'float' : 'floatReverse',
            } as CSSProperties
          }
        >
          <div
            style={
              {
                '--var-particle-size': `${particle.size}px`,
                width: 'var(--var-particle-size)',
                height: 'var(--var-particle-size)',
                position: 'relative',
              } as CSSProperties
            }
          >
            {particleIllustration}
          </div>
        </div>
      ))}
    </>
  );
};

export default ParticleAnimation;
