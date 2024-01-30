import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import {
  CompactHighlightsWrapper,
  HighlightsPanel,
  ViewMoreButton,
} from 'components/Product/styles';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';

type Props = {
  hasRegularHighlights?: boolean;
  className?: string;
  isLoading?: boolean;
  tabs?: any;
  onClick?: () => void;
  moreContent?: boolean;
};

const Highlights = ({
  hasRegularHighlights = false,
  className,
  tabs,
  isLoading,
  onClick,
  moreContent,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showViewMoreAsOverlay, setShowViewMoreAsOverlay] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setShowViewMoreAsOverlay(
        contentRef.current.querySelector('ul')!.offsetHeight >
          (moreContent ? 280 : 240)
      );
    }
  }, []);

  return (
    <CompactHighlightsWrapper
      className={className}
      hasRegularHighlights={hasRegularHighlights}
    >
      <HighlightsPanel
        ref={contentRef}
        $isOverlay={showViewMoreAsOverlay}
        $moreContent={moreContent}
      >
        <Conditional if={!isLoading}>
          <>
            <PrismicRichText
              field={tabs[0].contents}
              components={shortCodeSerializer}
            />
            <div className="content-crawl">
              {tabs.map(({ contents }: any, index: number) => (
                <PrismicRichText
                  field={contents}
                  components={shortCodeSerializer}
                  key={index}
                />
              ))}
            </div>
          </>
        </Conditional>
        <Conditional if={isLoading}>
          <div>
            <Skeleton height="0.9375rem" borderRadius={2} />
            <Skeleton height="0.9375rem" width="60%" borderRadius={2} />
          </div>
          <div>
            <Skeleton height="0.9375rem" borderRadius={2} />
            <Skeleton height="0.9375rem" width="60%" borderRadius={2} />
          </div>
          <div>
            <Skeleton height="0.9375rem" borderRadius={2} />
            <Skeleton height="0.9375rem" width="60%" borderRadius={2} />
          </div>
        </Conditional>
      </HighlightsPanel>
      <ViewMoreButton onClick={onClick} $isOverlay={showViewMoreAsOverlay}>
        {`${strings.PC_EXP.SHOW_INCL} `}
        <ChevronRight fillColor={COLORS.BRAND.CANDY} />
      </ViewMoreButton>
    </CompactHighlightsWrapper>
  );
};

export default Highlights;
