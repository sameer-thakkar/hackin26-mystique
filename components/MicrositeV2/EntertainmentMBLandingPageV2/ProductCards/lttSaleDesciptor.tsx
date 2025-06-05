import React from 'react';
import { css } from '@headout/pixie/css';
import { strings } from 'const/strings';
import LttSaleSvg from 'assets/lttSaleSvg';
import GradientSaleSvg from 'assets/saleGradientSvg';
import SaleSvg from 'assets/saleSvg';

const saleDescriptorStyles = ({
  isHorizontalProductCard,
  containerHasBorder,
}: {
  isHorizontalProductCard?: boolean;
  containerHasBorder?: boolean;
}) =>
  css({
    position: 'absolute',
    top: 0,
    left: containerHasBorder ? '2px' : 0,
    right: containerHasBorder ? '2px' : 0,
    backgroundColor: '#7F33A8',
    borderTopRadius: 'radius.8',
    height: isHorizontalProductCard ? '17px' : '21px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: containerHasBorder ? '2.41px' : 'space.2',
    '@media (min-width: 768px)': {
      top: containerHasBorder ? 'space.8' : 'space.6',
      left: containerHasBorder ? '-space.4' : '-space.6',
      borderRadius: 'radius.8',
      right: 'auto',
      padding: '3px 6px 6px 4px',
      gap: 'space.4',
    },
  });

const saleDescriptorSaleSvgStyles = ({
  containerHasBorder,
}: {
  containerHasBorder?: boolean;
}) =>
  css({
    position: 'absolute',
    top: '-3.75px',
    left: '-6.75px',
    height: '6px !important',
    border: 'none !important',
    '@media (min-width: 768px)': {
      left: 0,
      top: containerHasBorder ? '-7.75px' : '-9px',
    },
  });

const saleDescriptorTextStyles = ({
  isHorizontalProductCard,
  containerHasBorder,
}: {
  isHorizontalProductCard?: boolean;
  containerHasBorder?: boolean;
}) =>
  css({
    fontFamily: 'halyard-display',
    fontWeight: 600,
    fontSize: containerHasBorder
      ? '14.48px'
      : isHorizontalProductCard
      ? '12px'
      : '13.41px',
    lineHeight: containerHasBorder
      ? '20.14px'
      : isHorizontalProductCard
      ? '16.7px'
      : '18.66px',
    letterSpacing: containerHasBorder
      ? '0.24px'
      : isHorizontalProductCard
      ? '0.2px'
      : '0.22px',
    color: 'transparent',
    background: 'linear-gradient(103.49deg, #FFE70E 12.97%, #FFFFFF 149.19%)',
    backgroundClip: 'text' as any,
    zIndex: 2,
    '@media (min-width: 768px)': {
      fontWeight: 500,
      fontSize: '21px',
      lineHeight: '23px',
      letterSpacing: '0.24px',
    },
  });

const saleDescriptorGradientSaleSvgStyles = css({
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '4px',
  border: 'none !important',
  height: '100%',
  zIndex: 1,
});

const LttSaleDesciptor = ({
  isHorizontalProductCard,
  containerHasBorder,
}: {
  isHorizontalProductCard?: boolean;
  containerHasBorder?: boolean;
}) => {
  return (
    <div
      className={saleDescriptorStyles({
        isHorizontalProductCard,
        containerHasBorder,
      })}
    >
      <SaleSvg
        className={saleDescriptorSaleSvgStyles({ containerHasBorder })}
      />
      <GradientSaleSvg className={saleDescriptorGradientSaleSvgStyles} />
      <LttSaleSvg
        width={
          containerHasBorder ? 12.07 : isHorizontalProductCard ? 10 : 11.18
        }
        height={
          containerHasBorder ? 12.01 : isHorizontalProductCard ? 9.95 : 11.12
        }
        className={css({
          border: 'none !important',
          '@media (min-width: 768px)': {
            width: '18px',
            height: '18px',
          },
        })}
      />
      <div
        className={saleDescriptorTextStyles({
          isHorizontalProductCard,
          containerHasBorder,
        })}
      >
        {strings.LTT_SPECIAL_OFFER}
      </div>
    </div>
  );
};

export default LttSaleDesciptor;
