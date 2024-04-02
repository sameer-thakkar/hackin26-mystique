import { getObject } from 'components/ShowPages/parseShowPage';
import { formatDateToString } from 'utils/dateUtils';
import { SLICE_TYPES } from 'const/index';
import { strings } from 'const/strings';

export function getShowsBasedOnTimestamp(availableShowsData: []) {
  const nowPlayingShows: Record<string, string>[] = [];
  const upcomingShows: Record<string, string>[] = [];
  const pastShows: Record<string, string>[] = [];
  const filterHighlights = [
    strings.SHOW_PAGE.OPENING_DATE,
    strings.SHOW_PAGE.CLOSING_DATE,
  ];

  availableShowsData?.forEach((show: Record<string, string>) => {
    const { detailsObjects = {} } = getObject(
      show.microBrandsHighlight,
      filterHighlights
    );

    const openingDate = formatDateToString(
      new Date(detailsObjects[strings.SHOW_PAGE.OPENING_DATE]),
      'en',
      'MMM D, YYYY'
    );

    const closingDate = formatDateToString(
      new Date(detailsObjects[strings.SHOW_PAGE.CLOSING_DATE]),
      'en',
      'MMM D, YYYY'
    );

    const openingTimeStamp = new Date(openingDate).getTime();
    const closingTimeStamp = new Date(closingDate).getTime();
    const currentTimeStamp = new Date().getTime();

    if (
      show?.listingPrice &&
      currentTimeStamp > openingTimeStamp &&
      currentTimeStamp < closingTimeStamp
    ) {
      nowPlayingShows.push(show);
    } else if (
      (currentTimeStamp > closingTimeStamp &&
        currentTimeStamp < openingTimeStamp) ||
      currentTimeStamp < openingTimeStamp
    ) {
      upcomingShows.push(show);
    } else if (!show?.listingPrice || currentTimeStamp > closingTimeStamp) {
      pastShows.push(show);
    }
  });

  return { nowPlayingShows, upcomingShows, pastShows };
}

export function findFirstIndexOfAccordion(element: Record<string, string>) {
  return element.slice_type === SLICE_TYPES.ACCORDION;
}
