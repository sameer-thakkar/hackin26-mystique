import Skeleton from 'react-loading-skeleton';
import {
  ProductCardContainer,
  VeritcalDashedSeparator,
} from '../ProductCard/style';
import { DesktopSkeletonContainer } from './style';

export const LoadingSkeletons = ({ isMobile }: { isMobile: boolean }) => {
  if (isMobile) {
    return (
      <ProductCardContainer>
        <div className="carousel-skeleton">
          <Skeleton
            width={'100%'}
            height={200}
            borderRadius={12}
            style={{
              position: 'relative',
            }}
          ></Skeleton>

          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        <div>
          <Skeleton width={76} height={16} borderRadius={4} />
          <Skeleton
            width={'100%'}
            height={42}
            borderRadius={4}
            style={{
              lineHeight: 1.5,
            }}
          />
        </div>

        <Skeleton width={'100%'} height={72} borderRadius={4} />

        <div>
          <Skeleton
            width={76}
            height={16}
            borderRadius={4}
            style={{
              lineHeight: 0.7,
            }}
          />
          <Skeleton width={124} height={22} borderRadius={4} />
        </div>

        <Skeleton width={'100%'} height={42} borderRadius={4} />
      </ProductCardContainer>
    );
  }

  return (
    <DesktopSkeletonContainer>
      <div>
        <ProductCardContainer>
          <Skeleton width={281} height={176} borderRadius={8} />

          <div>
            <Skeleton width={86} height={16} borderRadius={4} />
            <Skeleton
              width={198}
              height={16}
              borderRadius={4}
              style={{
                lineHeight: 1.2,
              }}
            />
            <Skeleton
              width={304}
              height={120}
              borderRadius={8}
              style={{
                marginTop: '0.75rem',
              }}
            />
          </div>

          <VeritcalDashedSeparator />

          <div>
            <Skeleton width={50} height={16} borderRadius={4} />
            <Skeleton
              width={123}
              height={28}
              borderRadius={4}
              style={{
                lineHeight: 1.5,
              }}
            />
            <Skeleton
              width={233}
              height={42}
              borderRadius={4}
              style={{
                marginTop: '0.75rem',
              }}
            />
          </div>
        </ProductCardContainer>
      </div>

      <Skeleton width={282} height={'100%'} borderRadius={12} />
    </DesktopSkeletonContainer>
  );
};
