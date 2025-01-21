import Skeleton from 'react-loading-skeleton';
import { css } from '@headout/pixie/css';
import 'react-loading-skeleton/dist/skeleton.css';

export function ProductInfoCardSkeleton() {
  return (
    <div
      className={css({
        flex: 1,
        '& span': {
          lineHeight: 'normal!',
        },
      })}
    >
      <Skeleton
        enableAnimation={false}
        baseColor="#fff"
        width={'100%'}
        height={90}
        className={css({
          backgroundColor: 'white!',
          lineHeight: 'normal!',
          marginBottom: 'space.6',
        })}
        borderRadius={'0.5rem'}
      />

      <Skeleton
        enableAnimation={false}
        baseColor="#fff"
        highlightColor="#fff"
        width={'100%'}
        height={16}
        className={css({
          backgroundColor: 'white!',
          lineHeight: 'normal!',
        })}
      />

      <Skeleton
        enableAnimation={false}
        baseColor="#fff"
        highlightColor="#fff"
        width={'60%'}
        height={16}
        containerClassName={css({
          marginTop: '-3px',
          lineHeight: 'normal!',
          display: 'block',
        })}
        className={css({
          backgroundColor: 'white!',
          lineHeight: 'normal!',
        })}
      />
    </div>
  );
}
