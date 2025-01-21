import Skeleton from 'react-loading-skeleton';
import { css } from '@headout/pixie/css';
import { VeritcalDashedSeparator } from 'components/AirportTransfers/PrivateAirportTransferProductCard/styles';

export const CardLoadingSkeleton = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => {
  if (isMobile)
    return (
      <div
        className={css({
          maxWidth: '600px',
          borderRadius: 'radius.16',
          border: '1px solid',
          borderColor: 'core.grey.300',
          marginX: 'space.24',
          boxSizing: 'border-box',

          '& .react-loading-skeleton': {
            lineHeight: 'normal!',
          },
        })}
      >
        <Skeleton
          width={'100%'}
          height={210}
          borderRadius={0}
          className={css({
            marginTop: '0',
            borderTopLeftRadius: '16px!',
            borderTopRightRadius: '16px!',
            marginBottom: 'space.10',
            aspectRatio: '155/100',
            lineHeight: 'normal!',
          })}
        />
        <div
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'space.4',
            paddingX: 'space.12',
            lineHeight: 'normal!',
          })}
        >
          <Skeleton width={120} height={16} />
          <Skeleton width={120} height={16} />
        </div>

        <Skeleton
          width={'calc(100% - 24px)'}
          height={85}
          borderRadius={8}
          className={css({
            marginBottom: '1.125rem',
            marginX: 'space.12',
            lineHeight: 'normal!',
          })}
        />

        <Skeleton
          width={'20%'}
          height={16}
          className={css({
            marginBottom: '2px',
            marginLeft: 'space.12',
            lineHeight: 'normal!',
          })}
          borderRadius={4}
        />
        <Skeleton
          width={'40%'}
          height={24}
          borderRadius={8}
          className={css({
            marginBottom: 'space.12',
            marginLeft: 'space.12',
            lineHeight: 'normal!',
          })}
        />

        {/* Two full-width lines */}
        <div className={css({ paddingX: 'space.12' })}>
          <Skeleton
            count={2}
            height={44}
            className={css({
              marginBottom: '0.5rem',
            })}
            borderRadius={8}
          />
        </div>
      </div>
    );

  return (
    <div
      className={css({
        maxWidth: '75rem',
        width: '100%',
        margin: '0 auto!',
        borderRadius: 'radius.16',
        border: '1px solid',
        borderColor: 'core.grey.300',
        marginX: 'space.24',
        boxSizing: 'border-box',
        display: 'flex',
        gap: 'space.24',
        padding: 'space.24',

        '& .react-loading-skeleton': {
          lineHeight: 'normal',
        },
      })}
    >
      {/* Left side - Image */}
      <div className={css({ flexBasis: '25%', flexShrink: 0 })}>
        <Skeleton
          width={'100%'}
          height={'21.5rem'}
          borderRadius={8}
          className={css({})}
        />
      </div>

      {/* Middle side - Content */}
      <div className={css({ flex: 1 })}>
        {/* Top row with two small rectangles */}
        <div
          className={css({
            display: 'flex',
            gap: 'space.12',
            marginBottom: '0.5625rem',
          })}
        >
          <Skeleton width={94} height={20} borderRadius={4} />
          <Skeleton width={94} height={20} borderRadius={4} />
        </div>

        {/* Title */}
        <Skeleton
          width={'100%'}
          height={'4.3rem'}
          borderRadius={12}
          className={css({ marginBottom: '0.5625rem', lineHeight: 'normal' })}
        />

        {/* Description area */}
        <Skeleton
          width={'100%'}
          height={231}
          borderRadius={8}
          className={css({})}
        />
      </div>

      <VeritcalDashedSeparator
        className={css({ marginY: ' 0!', marginX: 'space.8!' })}
      />

      {/* Right side button */}
      <div
        className={css({
          alignItems: 'flex-start',
        })}
      >
        <div
          className={css({
            marginBottom: 'space.12',
          })}
        >
          <Skeleton
            width={71}
            height={16}
            className={css({ lineHeight: '.9!' })}
            borderRadius={4}
          />
          <Skeleton
            width={157}
            height={28}
            borderRadius={8}
            className={css({ lineHeight: 'normal!' })}
          />
        </div>
        <Skeleton
          width={230}
          height={40}
          borderRadius={8}
          className={css({ lineHeight: 'normal!' })}
        />
      </div>
    </div>
  );
};
