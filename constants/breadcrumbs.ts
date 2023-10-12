export const HOME = 'HOME';
export const TRAVEL_GUIDE = 'TRAVEL_GUIDE';
export const THINGS_TO_DO = 'THINGS_TO_DO';
export const SHOW_NAME_TICKETS = 'SHOW_NAME_TICKETS';
export const TICKETS = 'Tickets';
export const ATTRACTIONS = 'ATTRACTIONS';

export const getEntMBLabels = ({
  isLTT = false,
  isBroadway = false,
  isViennaConcert = false,
}: {
  isLTT?: boolean;
  isBroadway?: boolean;
  isViennaConcert?: boolean;
}) => {
  switch (true) {
    case isLTT:
      return {
        HOME: 'LTT_HOME',
        VENUE_PAGE_HOME: 'LTT_VENUE_PAGE_HOME',
      };
    case isBroadway:
      return {
        HOME: 'BROADWAY_HOME',
        VENUE_PAGE_HOME: 'BROADWAY_VENUE_PAGE_HOME',
      };
    case isViennaConcert:
      return {
        HOME: 'VIENNA_CONCERT_HOME',
        VENUE_PAGE_HOME: 'VIENNA_CONCERT_VENUE_PAGE_HOME',
      };
    default:
      return {
        HOME: '',
        VENUE_PAGE_HOME: '',
      };
  }
};

export const A2_SHOULDER_PAGE_TYPES = {
  'A2 - Sightseeing Cruises': 'A2_SIGHTSEEING_CRUISES',
  'A2 - Dinner Cruises': 'A2_DINNER_CRUISES',
  'A2 - Evening Cruises': 'A2_EVENING_CRUISES',
  'A2 - Lunch Cruises': 'A2_LUNCH_CRUISES',
  'A2 - Yacht Tours': 'A2_YACHT_TOURS',
};
