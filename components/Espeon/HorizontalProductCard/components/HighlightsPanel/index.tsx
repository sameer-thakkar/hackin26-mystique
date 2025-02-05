import React from 'react';
import { Text } from '@headout/eevee';
import Conditional from 'components/common/Conditional';
import ChevronRight from 'components/Espeon/Assets/ChevronRight';
import { detailsCta, highlightsPanelStyle } from './styles';
import type { THighlightsPanel } from './types';

const HighlightsPanel = ({
  detailsLabel,
  children,
  onCtaClick,
}: THighlightsPanel) => {
  return (
    <div className={highlightsPanelStyle}>
      {children}

      <Conditional if={!!onCtaClick}>
        <Text
          onClick={onCtaClick as any}
          className={detailsCta}
          textStyle="Semantics/UI Label/Regular (Heavy)"
          color="semantic.text.grey.1"
          data-enabled={!!onCtaClick}
        >
          <Text as="span">{detailsLabel}</Text>
          <ChevronRight />
        </Text>
      </Conditional>
    </div>
  );
};

export default HighlightsPanel;
