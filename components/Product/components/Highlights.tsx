import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { PrismicRichText } from '@prismicio/react';
import Conditional from 'components/common/Conditional';
import { Heading, ViewMoreButton, Wrapper } from 'components/Product/styles';
import { truncate } from 'utils/helper';
import { shortCodeSerializer } from 'utils/shortCodes';
import COLORS from 'const/colors';
import { strings } from 'const/strings';
import { CHEVRON_RIGHT } from 'assets/SvgIcons';

type Props = {
  hasRegularHighlights?: boolean;
  className?: string;
  isLoading?: boolean;
  tabs?: any;
  onClick?: () => void;
};

const getHighlightContents = (tabs: Props['tabs']) => {
  const { contents } = tabs[0];
  const updatedContents: any[] = [];
  let charMax = 480;

  contents.forEach(({ text }: { text: string }, index: number) => {
    if (index >= 3) return;
    const length = text.length;
    const updatedText = truncate(text, charMax);
    updatedContents.push({
      ...contents[index],
      text: updatedText,
      content: {
        ...contents[index].content,
        text: updatedText,
      },
    });
    if (length < charMax) charMax -= length;
  });

  return updatedContents;
};

const Highlights = ({
  hasRegularHighlights = false,
  className,
  tabs,
  isLoading,
  onClick,
}: Props) => {
  const highlights = useMemo(() => getHighlightContents([...tabs]), [
    isLoading,
  ]);

  return (
    <Wrapper className={className} hasRegularHighlights={hasRegularHighlights}>
      <Heading>{strings.SHOW_PAGE.HIGHLIGHTS}</Heading>
      <div className="tab-panel">
        <Conditional if={!isLoading}>
          <PrismicRichText
            field={highlights}
            components={shortCodeSerializer}
          />
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
      </div>
      <ViewMoreButton onClick={onClick}>
        {`${strings.PC_EXP.SHOW_INCL} `}
        <CHEVRON_RIGHT fillColor={COLORS.BRAND.CANDY} />
      </ViewMoreButton>
    </Wrapper>
  );
};

export default Highlights;
