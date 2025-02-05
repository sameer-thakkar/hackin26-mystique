import type { TMetaLabel } from 'components/Espeon/ProductCard/MetaLabel/types';
import type { TRatingLabel } from 'components/Espeon/ProductCard/RatingLabel/types';
import type { TClassName } from 'components/Espeon/types';

export type TProductLabels = TClassName &
  TMetaLabel &
  TRatingLabel & {
    showMetaLabel?: boolean;
    showRating?: boolean;
    showSeparator?: boolean;
    onMoreInfoClick?: React.MouseEventHandler<HTMLButtonElement>;
  };
