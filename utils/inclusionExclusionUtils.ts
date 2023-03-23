import { HIGHLIGHT_TYPES } from 'const/index';
import { strings } from 'const/strings';

const removeCurrentInclusionExclusion = (highlights: Array<Highlight>) => {
  let highlightArr = [...highlights];
  let inclusionsExist = false;
  let inclusionHighlightStartIndex = 0;
  let inclusionHighlightEndIndex = 0;
  for (let i = 0; i < highlightArr.length; i++) {
    const currHighlight = highlightArr[i];
    const { type, text } = currHighlight;
    if (type === HIGHLIGHT_TYPES.H6_HEADING && text === strings.INCLUSIONS) {
      inclusionsExist = true;
      inclusionHighlightStartIndex = i;
      continue;
    }
    if (inclusionsExist && type === HIGHLIGHT_TYPES.H6_HEADING) {
      inclusionHighlightEndIndex = i;
      break;
    }
  }
  if (inclusionsExist) {
    highlightArr.splice(
      inclusionHighlightStartIndex,
      inclusionHighlightEndIndex - inclusionHighlightStartIndex
    );
  }

  return highlightArr;
};

type TAppendInclusionExclusionHighlights = {
  currentHighlights: Array<Highlight>;
  inclusionExclusionHighlights: Array<Highlight>;
};

export const appendInclusionExclusionHighlights = ({
  currentHighlights,
  inclusionExclusionHighlights,
}: TAppendInclusionExclusionHighlights) => {
  let highlightArr = [...currentHighlights];
  let secondHighlightHeadingIndex = highlightArr.length;
  for (let i = 1; i < highlightArr.length; i++) {
    const currHighlight = highlightArr[i];
    const { type } = currHighlight;
    if (type === HIGHLIGHT_TYPES.H6_HEADING) {
      secondHighlightHeadingIndex = i;
      break;
    }
  }
  highlightArr.splice(
    secondHighlightHeadingIndex,
    0,
    ...inclusionExclusionHighlights
  );

  return highlightArr;
};

type TAppendInclusionExclusion = {
  highlightArr: Array<Highlight> | any;
  inclusions: Array<Highlight>;
  exclusions: Array<Highlight>;
};

export const appendInclusionExclusion = ({
  highlightArr = [],
  inclusions = [],
  exclusions = [],
}: TAppendInclusionExclusion) => {
  let currentHighlights = [...highlightArr];
  currentHighlights = removeCurrentInclusionExclusion(currentHighlights);

  let inclusionExclusionHighlights: Array<Highlight> = [];
  const inclusionItems = inclusions.length;
  const exclusionsItems = exclusions.length;

  if (inclusionItems || exclusionsItems) {
    inclusionExclusionHighlights.push({
      type: HIGHLIGHT_TYPES.H6_HEADING,
      text: strings.INCLUSIONS,
      spans: [],
      content: { text: strings.INCLUSIONS, spans: [] },
    });

    const paraType = {
      start: 0,
      end: strings.EXCLUSIONS?.length,
      type: 'strong',
    };
    if (inclusionItems) {
      inclusionExclusionHighlights.push({
        type: 'paragraph',
        text: strings.INCLUSIONS,
        spans: [paraType],
        content: { text: strings.INCLUSIONS, spans: [] },
      });
      inclusionExclusionHighlights = inclusionExclusionHighlights.concat(
        inclusions
      );
    }
    if (exclusionsItems) {
      inclusionExclusionHighlights.push({
        type: 'paragraph',
        text: strings.EXCLUSIONS,
        spans: [paraType],
        content: { text: strings.EXCLUSIONS, spans: [] },
      });
      inclusionExclusionHighlights = inclusionExclusionHighlights.concat(
        exclusions
      );
    }
    currentHighlights = appendInclusionExclusionHighlights({
      currentHighlights,
      inclusionExclusionHighlights,
    });
  }

  return currentHighlights;
};
