import { IGNORED_HEADINGS } from 'const/descriptors';
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
  localizedStrings: Record<string, any>;
};

export const appendInclusionExclusionHighlights = ({
  currentHighlights,
  inclusionExclusionHighlights,
  localizedStrings,
}: TAppendInclusionExclusionHighlights) => {
  let highlightArr = [...currentHighlights];
  let secondHighlightHeadingIndex = highlightArr.length;
  let tourInfoIndex = [];
  for (let i = 0; i < highlightArr.length; i++) {
    const currHighlight = highlightArr[i];
    const { type, text } = currHighlight;
    if (type === HIGHLIGHT_TYPES.H6_HEADING) {
      if (
        (text == localizedStrings.HOHO.TOUR_TIMINGS ||
          text == localizedStrings.HOHO.TOUR_FREQUENCY ||
          text == IGNORED_HEADINGS.OPERATING_HOURS ||
          text == IGNORED_HEADINGS.FREQUENCY ||
          text == IGNORED_HEADINGS.AUDIO_GUIDE ||
          text == IGNORED_HEADINGS.POPULAR_ATTRACTIONS ||
          text == IGNORED_HEADINGS.STARTING_STOP ||
          text == IGNORED_HEADINGS.TRAVEL_TIME ||
          text == IGNORED_HEADINGS.CRUISE_AUDIO_GUIDE ||
          text == IGNORED_HEADINGS.CRUISE_LIVE_ENTT ||
          text == IGNORED_HEADINGS.CRUISE_MEALS ||
          text == IGNORED_HEADINGS.CRUISE_BOAT) &&
        tourInfoIndex.length == 0
      ) {
        tourInfoIndex.push(i);
      } else if (secondHighlightHeadingIndex != highlightArr.length) {
        secondHighlightHeadingIndex = i;
        break;
      } else if (
        text != localizedStrings.HOHO.TOUR_TIMINGS &&
        text != localizedStrings.HOHO.TOUR_FREQUENCY &&
        text != IGNORED_HEADINGS.OPERATING_HOURS &&
        text != IGNORED_HEADINGS.FREQUENCY &&
        text != IGNORED_HEADINGS.AUDIO_GUIDE &&
        text != IGNORED_HEADINGS.POPULAR_ATTRACTIONS &&
        text != IGNORED_HEADINGS.TRAVEL_TIME &&
        text != IGNORED_HEADINGS.STARTING_STOP &&
        text != IGNORED_HEADINGS.CRUISE_AUDIO_GUIDE &&
        text != IGNORED_HEADINGS.CRUISE_LIVE_ENTT &&
        text != IGNORED_HEADINGS.CRUISE_MEALS &&
        text != IGNORED_HEADINGS.CRUISE_BOAT
      ) {
        tourInfoIndex.push(i);
        secondHighlightHeadingIndex = i;
      }
    }
  }
  let tourInfoItems =
    tourInfoIndex?.length === 2 ? tourInfoIndex[1] - tourInfoIndex[0] : 0;
  if (tourInfoIndex?.length === 2) {
    let tourHighlights = highlightArr.splice(tourInfoIndex[0], tourInfoItems);
    highlightArr.splice(highlightArr.length, 0, ...tourHighlights);
  }
  highlightArr.splice(
    secondHighlightHeadingIndex - tourInfoItems,
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
      inclusionExclusionHighlights =
        inclusionExclusionHighlights.concat(inclusions);
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
      inclusionExclusionHighlights =
        inclusionExclusionHighlights.concat(exclusions);
    }
    currentHighlights = appendInclusionExclusionHighlights({
      currentHighlights,
      inclusionExclusionHighlights,
      localizedStrings,
    });
  }

  return currentHighlights;
};
