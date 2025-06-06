import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import Image from 'UI/Image';
import { TProductInfoCardProps } from './interface';
import { productImageStyles, productInfoCardStyles } from './styles';

export const ProductInfoCard = ({
  displayName,
  media,
}: TProductInfoCardProps) => {
  return (
    <div className={productInfoCardStyles}>
      <Image
        url={media.url}
        alt={media.metadata?.altText}
        width={144}
        height={90}
        aspectRatio="16:10"
        loadHigherQualityImage
        className={productImageStyles}
      />
      <Text
        className={css({
          textStyle: 'subheading.regular',
          color: 'semantic.text.grey.2!',
        })}
      >
        {displayName}
      </Text>
    </div>
  );
};
