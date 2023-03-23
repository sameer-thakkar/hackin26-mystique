import { HIGHLIGHT_TYPES } from 'const/index';

const removeCurrentInclusionExclusion = (
  highlights: Array<Highlight>,
  localizedStrings: Record<string, string>
) => {
  let highlightArr = [...highlights];
  let inclusionsExist = false;
  let inclusionHighlightStartIndex = 0;
  let inclusionHighlightEndIndex = 0;
  for (let i = 0; i < highlightArr.length; i++) {
    const currHighlight = highlightArr[i];
    const { type, text } = currHighlight;
    if (
      type === HIGHLIGHT_TYPES.H6_HEADING &&
      text === localizedStrings.INCLUSIONS
    ) {
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
  localizedStrings: Record<string, any>;
};

export const appendInclusionExclusion = ({
  highlightArr = [],
  inclusions = [],
  exclusions = [],
  localizedStrings,
}: TAppendInclusionExclusion) => {
  let currentHighlights = [...highlightArr];
  currentHighlights = removeCurrentInclusionExclusion(
    currentHighlights,
    localizedStrings
  );

  let inclusionExclusionHighlights: Array<Highlight> = [];
  const inclusionItems = inclusions.length;
  const exclusionsItems = exclusions.length;

  if (inclusionItems || exclusionsItems) {
    inclusionExclusionHighlights.push({
      type: HIGHLIGHT_TYPES.H6_HEADING,
      text: localizedStrings.INCLUSIONS,
      spans: [],
      content: {
        text: localizedStrings.INCLUSIONS,
        spans: [],
      },
    });

    const paraType = {
      start: 0,
      end: localizedStrings.EXCLUSIONS?.length,
      type: 'strong',
    };
    if (inclusionItems) {
      inclusionExclusionHighlights.push({
        type: 'paragraph',
        text: localizedStrings.INCLUSIONS,
        spans: [paraType],
        content: {
          text: localizedStrings.INCLUSIONS,
          spans: [],
        },
      });
      inclusionExclusionHighlights = inclusionExclusionHighlights.concat(
        inclusions
      );
    }
    if (exclusionsItems) {
      inclusionExclusionHighlights.push({
        type: 'paragraph',
        text: localizedStrings.EXCLUSIONS,
        spans: [paraType],
        content: {
          text: localizedStrings.EXCLUSIONS,
          spans: [],
        },
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
