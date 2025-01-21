import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useRecoilValue } from 'recoil';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import {
  CompactHighlightsWrapper,
  HighlightsPanel,
  ViewMoreButton,
} from 'components/Product/styles';
import { checkIfHarryPotterPage } from 'utils';
import { shortCodeSerializer } from 'utils/shortCodes';
import { appAtom } from 'store/atoms/app';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import ChevronRight from 'assets/chevronRight';
import DiagonalArrow from 'assets/diagonalArrow';

type Props = {
  hasRegularHighlights?: boolean;
  className?: string;
  isLoading?: boolean;
  tabs?: any;
  onClick?: () => void;
  showPopup?: boolean;
  ctaHasBackground?: boolean;
  showMoreDetails?: boolean;
  isV3Design?: boolean;
  productRef?: React.RefObject<HTMLDivElement>;
};

const Highlights = ({
  hasRegularHighlights = false,
  className,
  tabs,
  isLoading,
  onClick,
  showPopup = false,
  ctaHasBackground = false,
  showMoreDetails = false,
  isV3Design = false,
  productRef,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showViewMoreAsOverlay, setShowViewMoreAsOverlay] = useState(false);
  const { uid } = useRecoilValue(appAtom);

  useEffect(() => {
    let totalOffset = 0;

    if (productRef && productRef?.current) {
      const titleElem = productRef.current?.querySelector(
        "[data-card-section='Title']"
      );
      if (titleElem) {
        totalOffset += (titleElem as HTMLElement).offsetHeight;
      }
    }

    if (contentRef.current) {
      totalOffset += contentRef.current.querySelector('ul')!.offsetHeight;
      setShowViewMoreAsOverlay(totalOffset >= 240);
    }
  }, []);

  const isHarryPotterPage = checkIfHarryPotterPage(uid);

  const highlightsRichText = tabs.find(
    (tab: Record<string, unknown>) =>
      tab.heading === strings.SHOW_PAGE.HIGHLIGHTS
  );

  return (
    <CompactHighlightsWrapper
      className={className}
      hasRegularHighlights={hasRegularHighlights}
    >
      <HighlightsPanel
        ref={contentRef}
        $isOverlay={showViewMoreAsOverlay}
        $showPopup={showPopup}
        $isV3Design={isV3Design}
      >
        <Conditional if={!isLoading}>
          <>
            <PrismicRichText
              field={highlightsRichText?.contents ?? tabs?.[0]?.contents}
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
      <ViewMoreButton
        onClick={onClick}
        $isOverlay={showViewMoreAsOverlay}
        $showPopup={showPopup}
        $hasBackground={ctaHasBackground}
        $isHarryPotterPage={isHarryPotterPage}
      >
        {`${showMoreDetails ? strings.MORE_DETAILS : strings.PC_EXP.SHOW_INCL}`}
        {showPopup ? (
          DiagonalArrow
        ) : (
          <ChevronRight
            fillColor={COLORS.TEXT.CANDY_1}
            height={12}
            width={12}
            strokeWidth={1.5}
          />
        )}
      </ViewMoreButton>
    </CompactHighlightsWrapper>
  );
};

export default Highlights;
