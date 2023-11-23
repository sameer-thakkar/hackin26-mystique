// @ts-expect-error TS(7016): Could not find a declaration file for module 'pris... Remove this comment to see the full error message
import { RichText } from 'prismic-reactjs';
import { HIGHLIGHT_TYPES, OBJECT_TYPES } from 'const/index';

export const extractAccordionsFromHighlights = (
  highlights: Record<string, any>
) => {
  let accordions: Record<string, any> = [];
  const nonTabHighlights = highlights.reduce(
    (acc: Record<string, any>[], highlight: Record<string, any>) => {
      if (highlight.type === HIGHLIGHT_TYPES.H6_HEADING) {
        accordions.push({
          type: HIGHLIGHT_TYPES.HEADING,
          heading: RichText.asText([highlight]),
          contents: [],
        });
        return acc;
      }
      if (accordions.length) {
        accordions[accordions.length - 1].contents.push(highlight);
        return acc;
      } else return [...acc, highlight];
    },
    []
  );

  return { highlights: nonTabHighlights, accordions };
};

export const getObject = (data: any, filterArray: any) => {
  let detailsObjects: { [key: string]: string } = {},
    detailObjectHeading: any,
    currentObject: any;

  data?.forEach((element: any) => {
    if (element.type == HIGHLIGHT_TYPES.H6_HEADING) {
      detailObjectHeading = element.content.text;
      currentObject = OBJECT_TYPES.DETAIL;
    } else {
      if (currentObject === OBJECT_TYPES.DETAIL) {
        if (
          filterArray.find((x: any) => {
            return x === detailObjectHeading;
          })
        ) {
          detailsObjects[detailObjectHeading] = element.content.text;
        }
      }
    }
  });

  return {
    detailsObjects,
  };
};

export const getValidityDays = (string: string) => {
  const number = Number(string.match(/(\d+)/)?.[0]);
  if (number === 24 || number === 1) {
    return '1';
  } else if (number === 48 || number === 2) {
    return '2';
  } else if (number === 72 || number === 3) {
    return '3';
  } else return '';
};
