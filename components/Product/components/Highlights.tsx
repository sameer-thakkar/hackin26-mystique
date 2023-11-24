import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import Conditional from 'components/common/Conditional';
import {
  Heading,
  richtextElements,
  ViewMoreButton,
  Wrapper,
} from 'components/Product/styles';
import { truncate } from 'utils/helper';
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
      <Heading>Highlights</Heading>
      <div className="tab-panel">
        <Conditional if={!isLoading}>
          <RichText render={highlights} elements={richtextElements} />
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
