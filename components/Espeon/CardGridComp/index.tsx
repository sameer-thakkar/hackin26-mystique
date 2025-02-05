import React, { type CSSProperties } from 'react';
import { type Token, token } from '@headout/pixie/tokens';
import { cardGridStylesRecipe } from './style';
import type { TCardGridProps } from './types';
import { chunkCardsIntoRows } from './utils';

function CardGrid<T>({
  cards,
  columns,
  CardComponent,
  horizontalSpace = 'space.24',
  verticalSpace = 'space.32',
}: TCardGridProps<T>) {
  const cardRows = chunkCardsIntoRows(cards, columns);
  const cardGridStyles = cardGridStylesRecipe();

  const dynamicStyles = {
    '--row-gap': `${token(`spacing.${verticalSpace}` as Token)}`,
    '--column-gap': `${token(`spacing.${horizontalSpace}` as Token)}`,
  } as CSSProperties;

  return (
    <div style={dynamicStyles} className={cardGridStyles.root}>
      {cardRows.map((row, rowIndex) => (
        <div key={rowIndex} className={cardGridStyles.rowWrapper}>
          {row.map((cardData, cardIndex) => (
            <CardComponent
              className={cardGridStyles.cardWrapper}
              {...cardData}
              key={cardIndex}
              index={cardIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export { CardGrid };
