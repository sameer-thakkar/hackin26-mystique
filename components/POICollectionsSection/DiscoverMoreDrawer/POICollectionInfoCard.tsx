import { useContext, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import useSWRImmutable from 'swr/immutable';
import { Text } from '@headout/eevee';
import { css } from '@headout/pixie/css';
import { CollectionItem } from 'components/slices/CollectionCarousel/interface';
import { MBContext } from 'contexts/MBContext';
import useOnScreen from 'hooks/useOnScreen';
import { trackEvent } from 'utils/analytics';
import { getHeadoutApiUrl, HeadoutEndpoints, swrFetcher } from 'utils/apiUtils';
import { getLocalisedPrice } from 'utils/currency';
import { currencyListAtom } from 'store/atoms/currencyList';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import { ProductInfoCard } from './ProductInfoCard';
import { ProductInfoCardSkeleton } from './ProductInfoCardSkeleton';
import {
  cardContainerStyles,
  descriptionTextStyles,
  linkToPOISectionStyles,
  priceSectionStyles,
  productCardsContainerStyles,
} from './styles';

export const POICollectionInfoCard = ({
  collection,
  index,
}: {
  collection: CollectionItem;
  index: number;
}) => {
  const { collectionData, url, label } = collection || {};

  const { startingPrice } = collectionData || {};

  const { listingPrice, currency } = startingPrice || {};

  const { lang = 'en' } = useContext(MBContext);

  const currencyList = useRecoilValue(currencyListAtom);

  const formattedPrice = getLocalisedPrice({
    price: listingPrice,
    currencyCode: currency,
    lang,
    currencyList,
  });

  const collectionProductCardsUrl = getHeadoutApiUrl({
    endpoint: HeadoutEndpoints.CollectionProductCards,
    id: collection.collectionId,
    params: {
      lang,
      limit: '2',
      currency,
    },
  });

  const { data, error } = useSWRImmutable(collectionProductCardsUrl, {
    fetcher: swrFetcher,
  });

  const isLoading = !data && !error;

  const { productCards } = data?.result || {};

  const ref = useRef(null);

  const isIntersecting = useOnScreen({
    ref,
    unobserve: true,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    trackEvent({
      eventName: 'Collection Card Viewed',
      [ANALYTICS_PROPERTIES.RANKING]: index + 1,
    });
  }, [isIntersecting]);

  if (productCards?.items?.length < 2) {
    return null;
  }

  return (
    <a
      ref={ref}
      className={cardContainerStyles}
      href={url}
      target="_blank"
      onClick={() => {
        trackEvent({
          eventName: ANALYTICS_EVENTS.COLLECTION_CARD_CLICKED,
          [ANALYTICS_PROPERTIES.RANKING]: index + 1,
        });
      }}
    >
      <div className={linkToPOISectionStyles}>
        <Text
          className={css({
            textStyle: 'heading.regular',
            color: 'semantic.text.grey.2!',
          })}
        >
          {label}
        </Text>

        <ChevronRight
          fillColor={COLORS.GRAY.G2}
          className={css({
            alignSelf: 'center',
          })}
        />

        <Text className={descriptionTextStyles}>{collectionData?.subtext}</Text>

        <div className={priceSectionStyles}>
          <Text
            textStyle={'ui.label.small.heavy'}
            as="span"
            className={css({
              color: 'semantic.text.grey.3!',
            })}
          >
            {strings.FROM.toLocaleLowerCase()}
          </Text>
          <Text
            textStyle={'ui.label.regular.heavy'}
            as="span"
            className={css({
              color: 'semantic.text.grey.2!',
              fontSize: '0.9375rem',
            })}
          >
            {formattedPrice}
          </Text>
        </div>
      </div>

      <div className={productCardsContainerStyles}>
        {isLoading ? (
          <>
            {Array.from({ length: 2 }).map((_, index) => (
              <ProductInfoCardSkeleton key={index} />
            ))}
          </>
        ) : (
          productCards?.items?.map((item: any) => (
            <ProductInfoCard
              key={item.id}
              displayName={item.displayName}
              media={item.medias?.[0]}
            />
          ))
        )}
      </div>
    </a>
  );
};
