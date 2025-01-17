import { THEATRE_TYPES } from 'const/index';
import AbbaSeatMapSvg from 'assets/abbaSeatMapSvg';
import AccessibilityIcon from 'assets/accessibilityIcon';
import AdelphiTheatreSvg from 'assets/adelphiTheatreSvg';
import AldwychTheatreSvg from 'assets/aldwychTheatreSvg';
import ApolloTheatreSvg from 'assets/apolloTheatreSvg';
import ArtBoardSvg from 'assets/artBoardSvg';
import BinocularIcon from 'assets/binocularIcon';
import CloseToExitIcon from 'assets/closeToExit';
import CouchSvg from 'assets/couchSvg';
import DiscoBallSvg from 'assets/discoBallSvg';
import DominionTheatreSvg from 'assets/dominionTheatreSvg';
import DrinkSvg from 'assets/drinkSvg';
import HisMajestysTheatreSvg from 'assets/hisMajestysTheatreSvg';
import LegRoomSvg from 'assets/legRoomSvg';
import MovableSeatsIcon from 'assets/movableSeatsIcon';
import NovelloTheatreSvg from 'assets/novelloThetreSvg';
import PalaceTheatreSvg from 'assets/palaceTheatre';
import PrinceEdwardTheatreSvg from 'assets/princeEdwardTheatreSvg';
import PrinceOfWalesTheatreSvg from 'assets/princeOfWalesTheatreSvg';
import RadioCityMusicHallSvg from 'assets/radioCityMusicHallSvg';
import RestRoomSvg from 'assets/restRoomSvg';
import RoyalAlbertHallSvg from 'assets/royalAlbertHallSvg';
import SeatIcon from 'assets/seatIcon';
import SeatIcon2 from 'assets/seatIcon2';
import SondheimTheatreSvg from 'assets/sondheimTheatre';
import SwivelSeatsIcon from 'assets/swivelSeats';
import TroubadourWembleyParkTheatreSvg from 'assets/troubadourWembleyParkSvg';
import ValueForMoneyIcon from 'assets/valueForMoneyIcon';
import WalkingTours from 'assets/walkingTours';
import WheelChairIcon from 'assets/wheelChairIcon';
import Wineries from 'assets/wineries';
import { SEATING_MAP_TYPE } from './interface';

export const DEFAULT_MAP_SECTION_INFO = {
  isVisible: false,
  sectionId: '',
  left: 0,
  top: 0,
};

export const MIN_VISIBLE_POINT_ON_SCREEN = 120;
export const MAX_VISIBLE_POINT_X_ON_MAP = 1300;
export const MIN_HEIGHT_OF_HOVERED_INFO_CARD = 300;
export const BUFFER_DISTANCE = 20;

type BANNER_ICON_TYPE = {
  name: string;
  icon: React.FC<React.PropsWithChildren<{ width?: string; height?: string }>>;
};
export type SEATING_MAP_CONTENT_TYPE = {
  BANNER_HEADING: string;
  BANNER_DESCRIPTION: string;
  BANNER_ICONS: Array<BANNER_ICON_TYPE>;
};

export const DEFAULT_SEATING_MAP_CONTENT: SEATING_MAP_CONTENT_TYPE = {
  BANNER_HEADING: '',
  BANNER_DESCRIPTION: '',
  BANNER_ICONS: [],
};

export const SEATING_MAP: SEATING_MAP_TYPE = {
  expUids: ['www.london-theater-tickets.com'],
  seatMapTypes: [THEATRE_TYPES.ABBA_ARENA],
  headerContent: {
    [THEATRE_TYPES.ABBA_ARENA]: {
      BANNER_HEADING: 'ABBA Arena Seating Plan',
      BANNER_DESCRIPTION:
        'This purpose-built, state-of-the-art arena boasts dance floors and seating sections for having the time of your life. The ABBA Arena seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '3000 capacity',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: {
      BANNER_HEADING: "His Majesty's Seating Plan",
      BANNER_DESCRIPTION:
        "The second oldest theatre site in London, the venue is home to the city's greatest love story. His Majesty's Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.",
      BANNER_ICONS: [
        {
          name: '1231 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.NOVELLO_THEATRE]: {
      BANNER_HEADING: 'Novello Theatre seating plan',
      BANNER_DESCRIPTION:
        'A prestigious West End venue run by the Delfont Mackintosh Theatres, Novello Theatre is located on the banks of the Thames River. Novello Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '1095 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: {
      BANNER_HEADING: 'Prince Edward Theatre seating plan',
      BANNER_DESCRIPTION:
        'This venue served as a club fro servicemen and a dance and cabaret hall before reverting to hosting theatrical shows. The Prince Edward Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '1728 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.PALACE_THEATRE]: {
      BANNER_HEADING: 'Palace Theatre seating plan',
      BANNER_DESCRIPTION:
        "In center of Cambridge Circus, the Palace Theatre is best known for hosting some of West End's longest running productions, including Les Misérables and Jesus Christ Superstars.The Palace Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.",
      BANNER_ICONS: [
        {
          name: '1231 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.SONDHEIM_THEATRE]: {
      BANNER_HEADING: 'Sondheim Theatre seating plan',
      BANNER_DESCRIPTION:
        "The Sondheim Theatre, originally opened as Queen's Theatre, is one of Shaftesbury Avenue crown jewels. It survived a significant destruction during WWII, but continues to hold a special place in the city's culture. The Sondheim Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.",
      BANNER_ICONS: [
        {
          name: '1122 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.TROUBADOUR_WEMBLEY_PARK_THEATRE]: {
      BANNER_HEADING: 'Troubadour Wembley Park Theatre seating plan',
      BANNER_DESCRIPTION:
        'Opened in 2019 on the site of former Fountain Studios, the theater is part of the rapidly developing Wembley Park area, which includes Wembley Stadium and SSE Arena. The Troubadour Wembley Park Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '2000 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.PRINCE_OF_WALES_THEATRE]: {
      BANNER_HEADING: 'Prince of Wales Theatre seating plan',
      BANNER_DESCRIPTION:
        'Originally opened in 1884, the Prince of Wales Theatre was rebuilt in 1937 with a fresh art-deco design by Robert Cromie. Its rooftop tower has become an irreplaceable part of the London skyline. The Prince of Wales Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '1135 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.DOMINION_THEATRE]: {
      BANNER_HEADING: 'Dominion Theatre seating plan',
      BANNER_DESCRIPTION:
        "With 2835 seats, the Dominion Theatre is one of London's largest venues. The art deco space has undergone numerous refurbishments over the years, and even served as a popular cinema hall in the 1930s. The Dominion Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.",
      BANNER_ICONS: [
        {
          name: '2835 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.ADELPHI_THEATRE]: {
      BANNER_HEADING: 'Adelphi Theatre seating plan',
      BANNER_DESCRIPTION:
        'The Adelphi Theatre is an art-deco masterpiece on the Strand, the fourth theatre on this site since 1806. Over the years, it has hosted many long hit musicals like Chicago and Sunset Boulevard. The Adelphi Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '1498 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.ALDWYCH_THEATRE]: {
      BANNER_HEADING: 'Aldwych Theatre seating plan',
      BANNER_DESCRIPTION:
        'The Edwardian-style Aldwych Theatre was opened in 1905, designed by W. G. R. Sprague to match the nearby Waldorf Hotel and Novello Theatre. The Aldwych Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '1231 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.ADELPHI_THEATRE]: {
      BANNER_HEADING: 'Adelphi Theatre seating plan',
      BANNER_DESCRIPTION:
        'The Adelphi Theatre is an art-deco masterpiece on the Strand, the fourth theatre on this site since 1806. Over the years, it has hosted many long hit musicals like Chicago and Sunset Boulevard. The Adelphi Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.',
      BANNER_ICONS: [
        {
          name: '1498 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.ROYAL_ALBERT_HALL]: {
      BANNER_HEADING: 'Royal Albert Hall seating plan',
      BANNER_DESCRIPTION:
        "One of London's legendary performance venues, the Royal Albert Hall is incredibly versatile, credited with hosting everything from the Proms and concerts to circus and ballet. The Royal Albert Hall seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.",
      BANNER_ICONS: [
        {
          name: '5271 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.APOLLO_THEATRE]: {
      BANNER_HEADING: 'Apollo Theatre seating plan',
      BANNER_DESCRIPTION:
        "Opened in 1901, the Apollo Theatre is part of the cluster on Shaftesbury Avenue. Designed with a focus on musical theatre presentation, it features opulent French Renaissance and decor inspired by Louis XIV's style. The Apollo Theatre seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.",
      BANNER_ICONS: [
        {
          name: '833 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
    [THEATRE_TYPES.RADIO_CITY_MUSIC_HALL]: {
      BANNER_HEADING: 'Radio City Music Hall seating chart',
      BANNER_DESCRIPTION:
        'With the capacity to seat over 6000 people, Radio City Music Hall is the largest indoor theater in the world. Opened in 1932, it is celebrated for its stunning Art Deco architecture and is best known for hosting the legendary Rockettes and their precision dance routines, especially during the annual Christmas Spectacular.',
      BANNER_ICONS: [
        {
          name: '6,013 seats',
          icon: SeatIcon2,
        },
        {
          name: 'Wheelchair accessible',
          icon: WheelChairIcon,
        },
      ],
    },
  },
  mapHoverContent: {
    [THEATRE_TYPES.ABBA_ARENA]: {
      'seating-block-a': {
        blockName: 'Block A',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Far left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '51 seats',
          },
          {
            icon: BinocularIcon,
            label: 'Excellent views from all seats',
          },
          {
            icon: LegRoomSvg,
            label: 'Spacious legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Prime seating area, closest to the stage with raised elevation for clear views, though some seats offer angled views.',
        sectionsAtTheatre: 'Seating blocks',
        accessibleSeating: 'wheelchair icon',
        rows: 'rows A - C',
      },
      'seating-block-b': {
        blockName: 'Block B',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '48 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Excellent views from all seats',
          },
          {
            icon: LegRoomSvg,
            label: 'Spacious legroom',
          },
          {
            icon: DrinkSvg, // drink holder
            label: 'Drink holder',
          },
        ],
        description:
          'Get up close and personal with the ABBA-tars from these comfortable seating blocks positioned right above the dance floor, offering perfectly clear views. Some seats may have slightly angled views.',
        sectionsAtTheatre: 'Dance booths',
        accessibleSeating: 'step-free / ramp icon',
        rows: 'rows A - C',
      },
      'seating-block-c': {
        blockName: 'Block C',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Center',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '60 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Excellent views from all seats',
          },
          {
            icon: LegRoomSvg,
            label: 'Spacious legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Every seat in this section easily provides the best views of the stage. Seated right above the dance floor, you will get the best lighting effects due to its centrality.',
        sectionsAtTheatre: 'Dance Floor',
        accessibleSeating: 'car icon',
        rows: 'rows A - C',
      },
      'seating-block-d': {
        blockName: 'Block D',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '48 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Excellent views from all seats',
          },
          {
            icon: LegRoomSvg,
            label: 'Spacious legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Get up close and personal with the ABBA-tars from these comfortable seating blocks positioned right above the dance floor, offering perfectly clear views. Some seats may have slightly angled views.',
        accessibleSeating: 'guide dog icon',
        rows: 'rows A - C',
      },
      'seating-block-e': {
        blockName: 'Block E',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Far right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '51 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Excellent views from all seats',
          },
          {
            icon: LegRoomSvg,
            label: 'Spacious legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Prime seating area, closest to the stage with raised elevation for clear views, though some seats offer angled views.',
        accessibleSeating: 'closed-loop hearing system',
        rows: 'rows A - C',
      },
      'seating-block-f': {
        blockName: 'Block F',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Far left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '238 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Rows C-G provide good views',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Steep tiering provides unrestricted great views from nearly every seat, even if you are in the farthest row. Left-most side views of the screen may be slightly affected from certain angles.',
        rows: 'rows A - P',
      },
      'seating-block-g': {
        blockName: 'Block G',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '204 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Rows C-G provide good views',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Provides good views from most seats, even if you are in the farthest row. Largely unrestricted views as the seats are steeply tiered. Angled view - might be tough to see the left-most side of the screen.',
        rows: 'rows A - P',
      },
      'seating-block-h': {
        blockName: 'Block H',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Far center',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '356 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Rows A-M, middle seats provide best views',
          },
          {
            icon: LegRoomSvg,
            label: 'Great legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'The front or middle seats offer great views. Massive screens ensure visibility even from seats towards the back.',
        rows: 'rows A - P',
      },
      'seating-block-j': {
        blockName: 'Block J',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '204 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Rows C-G provide good views',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Provides good views from most seats, even if you are in the farthest row. Largely unrestricted views as the seats are steeply tiered. Angled view - might be tough to see the right-most side of the screen.',
        rows: 'rows A - P',
      },
      'seating-block-k': {
        blockName: 'Block K',
        theatreSectionName: 'Seating blocks',
        theatreSectionLabel: 'Far right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '238 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Rows C-G provide good views',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Steep tiering provides unrestricted great views from nearly every seat, even if you are in the farthest row. Right-most side views of the screen may be slightly affected from certain angles.',
        rows: 'rows A - P',
      },
      'seating-accessible-a': {
        blockName: 'Accessible A',
        theatreSectionName: 'Accessible sections',
        theatreSectionLabel: 'Far left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '14 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Unobstructured views',
          },
          {
            icon: LegRoomSvg,
            label: 'Great legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Located behind the front seating blocks, this elevated section ensures clear views of the stage. Conveniently close to washrooms, it also provides wheelchair spaces and ambulatory seating.',
        rows: '',
      },
      'seating-accessible-b': {
        blockName: 'Accessible B',
        theatreSectionName: 'Accessible sections',
        theatreSectionLabel: 'Left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '12 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Unobstructured views',
          },
          {
            icon: LegRoomSvg,
            label: 'Great legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'Located behind the front seating blocks, this elevated section ensures clear views of the stage. Conveniently close to washrooms, it also provides wheelchair spaces and ambulatory seating',
        rows: '',
      },
      'seating-accessible-c': {
        blockName: 'Accessible C',
        theatreSectionName: 'Accessible sections',
        theatreSectionLabel: 'Center',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '16 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Best views in accessible seating',
          },
          {
            icon: LegRoomSvg,
            label: 'Great legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],
        description:
          'This centrally positioned section offers some of the best views from its raised position. Easy access to washrooms, along with wheelchair spaces and ambulatory seating, ensures convenience for all attendees.',
        rows: '',
      },
      'seating-accessible-d': {
        blockName: 'Accessible D',
        theatreSectionName: 'Accessible sections',
        theatreSectionLabel: 'Right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '12 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Unobstructured views',
          },
          {
            icon: LegRoomSvg,
            label: 'Great legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],

        description:
          'Located behind the front seating blocks in a raised position so the views are clear. You can easily step out & access the washrooms. Has wheelchair spaces and ambulatory seating. \n',
        rows: '',
      },
      'seating-accessible-e': {
        blockName: 'Accessible E',
        theatreSectionName: 'Accessible sections',
        theatreSectionLabel: 'Far right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '14 seats in this section',
          },
          {
            icon: BinocularIcon,
            label: 'Unobstructured views',
          },
          {
            icon: LegRoomSvg,
            label: 'Great legroom',
          },
          {
            icon: DrinkSvg,
            label: 'Drink holder',
          },
        ],

        description:
          'Located behind the front seating blocks in a raised position so the views are clear. You can easily step out & access the washrooms. Has wheelchair spaces and ambulatory seating. \n',
        rows: '',
      },
      'dance-booth-a': {
        blockName: 'Dance Booth A',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Front left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '10 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-booth-b': {
        blockName: 'Dance Booth B',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Front right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '10 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-booth-c': {
        blockName: 'Dance Booth C',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Back left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '12 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-booth-d': {
        blockName: 'Dance Booth D',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Back right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '12 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-booth-e': {
        blockName: 'Dance Booth E',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Front left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '10 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-booth-f': {
        blockName: 'Dance Booth F',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Front right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '10 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-booth-g': {
        blockName: 'Dance Booth G',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Back left',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '12 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-booth-h': {
        blockName: 'Dance Booth H',
        theatreSectionName: 'Dance booths',
        theatreSectionLabel: 'Back right',
        quickInfo: [
          {
            icon: SeatIcon,
            label: '12 seats',
          },
          {
            icon: DiscoBallSvg,
            label: 'Private dance floor',
          },
          {
            icon: CouchSvg,
            label: 'Private couch',
          },
        ],
        description:
          'Perfect for a private group who wants to have their own ABBA party. Each booth has a private dance floor & a couch. The tickets are expensive but worth the private dance floor experience.',
        rows: '',
      },
      'dance-floor': {
        blockName: 'Dance Floor',
        theatreSectionName: 'Dance Floor',
        theatreSectionLabel: 'Front of stage',
        quickInfo: [
          {
            icon: DiscoBallSvg,
            label: 'Standing-only dance floor',
          },
          {
            icon: Wineries,
            label: 'Easy access to bar',
          },
          {
            icon: WalkingTours,
            label: 'Free-roam space',
          },
          {
            icon: RestRoomSvg,
            label: 'Easy access to washrooms',
          },
        ],
        description:
          'Get the closest view of the ‘ABBAtars’ with full lighting and special effects immersion. Enjoy the freedom to move and dance with the General Admission Standing ticket. Note: Standing too close to the stage may limit your view of the wider stage area.',
        rows: '',
      },
    },
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: {
      'stalls-front': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front - Stalls',
        description:
          'Prime seating area, offers excellent views from every seat. For a more affordable option, the middle seats in Rows E-H provide great views at slightly lower prices..',
        quickInfo: [
          { icon: SeatIcon, label: '369 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows B-F' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'rows A-N',
      },
      'stalls-rear': {
        blockName: 'Rear',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear - Stalls',
        description:
          'This section offers great views due to its central location and proximity to the stage. However, some seats may have restricted views due to pillars and the circle overhang.',
        accessibleSeating: 'Wheelchair accessibility: Row S',
        quickInfo: [
          { icon: SeatIcon, label: '140 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows P-Q' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: WheelChairIcon, label: 'Wheelchair accessibility: Row S' },
        ],
        rows: 'rows P-T',
      },
      'box-1': {
        blockName: 'Box 1',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Box 1 Stalls',
        description:
          'The box seats offer an unbeatable close-up view of the stage. While you might miss some views on one side, the comfort, privacy, and unique experience make it worth it.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          {
            icon: BinocularIcon,
            label: 'Close-up view; right side restricted',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Private box',
      },
      'box-2': {
        blockName: 'Box 2',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Box 2 Stalls',
        description:
          'The box seats offer an unbeatable close-up view of the stage. While you might miss some views on one side, the comfort, privacy, and unique experience make it worth it.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          {
            icon: BinocularIcon,
            label: 'Close-up view; left side restricted',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Private box',
      },
      'royal-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Left Royal Circle',
        description:
          'The first three rows provide excellent views, though the ends are marked as restricted views. Seats towards the ends have a slightly angled view due to the curved rows along the auditorium sides.',
        quickInfo: [
          { icon: SeatIcon, label: '79 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows A-H',
      },
      'royal-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Center Royal Circle',
        description:
          'This centrally located section offers some of the best views of the stage due to its proximity. However, four pillars in the area obstruct views from the surrounding seats.',
        quickInfo: [
          { icon: SeatIcon, label: '123 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-F' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows A-H',
      },
      'royal-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Right Royal Circle',
        description:
          'The first three rows provide excellent views, though the ends are marked as restricted views. Seats towards the ends have a slightly angled view due to the curved rows along the auditorium sides.',
        quickInfo: [
          { icon: SeatIcon, label: '79 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows A-H',
      },
      'box-3': {
        blockName: 'Box 3',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box 3 Royal Circle',
        description:
          'If you don’t mind missing some views on one side, the comfort, privacy, and unique experience of the box seats are unbeatable.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          {
            icon: BinocularIcon,
            label: 'Great view; right side restricted',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Private box',
      },
      'box-4': {
        blockName: 'Box 4',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box 4 Royal Circle',
        description:
          'If you don’t mind missing some views on one side, the comfort, privacy, and unique experience of the box seats are unbeatable.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great view; left side restricted' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Private box',
      },
      'grand-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Left Grand Circle',
        description:
          'This section features steep seating, offering elevated views, especially towards the rear. Some seats may have partial obstructions from support pillars. Rows A-D provide mostly unobstructed views towards the aisle.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A-D' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-K',
      },
      'grand-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Center Grand Circle',
        description:
          'This section features a steep rake, elevating rear seats for excellent views. Rows A-C, seats 12-23 offer particularly great views.',
        quickInfo: [
          { icon: SeatIcon, label: '170 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows A-K',
      },
      'grand-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Right Grand Circle',
        description:
          'This section features steep seating, offering elevated views, especially towards the rear. Some seats may have partial obstructions from support pillars. Rows A-D provide mostly unobstructed views towards the aisle.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A-D' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-K',
      },
      'balcony-left': {
        blockName: 'Left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Left Balcony',
        description:
          'These seats are elevated and distant, so renting binoculars might enhance your experience. Opting for aisle seats can provide additional space and legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '29 seats' },
          { icon: BinocularIcon, label: 'Decent views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-F',
      },
      'balcony-mid-left': {
        blockName: 'Mid - left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Mid Left Balcony',
        description:
          "The stage is quite distant, but this section's central rear position still offers great views. Consider renting binoculars for an enhanced experience. Aisle seats provide a bit of extra space and legroom.",
        quickInfo: [
          { icon: SeatIcon, label: '27 seats' },
          { icon: BinocularIcon, label: 'Good views in Row A' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-C',
      },
      'balcony-mid-right': {
        blockName: 'Mid - right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Mid Right Balcony',
        description:
          "The stage is quite distant, but this section's central rear position still offers great views. Consider renting binoculars for an enhanced experience.",
        quickInfo: [
          { icon: SeatIcon, label: '27 seats' },
          { icon: BinocularIcon, label: 'Good views in Row A' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-C',
      },
      'balcony-right': {
        blockName: 'Right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Right Balcony',
        description:
          "The stage is quite distant, but this section's central rear position still offers great views. Consider renting binoculars for an enhanced experience. Aisle seats provide a bit of extra space and legroom.",
        quickInfo: [
          { icon: SeatIcon, label: '20 seats' },
          { icon: BinocularIcon, label: 'Decent views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-D',
      },
    },
    [THEATRE_TYPES.NOVELLO_THEATRE]: {
      'stalls-front': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front Stalls',
        description:
          'This section is well-raked ensuring premium views from all rows. Unlike other sections, the rows don’t curve here so even the seats on the edge provide great views.',
        quickInfo: [
          { icon: SeatIcon, label: '230 seats' },
          { icon: BinocularIcon, label: 'Excellent views in Rows D-H' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'rows C-M',
      },
      'stalls-rear': {
        blockName: 'Rear',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Stalls',
        description:
          'This section is well-raked ensuring premium views from all rows. Unlike other sections, the rows don’t curve here so even the seats on the edge provide great views. The overhang from the dress circle affects the last few rows.',
        quickInfo: [
          { icon: SeatIcon, label: '249 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows N-T' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'rows N-X',
      },
      'dress-circle-slips-left': {
        blockName: 'Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Left Dress Circle',
        description:
          'The row curves along the sides of the auditorium, resulting in limited and angled views from most seats. However, seats AA10, AA11, and AA12 offer good stage views at a reasonable price.',
        quickInfo: [
          { icon: SeatIcon, label: '9 seats' },
          { icon: BinocularIcon, label: 'Restricted & side-on views' },
          {
            icon: WheelChairIcon,
            label: 'Wheelchair accessible (10, 11, 12)',
          },
        ],
        rows: 'Row AA',
      },
      'dress-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Center Dress Circle',
        description:
          'The proximity to the stage and steep structure ensure almost all seats in this section provide clear views. The rows gently curve towards the edges, offering a slightly angled view.',
        quickInfo: [
          { icon: SeatIcon, label: '227 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-F' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'rows A-K',
      },
      'dress-circle-slips-right': {
        blockName: 'Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Right Dress Circle',
        description:
          'The row curves along the sides of the auditorium, resulting in limited and angled views from most seats. However, seats AA8, AA9, BB2, and BB3 offer good stage views at a reasonable price.',
        quickInfo: [
          { icon: SeatIcon, label: '12 seats' },
          { icon: BinocularIcon, label: 'Restricted & side-on views' },
        ],
        rows: 'rows AA-BB',
      },
      'grand-circle-slips-left': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Left - Grand Circle',
        description:
          'The row curves along the sides of the auditorium, resulting in limited and angled views from most seats. However, seats AA13 and AA14 offer good stage views at a reasonable price.',
        quickInfo: [
          { icon: SeatIcon, label: '12 seats' },
          { icon: BinocularIcon, label: 'Restricted & side-on views' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Row AA',
      },
      'grand-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Center Grand Circle',
        description:
          'As the rows curve along the sides, seats towards the ends offer limited and angled views of the stage. However, the steep incline ensures clear views from the middle seats.',
        quickInfo: [
          { icon: SeatIcon, label: '190 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views in the middle seats of Rows A-C',
          },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-H',
      },
      'grand-circle-slips-right': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Right Grand Circle',
        description:
          'As the row curves along the sides of the auditorium, most seats offer limited and angled views of the stage. However, AA11 and AA12 provide good stage views at a reasonable price.',
        quickInfo: [
          { icon: SeatIcon, label: '12 seats' },
          { icon: BinocularIcon, label: 'Restricted & side-on views' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Row AA',
      },
      'balcony-balcony': {
        blockName: 'Balcony',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony',
        description:
          "The stage is distant, yet the steeply raked rows ensure great, obstruction-free views from most seats, particularly in the middle. However, a large safety bar along the balcony's length may affect views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '142 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views in the middle seats of Rows A-D',
          },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'rows A-F',
      },
      'box-a': {
        blockName: 'Dress Circle Box A',
        theatreSectionName: 'Dress Circle Boxes',
        theatreSectionLabel: 'Box A Dress Circle ',
        description:
          'The box seats offer an unbeatable close-up view of the stage. While you might miss some views on one side, the comfort, privacy, and unique experience make it worth it.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label:
              'Brilliant views; slightly restricted to the left of the stage',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Private Box',
      },
      'box-c': {
        blockName: 'Dress Circle Box C',
        theatreSectionName: 'Dress Circle Boxes',
        theatreSectionLabel: 'Box C Dress Circle ',
        description:
          'The box seats offer an unbeatable close-up view of the stage. While you might miss some views on one side, the comfort, privacy, and unique experience make it worth it.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label:
              'Brilliant views; slightly restricted to the right of the stage',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Private Box',
      },
      'box-e': {
        blockName: 'Grand Circle Box E',
        theatreSectionName: 'Grand Circle Boxes',
        theatreSectionLabel: 'Box E Dress Circle ',
        description:
          "If you're comfortable with potentially missing some stage views on one side, the box seats offer unbeatable comfort, privacy, and a special experience. Positioned elevated, they provide largely unrestricted views.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views; slightly restricted to the left of the stage',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Private Box',
      },
      'box-f': {
        blockName: 'Grand Circle Box F',
        theatreSectionName: 'Grand Circle Boxes',
        theatreSectionLabel: 'Box F Dress Circle ',
        description:
          "If you're comfortable with potentially missing some stage views on one side, the box seats offer unbeatable comfort, privacy, and a special experience. Positioned elevated, they provide largely unrestricted views.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views; slightly restricted to the right of the stage',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Private Box',
      },
    },
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: {
      'aa-right': {
        blockName: 'AA',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'AA Right Grand Circle',
        description:
          'The section offers good views of the stage from its elevated position. While you might miss some views on one side, movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '5 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views; right side views restricted',
          },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows AA-K',
      },
      'aa-left': {
        blockName: 'AA',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'AA Left Grand Circle',
        description:
          'The section offers good views of the stage from its elevated position. While you might miss some views on one side, movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '5 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views; left side views restricted',
          },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows AA-K',
      },
      'stalls-front': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front Stalls',
        description:
          'The most premium section in the theatre, offering excellent views from all seats. The staggered seating ensures an unobstructed view, even from the back rows.',
        quickInfo: [
          { icon: SeatIcon, label: '327 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows C-G' },
          { icon: LegRoomSvg, label: 'Comfortable legroom' },
        ],
        rows: 'rows AA-K',
      },
      'stalls-rear-left': {
        blockName: 'Rear Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Left Stalls',
        description:
          'This section offers clear views of the stage. Aisle seats provide extra legroom. Being to the left of the stage, some seats have angled views, potentially missing the far left section.',
        quickInfo: [
          { icon: SeatIcon, label: '169 seats' },
          { icon: BinocularIcon, label: 'Best views from aisle seats' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows L-ZC',
      },
      'stalls-rear-center': {
        blockName: 'Rear Center',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Center Stalls',
        description:
          'The central location and proximity to the stage offer great views. The steep seating ensures unobstructed views, even with rows ahead.',
        quickInfo: [
          { icon: SeatIcon, label: '215 seats' },
          { icon: BinocularIcon, label: 'Great views from Rows L-T' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows L-ZC',
      },
      'stalls-rear-right': {
        blockName: 'Rear Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Right Stalls',
        description:
          'Located close to the stage, this section offers clear views. Positioned to the right of the stage, some seats have angled views, potentially missing the far right section.',
        quickInfo: [
          { icon: SeatIcon, label: '169 seats' },
          { icon: BinocularIcon, label: 'Great views from Rows L-T' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows L-ZC',
      },
      'dress-circle-front-left': {
        blockName: 'Front Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Front Left Dress Circle',
        description:
          'Though a bit far from the stage, the steep rake offers clear views from all rows. Seats on the extreme left provide excellent legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Best views from Rows A-D' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-E',
      },
      'dress-circle-front-right': {
        blockName: 'Front Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Front Right Dress Circle',
        description:
          'Though a bit far from the stage, the steep rake offers clear views from all rows. Seats on the extreme left provide excellent legroom. The safety rail in front of Row A may obstruct the view slightly.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Best views from Rows A-D' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-E',
      },
      'dress-circle-rear-left': {
        blockName: 'Rear Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rear Left Dress Circle',
        description:
          'The stage may appear distant, yet the steep seating guarantees good views from most seats. Aisle seats on the right offer ample legroom. Keep in mind, the Grand Circle overhang may obstruct parts of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '59 seats' },
          { icon: BinocularIcon, label: 'Good views from Rows F-J' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows F-O',
      },
      'dress-circle-rear-center': {
        blockName: 'Rear Center',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rear Center Dress Circle',
        description:
          "This section's central location and steep incline make it an excellent choice with unobstructed views of the stage. Nearly every seat in this section offers brilliant views and ample legroom, ensuring comfort throughout the performance.",
        quickInfo: [
          { icon: SeatIcon, label: '120 seats' },
          {
            icon: BinocularIcon,
            label: 'Best views from seats at the end of the row',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'rows F-M',
      },
      'dress-circle-rear-right': {
        blockName: 'Rear Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rear Right Dress Circle',
        description:
          'The stage may appear distant, yet the steep seating guarantees good views from most seats. Aisle seats on the right offer ample legroom. Keep in mind, the Grand Circle overhang may obstruct parts of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '50 seats' },
          { icon: BinocularIcon, label: 'Good views from Rows F-J' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows F-M',
      },
      'grand-circle-front-left': {
        blockName: 'Front Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Front Left Grand Circle',
        description:
          "The stage is distant, yet the steeply raked rows provide good views. Positioned left of the stage, some views are restricted. A large safety bar along the section's length affects views from certain seats.",
        quickInfo: [
          { icon: SeatIcon, label: '60 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-F',
      },
      'grand-circle-front-center': {
        blockName: 'Front Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Front Center Grand Circle',
        description:
          "The stage is distant, but the steeply raked rows offer great, obstruction-free views from most seats, especially in the middle. However, a large safety bar along the section's length may affect views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '119 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the front; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-G',
      },
      'grand-circle-front-right': {
        blockName: 'Front Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Front Right Grand Circle',
        description:
          "The stage is distant, yet the steeply raked rows provide good views. Positioned right of the stage, some views are restricted. A large safety bar along the section's length affects views from certain seats.",
        quickInfo: [
          { icon: SeatIcon, label: '60 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-F',
      },
      'grand-circle-rear-left': {
        blockName: 'Rear Left Grand Circle',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rear Left Grand Circle',
        description:
          "The stage is distant, yet the steeply raked rows provide good views. Positioned left of the stage, some views are restricted. A large safety bar along the section's length affects views from certain seats.",
        quickInfo: [
          { icon: SeatIcon, label: '30 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows H-L',
      },
      'grand-circle-rear-center': {
        blockName: 'Rear Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rear Center Grand Circle',
        description:
          "The stage is distant, but the steeply raked rows offer great, obstruction-free views from most seats, especially in the middle. However, a large safety bar along the section's length may affect views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '98 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the front; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows H-N',
      },
      'grand-circle-rear-right': {
        blockName: 'Rear Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rear Right Grand Circle',
        description:
          "The stage is distant, yet the steeply raked rows provide good views. Positioned right of the stage, some views are restricted. A large safety bar along the section's length affects views from certain seats.",
        quickInfo: [
          { icon: SeatIcon, label: '30 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows H-L',
      },
      'stb-2': {
        blockName: 'Box - Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Box - Left Stalls - STB2',
        description:
          'The box offers excellent views of the stage. While you might miss some views on one side, the comfort, privacy, and unique experience of the box seats are unbeatable.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent, clear views' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
      'stb-1': {
        blockName: 'Box - Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Box - Right Stalls - STB1',
        description:
          'The box offers excellent views of the stage. While you might miss some views on one side, the comfort, privacy, and unique experience of the box seats are unbeatable.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent, clear views' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
      'lg-6-10': {
        blockName: 'Boxes - Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Boxes - Left LG6-10',
        description:
          'The loges offer great views and are very close to the stage. Positioned on the left, you may miss some action on the far left. The comfort and privacy make it an excellent section.',
        quickInfo: [
          { icon: SeatIcon, label: '15 seats' },
          { icon: BinocularIcon, label: 'Best views from LG6' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'lg-1-5': {
        blockName: 'Boxes - Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Boxes - Right - LG1-5',
        description:
          'The loges offer great views and are very close to the stage. Positioned on the right, you may miss some action on the far right. The comfort and privacy make it an excellent section.',
        quickInfo: [
          { icon: SeatIcon, label: '15 seats' },
          { icon: BinocularIcon, label: 'Best views from LG1' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'cb-2': {
        blockName: 'Slips - Front - Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Slips - Front Left - CB2',
        description:
          'This section offers good views of the stage due to its considerable height. While you may miss some views on one side, the movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views; left side slightly restricted',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
      'cb-1': {
        blockName: 'Slips - Front - Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Slips - Front Right - CB1',
        description:
          'This section offers good views of the stage due to its considerable height. While you may miss some views on one side, the movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views; right side slightly restricted',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
      'sb-2': {
        blockName: 'Slips - Rear - Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Slips - Rear Left - SB2',
        description:
          'This section offers good views of the stage due to its considerable height. While you may miss some views on one side, the movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views; left side slightly restricted',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
      'sb-1': {
        blockName: 'Slips - Rear - Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Slips - Rear Right - SB1',
        description:
          'This section offers good views of the stage due to its considerable height. While you may miss some views on one side, the movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views; right side slightly restricted',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
      'gb-2': {
        blockName: 'Slips - Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Slips - Left Grand Circle',
        description:
          'The section offers good views of the stage from its elevated position. While you might miss some views on one side, movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views; left side views restricted',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
      'gb-1': {
        blockName: 'Slips - Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Slips - Right Grand Circle',
        description:
          'The section offers good views of the stage from its elevated position. While you might miss some views on one side, movable seats allow you to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views; right side views restricted',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: '',
      },
    },
    [THEATRE_TYPES.PALACE_THEATRE]: {
      'stalls-front-left': {
        blockName: 'Front left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front left',
        description:
          'Excellent views of the stage where you can see all the details. Best views from middle seats in rows B-G. Avoid seats towards the end of the rows as pillars may obstruct the view. Front row seats require craning.',
        quickInfo: [
          { icon: SeatIcon, label: '163 seats' },
          { icon: BinocularIcon, label: 'Excellent views in Rows D-K' },
          { icon: AccessibilityIcon, label: 'Transfers in aisle seats' },
        ],
        rows: 'Rows AA-K',
      },
      'stalls-front-right': {
        blockName: 'Front right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front right',
        description:
          'Stay close to the action with the best seats in the house. Middle seats in rows B-G provide premium views. Avoid the first couple of rows as the stage is quite high. Seats towards the outer edge may be obstructed by pillars.',
        quickInfo: [
          { icon: SeatIcon, label: '162 seats' },
          { icon: BinocularIcon, label: 'Excellent views in Rows D-K' },
          { icon: AccessibilityIcon, label: 'Transfers in aisle seats' },
        ],
        rows: 'Rows AA-K',
      },
      'stalls-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear left',
        description:
          'Great seats close to the stage at a lower price. Pick aisle seats towards the center in rows N-R for the best view. The Dress Circle overhang begins from row M and may obstruct views from back rows.',
        quickInfo: [
          { icon: SeatIcon, label: '106 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows L-P' },
          { icon: AccessibilityIcon, label: 'Accessible seating in row Q' },
        ],
        rows: 'Rows L-V',
      },
      'stalls-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear right',
        description:
          'Enjoy a great view from seats close to the stage. Rows N-R provide unobstructed views and allow you to appreciate the wide scale. The Dress Circle overhang may restrict the top of the stage starting from row M.',
        quickInfo: [
          { icon: SeatIcon, label: '116 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows L-P' },
          { icon: AccessibilityIcon, label: 'Accessible seating in row V' },
        ],
        rows: 'Rows L-V',
      },
      'stalls-box': {
        blockName: 'Box',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Box',
        description:
          "Close views of the stage from a private space. Though slightly angled, you don't miss any of the action. Move around freely and use the extra space to keep your belongings. The Dress Circle overhang may obstruct the top of the stage.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Private Box',
      },
      'dress-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Right',
        description:
          'Excellent views for appreciating the wider scale of the production. Front row seats towards the aisle provide the best views & legroom. The rake is perfect to enjoy clear views from all seats. Avoid back rows as view may be restricted.',
        quickInfo: [
          { icon: SeatIcon, label: '123 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows A-D' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: Wineries, label: 'Close to the bar' },
        ],
        rows: 'Rows A-J',
      },
      'dress-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Left',
        description:
          "Pick middle or aisle seats in rows A-D. The excellent rake coupled with affordable seats make this section a great choice. The Grand Circle overhang starts obstructing the view from row F although you don't miss much of the action.",
        quickInfo: [
          { icon: SeatIcon, label: '125 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows A-D' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: Wineries, label: 'Close to the bar' },
        ],
        rows: 'Rows A-J',
      },
      'grand-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Right',
        description:
          'Get an elevated view of the stage without being too far from the action. Middle seats in rows A-D provide great value for money. Seats 1-7 in rows A-B have restricted side views. Renting binoculars may be useful to enhance the experience.',
        quickInfo: [
          { icon: SeatIcon, label: '114 seats' },
          { icon: BinocularIcon, label: 'Excellent views from front rows' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-H',
      },
      'grand-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Left',
        description:
          "If you don't mind the height, middle seats in rows A-D offer great views for low prices. End seats in rows A-B offer restricted views due to the side angle and some obstructions. Consider renting binoculars for an enhanced experience.",
        quickInfo: [
          { icon: SeatIcon, label: '114 seats' },
          { icon: BinocularIcon, label: 'Excellent views from front rows' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-H',
      },
      'balcony-front-left': {
        blockName: 'Front left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony - Front left',
        description:
          "Decent views of the stage with minimal obstructions, if you don't mind the height. For the best experience, pick aisle seats and consider renting binoculars for a clearer view of the details.",
        quickInfo: [
          { icon: SeatIcon, label: '19 seats' },
          { icon: BinocularIcon, label: 'Elevated height, clear view' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-C',
      },
      'balcony-front-right': {
        blockName: 'Front right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony - Front right',
        description:
          'For those comfortable with high elevations, aisle seats offer decent views of the stage with minimal obstructions. The side angle does not hamper the experience, although renting binoculars can greatly aide the view.',
        quickInfo: [
          { icon: SeatIcon, label: '18 seats' },
          { icon: BinocularIcon, label: 'Elevated height, clear view' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-C',
      },
      'balcony-center': {
        blockName: 'Center',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony - Center',
        description:
          "Most seats offer a decent, unobstructed view, although the back rows may feel too distant. The high elevation is not ideal for those with vertigo and limited vision. Consider renting binoculars to ensure you don't miss any of the action.",
        quickInfo: [
          { icon: SeatIcon, label: '189 seats' },
          { icon: BinocularIcon, label: 'Best views from rows A-D' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-O',
      },
      'balcony-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony - Rear right',
        description:
          "If you're comfortable with elevated seating, seats in rows E-F offer clear views of the stage. The side angle obstructs part of the stage, binoculars are recommended to enhance the view. Avoid back rows as they may feel too distant.",
        quickInfo: [
          { icon: SeatIcon, label: '56 seats' },
          {
            icon: BinocularIcon,
            label: 'Elevated height, restricted view',
          },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows E-N',
      },
      'balcony-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony - Rear left',
        description:
          'Seats in rows E-F offer the best views from this range as the back rows may feel far from the action. For an enhanced experience, consider renting binoculars. The elevation and side angle are not recommended if you have vertigo or limited vision.',
        quickInfo: [
          { icon: SeatIcon, label: '52 seats' },
          {
            icon: BinocularIcon,
            label: 'Elevated height, restricted view',
          },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows E-O',
      },
    },
    [THEATRE_TYPES.SONDHEIM_THEATRE]: {
      'stalls-front-left': {
        blockName: 'Front Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front left',
        description:
          'Excellent views of the stage, especially from rows A-B. The stage height ensures you stay close to the action without having to crane your neck. End seats have a slightly angled view while rows J-M may be affected by the Dress Circle overhang.',
        quickInfo: [
          { icon: SeatIcon, label: '129 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows D-H' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Rows A-M',
      },
      'stalls-front-right': {
        blockName: 'Front Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front right',
        description:
          'Get up close and personal with the performers. Seats in rows A-D offer excellent views without having to look up. Avoid end-seats in rows J-M as the dress circle overhang may obstruct parts of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '135 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows D-H' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Rows A-M',
      },
      'stalls-rear-left': {
        blockName: 'Rear Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear left',
        description:
          'The dress circle overhang obstructs the top of the stage from most seats although the overall experience is not hampered. For the best experience, pick middle seats in rows N-R.',
        quickInfo: [
          { icon: SeatIcon, label: '101 seats' },
          { icon: BinocularIcon, label: 'Great views from rows N-P' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows N-W',
      },
      'stalls-rear-right': {
        blockName: 'Rear Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear right',
        description:
          "Good views of the stage from most seats, although the back rows may feel cramped. You don't miss any of the action despite the Dress Circle overhang. Middle seats in rows N-R offer the best views in the section.",
        quickInfo: [
          { icon: SeatIcon, label: '112 seats' },
          { icon: BinocularIcon, label: 'Great views from rows N-P' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows N-W',
      },
      'dress-circle-slip-left': {
        blockName: 'Slip left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Slips left',
        description:
          'Close-up views of the stage from a slightly angled view. Great value for money with a clear slightline and comfortable space. You may have to lean forward to see the front of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great views, side angle' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Row AA',
      },
      'dress-circle-slip-right': {
        blockName: 'Slip right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Slips right',
        description:
          "Get a close view of the stage from an optimal distance. Part of the stage is obstructed due to the angle although you can move your chair around for a better position. Great value for money if you don't mind the side view.",
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great views, side angle' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Row AA',
      },
      'dress-circle-front': {
        blockName: 'Front',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Front',
        description:
          "Excellent wide views of the stage - perfect for larger productions. Seats towards the end have a slightly restricted view but you won't miss much of the action. For the best experience, pick middle seats in rows A-C.",
        quickInfo: [
          { icon: SeatIcon, label: '106 seats' },
          {
            icon: BinocularIcon,
            label: 'Brilliant views in all middle seats',
          },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows A-D',
      },
      'dress-circle-rear': {
        blockName: 'Rear',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Center',
        description:
          'Get an elevated view of the stage without feeling too distant. Middle seats in rows E-G offer the best views. Avoid the back rows as the Grand Circle overhang affects the views in rows J-L.',
        quickInfo: [
          { icon: SeatIcon, label: '189 seats' },
          { icon: BinocularIcon, label: 'Great views from rows E-G' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows E-L',
      },
      'dress-circle-box-a': {
        blockName: 'Box A',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Box',
        description:
          'Enjoy the show from your private space with movable chairs and clear views of the performance. The overhang obstructs part of the stage although the overall view is not affected.',
        quickInfo: [
          { icon: SeatIcon, label: '1 seat' },
          { icon: BinocularIcon, label: 'Restricted views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          { icon: RestRoomSvg, label: 'Easy access to toilets' },
        ],
        rows: 'Private box',
      },
      'dress-circle-box-b': {
        blockName: 'Box B',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Box',
        description:
          'Clear views of the stage with minimal obstruction. The overhang obstructs part of the view but the free space ensures you can stand or adjust your seat for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Restricted views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          { icon: RestRoomSvg, label: 'Easy access to toilets' },
        ],
        rows: 'Private box',
      },
      'dress-circle-loge-1': {
        blockName: 'Loge 1',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Loge 1',
        description:
          'Wide view of the stage with clear sightlines. The side angle obstructs part of the stage although you can use the extra space to lean forward for a better view.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Good views, side angle' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
        ],
        rows: 'Row LG2',
      },
      'dress-circle-loge-2': {
        blockName: 'Loge 2',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Loge 2',
        description:
          "Excellent value for money with the elevated views and extra legroom. If you don't mind a slightly angled view, these seats are perfect for a comfortable experience.",
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Good views, side angle' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
        ],
        rows: 'Row LG1',
      },
      'grand-circle-front': {
        blockName: 'Front',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Front',
        description:
          'Elevated views of the stage with minimal obstructions. Seats in rows A-C offer the best experience, although you may have to lean forward to see the top of the stage. End-seats offer great value for money with a slightly angled view.',
        quickInfo: [
          { icon: SeatIcon, label: '209 seats' },
          { icon: BinocularIcon, label: 'Clear views from middle seats' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows AA-G',
      },
      'grand-circle-rear': {
        blockName: 'Rear',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Rear',
        description:
          'Wide view of the stage with some obstructions. You may miss some details from end-seats. Middle seats in rows G-K offer decent views without missing much of the stage. Avoid back rows as the view is obstructed by the overhang and distance.',
        quickInfo: [
          { icon: SeatIcon, label: '103 seats' },
          { icon: BinocularIcon, label: 'Good views from rows H-K' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows H-M',
      },
      'grand-circle-standing': {
        blockName: 'Standing',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Standing',
        description:
          "Enjoy elevated views of the stage with free moving space. Although the view may feel distant, you don't miss much of the action. Consider renting binoculars and ensure you wear comfortable shoes for the evening.",
        quickInfo: [
          { icon: SeatIcon, label: '10 spaces' },
          { icon: BinocularIcon, label: 'Clear elevated views' },
          { icon: WalkingTours, label: 'Standing tickets' },
        ],
        rows: '',
      },
    },
    [THEATRE_TYPES.TROUBADOUR_WEMBLEY_PARK_THEATRE]: {
      'first-class-carriage-1': {
        blockName: 'Carriage 1',
        theatreSectionName: 'First Class',
        theatreSectionLabel: 'First Class - Carriage 1',
        description:
          'Stay close to the action here, with performers gliding right by you. With the circular stage, every seat guarantees a clear view of the stage. Some action may occur behind you, but choosing an aisle seat keeps you close to all the action.',
        quickInfo: [
          { icon: SeatIcon, label: '43 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows BB-DD' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows AA-EE',
      },
      'first-class-carriage-2': {
        blockName: 'Carriage 2',
        theatreSectionName: 'First Class',
        theatreSectionLabel: 'First Class - Carriage 2',
        description:
          'Feel the rush of the show as performers skate close by. The circular setup ensures all seats get clear sightlines, although you may miss parts when the performers move around the back.',
        quickInfo: [
          { icon: SeatIcon, label: '43 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows BB-DD' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows AA-EE',
      },
      'first-class-carriage-3': {
        blockName: 'Carriage 3',
        theatreSectionName: 'First Class',
        theatreSectionLabel: 'First Class - Carriage 3',
        description:
          "Excellent, close-up views of the stage. The circular seating ensures you don't miss any of the details. You may miss parts of the show that are performed behind you. Pick seats near the aisles to stay close to the tracks.",
        quickInfo: [
          { icon: SeatIcon, label: '43 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows BB-DD' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows AA-EE',
      },
      'first-class-carriage-4': {
        blockName: 'Carriage 4',
        theatreSectionName: 'First Class',
        theatreSectionLabel: 'First Class - Carriage 4',
        description:
          'Experience the thrill as performers whiz by inches away. The round arena ensures all seats have clear views of the stage. Aisle seats are ideal to stay close to the race tracks. Some parts require turning around to see the action.',
        quickInfo: [
          { icon: SeatIcon, label: '43 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows BB-DD' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows AA-EE',
      },
      'platform-left': {
        blockName: 'Left',
        theatreSectionName: 'Platform',
        theatreSectionLabel: 'Platform 1',
        description:
          "Excellent views of the stage from an optimal distance. The raised height ensures you don't miss anything on stage, but there are blind spots directly beneath this section. You can lean forward to catch those parts.",
        quickInfo: [
          { icon: SeatIcon, label: '124 seats' },
          { icon: BinocularIcon, label: 'Excellent views from row FF' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-J',
      },
      'platform-right': {
        blockName: 'Right',
        theatreSectionName: 'Platform',
        theatreSectionLabel: 'Platform 2',
        description:
          'Enjoy a clear, elevated view of the stage, offering great visibility of the entire performance. However, a small section of the stage may be obscured due to a blind spot directly beneath it.',
        quickInfo: [
          { icon: SeatIcon, label: '124 seats' },
          { icon: BinocularIcon, label: 'Excellent views from row FF' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-J',
      },
      'trackside-left': {
        blockName: 'Left',
        theatreSectionName: 'Trackside',
        theatreSectionLabel: 'Trackside 1',
        description:
          "These seats provide excellent elevated views, putting you close to the performers as they pass by the front rows. While some action may take place behind you, it won't significantly impact your experience. The steep rake ensures clear visibility from all seats.",
        quickInfo: [
          { icon: SeatIcon, label: '47 seats' },
          { icon: BinocularIcon, label: 'Great views from rows A-C' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows FF-GG',
      },
      'trackside-right': {
        blockName: 'Right',
        theatreSectionName: 'Trackside',
        theatreSectionLabel: 'Trackside 2',
        description:
          'These seats offer excellent elevated views of the stage. The front rows are ideal for seeing performers up close, though you may miss some action at the back. The rake provides clear views across all seats.',
        quickInfo: [
          { icon: SeatIcon, label: '47 seats' },
          { icon: BinocularIcon, label: 'Great views from rows A-C' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows FF-GG',
      },
      'locomotive-left': {
        blockName: 'Left',
        theatreSectionName: 'Locomotive',
        theatreSectionLabel: 'Locomotive - Left',
        description:
          'These seats provide great views from a comfortable elevation. The side angle doesn’t affect your view, ensuring you catch all the action. The rake allows you to enjoy the full scale of the production without compromising on the details.',
        quickInfo: [
          { icon: SeatIcon, label: '108 seats' },
          { icon: BinocularIcon, label: 'Great views from rows K-Q' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows K-W',
      },
      'locomotive-center': {
        blockName: 'Center',
        theatreSectionName: 'Locomotive',
        theatreSectionLabel: 'Locomotive - Center',
        description:
          'These seats offer excellent, central views from an elevated angle, allowing you to fully appreciate the scale of the production. The steep rake ensures clear sightlines, even with people seated in front. Seats towards the back provide great value without compromising the view.',
        quickInfo: [
          { icon: SeatIcon, label: '294 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows K-M' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows K-W',
      },
      'locomotive-right': {
        blockName: 'Right',
        theatreSectionName: 'Locomotive',
        theatreSectionLabel: 'Locomotive - Right',
        description:
          'Enjoy clear, unobstructed views from an elevated height. The lateral angle adds to the experience, ensuring you see every moment. The gradual incline provides a broad view, even from the back rows.',
        quickInfo: [
          { icon: SeatIcon, label: '108 seats' },
          { icon: BinocularIcon, label: 'Great views from rows K-Q' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows K-W',
      },
    },
    [THEATRE_TYPES.PRINCE_OF_WALES_THEATRE]: {
      'stalls-front': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front',
        description:
          'This section is closest to the stage and guarantees excellent views from nearly all seats. The front row might be too close for some as it requires craning. For the best experience, pick middle seats in rows C-E and aisle seats for more legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '215 seats' },
          { icon: BinocularIcon, label: 'Excellent views from all seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: ArtBoardSvg,
            label: 'Step free access - bar & toilets',
          },
        ],
        rows: 'Rows A-G',
      },
      'stalls-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear left',
        description:
          'Enjoy an unobstructed view of the stage from most seats at a comparatively lower price. The rake is low, which may obstruct the views from back rows. Pick aisle seats in rows J-K for better legroom and clear views.',
        quickInfo: [
          { icon: SeatIcon, label: '95 seats' },
          { icon: BinocularIcon, label: 'Best views: rows J-L aisle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: ArtBoardSvg,
            label: 'Step free access - bar & toilets',
          },
        ],
        rows: 'Rows J-T',
      },
      'stalls-rear-center': {
        blockName: 'Rear center',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear center',
        description:
          'Great views of the stage from an optimal distance. Take in a wider view without missing on the details. Back rows starting from M face minimal obstruction due to the Circle overhang. For the clearest views, pick middle seats in rows H-K.',
        quickInfo: [
          { icon: SeatIcon, label: '151 seats' },
          { icon: BinocularIcon, label: 'Best views in rows H-L' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: ArtBoardSvg,
            label: 'Step free access - bar & toilets',
          },
        ],
        rows: 'Rows H-U',
      },
      'stalls-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear right',
        description:
          "If you don't mind minimal obstructions, seats in this section offer great value for money. The view is largely clear, although back rows may be affected by the Circle overhang. Aisle seats in rows J-K offer the best views.",
        quickInfo: [
          { icon: SeatIcon, label: '105 seats' },
          { icon: BinocularIcon, label: 'Best views: rows J-L aisle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: ArtBoardSvg,
            label: 'Step free access - bar & toilets',
          },
        ],
        rows: 'Rows J-U',
      },
      'circle-loge-3': {
        blockName: 'Loge 3',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Loge 3',
        description:
          'All seats offer great views close to the stage even with a side angle. Ideal for small groups with free movement, comfortable seats, and a private space.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent views, side angle' },
          { icon: LegRoomSvg, label: 'Great legroom, movable chairs' },
        ],
        rows: 'LG3',
      },
      'circle-loge-4': {
        blockName: 'Loge 4',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Loge 4',
        description:
          "Best location in the theatre if you're looking for a private space with a clear, elevated view of the stage. Greater legroom, comfortable chairs, and a private space ensure you don't miss any of the action.",
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Great views, side angle' },
          { icon: LegRoomSvg, label: 'Great legroom, movable chairs' },
        ],
        rows: 'LG4',
      },
      'circle-loge-1': {
        blockName: 'Loge 1',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Loge 1',
        description:
          'Enjoy wide views of the stage while staying close to the action. The side angle does not hamper the view, especially with movable chairs that can be rearranged to find the optimal sightline.',
        quickInfo: [
          { icon: SeatIcon, label: '5 seats' },
          { icon: BinocularIcon, label: 'Excellent views, side angle' },
          { icon: LegRoomSvg, label: 'Great legroom, movable chairs' },
        ],
        rows: 'LG1',
      },
      'circle-loge-2': {
        blockName: 'Loge 2',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Loge 2',
        description:
          "Excellent value for money seats with elevated views of the stage. The side angle does not affect the experience if you don't mind leaning forward for some parts of the show. Enjoy a private experience with free roaming space and comfortable chairs.",
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great views, side angle' },
          { icon: LegRoomSvg, label: 'Great legroom, movable chairs' },
        ],
        rows: 'LG2',
      },
      'circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Left',
        description:
          "This section is the perfect choice if you prefer a panoramic view and don't mind a slightly angled sightline. Aisle seats in rows A-C offer excellent views of the stage from an elevated height. The good rake ensures you don't miss any detail even from the back rows.",
        quickInfo: [
          { icon: SeatIcon, label: '114 seats' },
          { icon: BinocularIcon, label: 'Great views from rows A-D' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ArtBoardSvg, label: 'Step free access to toilets' },
        ],
        rows: 'Rows A-L',
      },
      'circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Center',
        description:
          'If you prefer a wider view without being too far from the action, these seats offer the perfect views for a decent price. The rake allows unobstructed views even from back rows. For the best experience, pick middle seat in rows A-C.',
        quickInfo: [
          { icon: SeatIcon, label: '228 seats' },
          { icon: BinocularIcon, label: 'Best views from rows A-C' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ArtBoardSvg, label: 'Step free access to toilets' },
        ],
        rows: 'Rows A-L',
      },
      'circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Right',
        description:
          "Enjoy unobstructed views of the stage from all seats even from the sides. Aisle seats in rows A-C offer the best views with greater legroom. Considering the compact layout, even the back rows don't feel too far from the action.",
        quickInfo: [
          { icon: SeatIcon, label: '111 seats' },
          { icon: BinocularIcon, label: 'Great views from rows A-D' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ArtBoardSvg, label: 'Step free access to toilets' },
        ],
        rows: 'Rows A-L',
      },
    },
    [THEATRE_TYPES.DOMINION_THEATRE]: {
      'stalls-front-far-left': {
        blockName: 'Front far-left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front far-left',
        description:
          "Great views of the stage from up close. The side angle does not hamper the overall experience as you don't miss much of the stage. Seats towards the edge may be slightly obstructed due to equipment. Close to the exit.",
        quickInfo: [
          { icon: SeatIcon, label: '114 seats' },
          { icon: BinocularIcon, label: 'Excellent views in aisle seats' },
          { icon: LegRoomSvg, label: 'Great legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Accessible seats: rows YY-ZZ',
          },
        ],
        rows: 'Rows A-N',
      },
      'stalls-front-left': {
        blockName: 'Front left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front left',
        description:
          'Excellent, unobstructed views of the stage from most seats. The close proximity ensures brilliant acoustics. Middle rows D-J are at the optimal distance to appreciate a wider view without missing on details. Front rows A-B require craning.',
        quickInfo: [
          { icon: SeatIcon, label: '141 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows C-G' },
          { icon: LegRoomSvg, label: 'Great legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows A-N',
      },
      'stalls-front-right': {
        blockName: 'Front right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front right',
        description:
          'Closest to the stage with excellent unobstructed views and brilliant acoustics. Avoid the front rows as they may require you to look up towards the high stage. Seats in the middle rows D-J are best to catch a wide view without missing on details.',
        quickInfo: [
          { icon: SeatIcon, label: '140 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows C-G' },
          { icon: LegRoomSvg, label: 'Great legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows A-N',
      },
      'stalls-front-far-right': {
        blockName: 'Front far-right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front far-right',
        description:
          'Great views, closest to the stage with a decent rake starting from row F. Although these seats are further to the side, you can enjoy uninterrupted views of the stage even from edge seats. Direct access to toilets and exit.',
        quickInfo: [
          { icon: SeatIcon, label: '114 seats' },
          { icon: BinocularIcon, label: 'Excellent views in aisle seats' },
          { icon: LegRoomSvg, label: 'Great legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows A-N',
      },
      'stalls-rear-far-left': {
        blockName: 'Rear far-left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear far-left',
        description:
          'Enjoy a wide view of the stage from a comfortable distance. The side angle does not hamper the experience. You may miss parts of the action from back rows as the Circle overhang obstructs the top of the stage from row T. Rows X-ZZ may feel very far.',
        quickInfo: [
          { icon: SeatIcon, label: '201 seats' },
          { icon: BinocularIcon, label: 'Best views in rows O-S' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows O-ZZ',
      },
      'stalls-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear left',
        description:
          "Great, unobstructed views of the stage from a comfortable distance. The circle overhang restricts part of the view from row T. Although back rows may feel far, you don't miss any of the action. Consider renting binoculars to catch the details.",
        quickInfo: [
          { icon: SeatIcon, label: '195 seats' },
          {
            icon: BinocularIcon,
            label: 'Best views: middle seats row O-U',
          },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows O-XX',
      },
      'stalls-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear right',
        description:
          'Enjoy clear views of the stage from a comfortable distance. Views from the back rows are obstructed due to the distance and Circle overhang. For the best experience, pick seats towards the left aisle. Renting binoculars can aide the experience.',
        quickInfo: [
          { icon: SeatIcon, label: '219 seats' },
          { icon: BinocularIcon, label: 'Best views: middle seats row O-U' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows O-ZZ',
      },
      'stalls-rear-far-right': {
        blockName: 'Rear Far-right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear Far-right',
        description:
          'Wide view of the stage from a comfortable distance. Although slightly angled, a decent rake ensures you get great views from aisle seats in rows O-S. The circle overhang affects the views starting from row T.',
        quickInfo: [
          { icon: SeatIcon, label: '198 seats' },
          { icon: BinocularIcon, label: 'Best views in rows O-S' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: AccessibilityIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows O-ZZ',
      },
      'circle-front-far-left': {
        blockName: 'Front far-left',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Front far-left',
        description:
          'Wide view of the stage, not too far from the action. The elevation is perfect to enjoy large productions. You may have to lean forward from front rows as a safety rail partially blocks the view. The side angle does not hamper the experience.',
        quickInfo: [
          { icon: SeatIcon, label: '83 seats' },
          { icon: BinocularIcon, label: 'Best views in aisle seats' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows A-G',
      },
      'circle-front-left': {
        blockName: 'Front left',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Front left',
        description:
          'Excellent, unobstructed sightlines so you can appreciate a panoramic view without missing on details. The seats have space to accommodate small bags. You may miss the front of the stage from rows A-B but you can lean forward in your seat.',
        quickInfo: [
          { icon: SeatIcon, label: '91 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows A-D' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows A-G',
      },
      'circle-front-right': {
        blockName: 'Front right',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Front right',
        description:
          'Excellent views of the stage where you can enjoy a panoramic view without missing many details. Most seats offer clear views without any obstructions. You may have to lean forward from rows A-B as the front of the stage is slightly hidden.',
        quickInfo: [
          { icon: SeatIcon, label: '91 seats' },
          { icon: BinocularIcon, label: 'Excellent views in rows A-D' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows A-G',
      },
      'circle-front-far-right': {
        blockName: 'Front far-right',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Front far-right',
        description:
          'Get a wide view of the stage while staying close to the action. The elevation is ideal for large productions. While the angle is to the side, the experience is not hampered. A safety rail slightly obstructs the view from the front rows.',
        quickInfo: [
          { icon: SeatIcon, label: '83 seats' },
          { icon: BinocularIcon, label: 'Best views in aisle seats' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows A-G',
      },
      'circle-rear-far-left': {
        blockName: 'Rear far-left',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Rear far-left',
        description:
          'Panoramic views of the stage from a distance. Although the position is to the side, a decent rake and comfortable elevation ensure unobstructed views from all seats. Seats towards the back may feel far from the action.',
        quickInfo: [
          { icon: SeatIcon, label: '62 seats' },
          { icon: BinocularIcon, label: 'Best views: aisle seats row H-M' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows H-Q',
      },
      'circle-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Rear left',
        description:
          'Excellent wide view of the stage from a distance. A safety rail obstructs the view from rows H-J, but you may lean forward for a clear sightline. The elevation is perfect to ensure unobstructed views without causing discomfort.',
        quickInfo: [
          { icon: SeatIcon, label: '98 seats' },
          { icon: BinocularIcon, label: 'Best views in middle seats' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
          { icon: RestRoomSvg, label: 'Close to the toilets' },
        ],
        rows: 'Rows H-Q',
      },
      'circle-rear-center': {
        blockName: 'Rear center',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Rear center',
        description:
          'Enjoy excellent elevated views of the stage. The stage may feel far from back rows, although renting binoculars can enhance the experience. A decent rake ensures great views from all seats. The comfortable elevation make this section a great choice for large productions.',
        quickInfo: [
          { icon: SeatIcon, label: '102 seats' },
          { icon: BinocularIcon, label: 'Great views in rows J-M' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows H-Q',
      },
      'circle-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Rear right',
        description:
          'Excellent panoramic views of the stage from a distance. You may have to lean forward from rows H-J as a safety rail obstructs part of the view. The elevation is ideal to provide unobstructed sightlines from all seats without causing discomfort.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Best views in middle seats' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
          { icon: RestRoomSvg, label: 'Close to the toilets' },
        ],
        rows: 'Rows H-Q',
      },
      'circle-rear-far-right': {
        blockName: 'Rear far-right',
        theatreSectionName: 'Circle',
        theatreSectionLabel: 'Circle - Rear far-right',
        description:
          'Wide views of the stage from a distance. The side angle does not hamper the experience as the view is largely unobstructed. Seats towards the back may feel high and farther away from the action. If you prefer to catch all the details, consider renting binoculars.',
        quickInfo: [
          { icon: SeatIcon, label: '62 seats' },
          { icon: BinocularIcon, label: 'Best views: aisle seats row H-M' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows H-Q',
      },
    },
    [THEATRE_TYPES.ADELPHI_THEATRE]: {
      'stalls-front': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front',
        description:
          'Excellent views close to the stage. Expect loud sounds in the front rows (McFly Zone), especially row A. Seats in the middle offer the best views. Front rows may require craning as the stage is elevated. The good rake makes for clear views even from the back rows.',
        quickInfo: [
          { icon: SeatIcon, label: '259 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows E-K' },
          { icon: LegRoomSvg, label: 'Great legroom' },
          {
            icon: WheelChairIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows A-J',
      },
      'stalls-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear left',
        description:
          'Great view of the stage from most seats. Pick aisle seats for a central position. The Circle overhang begins affecting views from row P. Views from the back rows may be restricted if preceding rows are occupied.',
        quickInfo: [
          { icon: SeatIcon, label: '188 seats' },
          { icon: BinocularIcon, label: 'Great views from rows L-O' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: WheelChairIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows K-X',
      },
      'stalls-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear right',
        description:
          'Great view of the stage from a comfortable distance. Aisle seats offer a central sightline. Part of the stage is obstructed due to the Circle overhang, starting from row P. Back rows may feel fat and restricted if preceding rows are occupied.',
        quickInfo: [
          { icon: SeatIcon, label: '181 seats' },
          { icon: BinocularIcon, label: 'Great views from rows L-O' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: WheelChairIcon, label: 'Accessible seats in row X' },
        ],
        rows: 'Rows K-X',
      },
      'dress-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Left',
        description:
          'Enjoy excellent views from aisle seats to the right. Seats towards the edge offer a slightly angled view, although the experience is not hindered. Upper Circle overhang begins from row G, but the views are largely unaffected.',
        quickInfo: [
          { icon: SeatIcon, label: '212 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows A-E' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows A-P',
      },
      'dress-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Right',
        description:
          'Excellent views of the stage from an optimal distance, especially from aisle seats to the left. Rows at the back are obstructed by the Upper Circle overhang, although the sightline is uninterrupted. Seats towards the ends have a clear angled view.',
        quickInfo: [
          { icon: SeatIcon, label: '221 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows A-E' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows A-P',
      },
      'upper-circle-front': {
        blockName: 'Front',
        theatreSectionName: 'Upper Circle',
        theatreSectionLabel: 'Upper Circle - Front',
        description:
          'Great view of the stage from an elevation. This section offers a wide view of the stage best suited for large productions. Middle seats in rows A-D offer excellent, unobstructed views. Seats to the side offer a better angle to see the stagefront.',
        quickInfo: [
          { icon: SeatIcon, label: '258 seats' },
          { icon: BinocularIcon, label: 'Best views from middle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows A-H',
      },
      'upper-circle-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Upper Circle',
        theatreSectionLabel: 'Upper Circle - Rear left',
        description:
          'Good views of the stage from an elevated height. Aisle seats in front rows offer the best views at lower prices The side angle does not hinder the experience as the sightline is mostly clear. You may have to lean forward for some parts.',
        quickInfo: [
          { icon: SeatIcon, label: '62 seats' },
          { icon: BinocularIcon, label: 'Good views from aisle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows J-O',
      },
      'upper-circle-rear-center': {
        blockName: 'Rear center',
        theatreSectionName: 'Upper Circle',
        theatreSectionLabel: 'Upper Circle - Rear center',
        description:
          'Elevated views of the stage from a distance. A good rake ensures clear sightlines from all seats, although you may have to lean forward to see the stagefront. Middle seats offer the best view at comparatively low prices. Back rows may be cramped.',
        quickInfo: [
          { icon: SeatIcon, label: '43 seats' },
          { icon: BinocularIcon, label: 'Good views from middle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows K-N',
      },
      'upper-circle-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Upper Circle',
        theatreSectionLabel: 'Upper Circle - Rear right',
        description:
          "Enjoy a clear view of the stage from an elevated height, especially from front rows. The distance or side angle don't obstruct the views as much of the stage is still visible. You may have to lean forward for some parts. Back rows may be cramped.",
        quickInfo: [
          { icon: SeatIcon, label: '42 seats' },
          { icon: BinocularIcon, label: 'Good views from aisle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows J-O',
      },
    },
    [THEATRE_TYPES.ALDWYCH_THEATRE]: {
      'stalls-front': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front',
        description:
          'Stay close to the action with seats directly in front of the stage. Central seats in rows B-D offer the best views, while back rows offer a wider perspective. Seats near the ends have a slightly angled view, although the experience is not hindered.',
        quickInfo: [
          { icon: SeatIcon, label: '197 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows A-E' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows AY-H',
      },
      'stalls-rear-left': {
        blockName: 'Rear left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear left',
        description:
          "Slightly angled view of the stage from an optimal distance. Seats towards the left in the front rows provide unobstructed views so you don't miss any of the action. The Dress Circle overhang and low rake affect views from back rows.",
        quickInfo: [
          { icon: SeatIcon, label: '78 seats' },
          { icon: BinocularIcon, label: 'Best views from rows J-L' },
          { icon: LegRoomSvg, label: 'Comfortable legroom' },
          { icon: CloseToExitIcon, label: 'Close to the exit' },
        ],
        rows: 'Rows J-Z',
      },
      'stalls-rear-center': {
        blockName: 'Rear center',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear center',
        description:
          'Enjoy a comfortably distant view of the stage from central seats. The Dress Circle overhang obstructs the top of the stage starting from row M while the low rake may affect views from back rows. Pick aisle seats for better legroom with a decent view.',
        quickInfo: [
          { icon: SeatIcon, label: '200 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows HH-L' },
          { icon: LegRoomSvg, label: 'Comfortable legroom' },
        ],
        rows: 'Rows HH-Y',
      },
      'stalls-rear-right': {
        blockName: 'Rear right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear right',
        description:
          'Front rows provide a wide, slightly angled view of the stage with unobstructed sightlines. Back rows starting from row M have restricted views due to the Dress Circle overhang and a low rake. Seats towards the edge may feel cramped.',
        quickInfo: [
          { icon: SeatIcon, label: '75 seats' },
          { icon: BinocularIcon, label: 'Best views from rows J-L' },
          { icon: LegRoomSvg, label: 'Comfortable legroom' },
          { icon: CloseToExitIcon, label: 'Close to the exit' },
        ],
        rows: 'Rows J-Y',
      },
      'dress-circle-box-e': {
        blockName: 'Box E',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Box E',
        description:
          'Excellent views of the production from an elevated height. Although positioned to the side, you can move your seat around the private box to find the perfect viewing angle. These seats are often available at lower prices and offer great value.',
        quickInfo: [
          { icon: SeatIcon, label: '5 seats' },
          { icon: BinocularIcon, label: 'Clear side-on views' },
          { icon: WalkingTours, label: 'Free-roam space' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Private box',
      },
      'dress-circle-slips-left': {
        blockName: 'Slips left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Slips left',
        description:
          "If you don't mind leaning forward for some parts of the show, the seats offer an unobstructed view of the stage. With a private space and elevated angle, this section offers great value for a lower price.",
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Angled view, close to the stage' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Row A',
      },
      'dress-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Center',
        description:
          "Excellent view of the full production. The optimal distance and good rake ensure you get a wide view of the stage with minimal obstructions. Back rows starting from row H are affected by the Grand Circle overhang, although you don't miss much of the action.",
        quickInfo: [
          { icon: SeatIcon, label: '313 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows B-F' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows A-M',
      },
      'dress-circle-slips-right': {
        blockName: 'Slips right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Slips right',
        description:
          "Enjoy uninterrupted views from a great angle. Although the seats are positioned to the side, you can lean forward for a clear view of the stage. If you don't mind the elevated height, the seats offer great value for a lower price.",
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Angled view, close to the stage' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Row A',
      },
      'dress-circle-box-b': {
        blockName: 'Box B',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Box B',
        description:
          "Great, unobstructed views of the stage from an optimal distance. Although the view is slightly angled, the movable seats and elevated height ensure you don't miss any of the action. Great for enjoying a private experience in small groups.",
        quickInfo: [
          { icon: SeatIcon, label: '5 seats' },
          { icon: BinocularIcon, label: 'Clear side-on views' },
          { icon: WalkingTours, label: 'Free-roam space' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Private box',
      },
      'grand-circle-slips-left': {
        blockName: 'Slips left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Slips left',
        description:
          'Due to the slightly angled position, these seats are often available for low prices and offer great views. You may have to lean forward for some parts, although the experience is not hindered. The private space also offers enough space to move around.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Clear elevated views' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Row AA',
      },
      'grand-circle-slips-right': {
        blockName: 'Slips right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Slips right',
        description:
          "Get a panoramic view of the stage from an elevated height. You may have to lean forward for a clear sightline. The side angle doesn't affect the views as you can shift the seat for a better viewing angle. Best for a private experience in small groups.",
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Clear elevated views' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Row AA',
      },
      'grand-circle-front': {
        blockName: 'Front',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Front',
        description:
          "If you don't mind the high elevation, seats in this section offer a great view of the stage with no obstructions. You may have to lean forward to see the front of the stage from row A. We recommend renting binoculars to catch the details.",
        quickInfo: [
          { icon: SeatIcon, label: '78 seats' },
          { icon: BinocularIcon, label: 'Excellent elevated views' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-C',
      },
      'grand-circle-rear': {
        blockName: 'Rear',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Rear',
        description:
          'Enjoy elevated views of the stage from a distance. The high rake ensures clear views from nearly all seats. Back rows are not ideal for people with vertigo or limited mobility. Consider renting binoculars for an enhanced experience.',
        quickInfo: [
          { icon: SeatIcon, label: '194 seats' },
          { icon: BinocularIcon, label: 'Great views from rows D-F' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows D-L',
      },
    },
    [THEATRE_TYPES.ROYAL_ALBERT_HALL]: {
      'ringside-east-a': {
        blockName: 'A',
        theatreSectionName: 'Ringside East',
        theatreSectionLabel: 'Ringside - East left',
        description:
          'Closest seats to the stage, right below the performance area. Enjoy an intimate experience as performers often interact with audience members in this section. Front rows may require craning for elevated acts.',
        quickInfo: [
          { icon: SeatIcon, label: '175 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows B-D' },
        ],
        rows: 'Rows A - J',
      },
      'ringside-east-b': {
        blockName: 'B',
        theatreSectionName: 'Ringside East',
        theatreSectionLabel: 'Ringside - East right',
        description:
          'Experience the act up close with a chance to interact with the performers. The section offers premium views of the performance from right below the stage. May require craning for aerial stunts.',
        quickInfo: [
          { icon: SeatIcon, label: '175 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows B-D' },
        ],
        rows: 'Rows A - J',
      },
      'stalls-g': {
        blockName: 'G',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - East left',
        description:
          'Flexible swivel seats allow you to move around and follow the action as the act progresses. Best views in the house at an elevated height with close proximity to the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '110 seats' },
          { icon: BinocularIcon, label: 'Excellent views from all seats' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: SwivelSeatsIcon, label: 'Swivel seats' },
        ],
        rows: 'Rows 1 - 4',
      },
      'stalls-h': {
        blockName: 'H',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - East center',
        description:
          'Get the best of everything with these premium-view seats close to the stage. Enjoy every detail of the show from the elevated height and follow along with the swivel seats.',
        quickInfo: [
          { icon: SeatIcon, label: '109 seats' },
          { icon: BinocularIcon, label: 'Excellent views from all seats' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: SwivelSeatsIcon, label: 'Swivel seats' },
        ],
        rows: 'Rows 1 - 4',
      },
      'stalls-j': {
        blockName: 'J',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - East right',
        description:
          'The swivel seats allow you to stay close to the action even with a slightly angled view. Raked seats have an elevated height that is great for large-scale productions.',
        quickInfo: [
          { icon: SeatIcon, label: '36 seats' },
          { icon: BinocularIcon, label: 'Great views, slightly angled' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: SwivelSeatsIcon, label: 'Swivel seats' },
        ],
        rows: 'Rows 1 - 4',
      },
      'ringside-west-c': {
        blockName: 'C',
        theatreSectionName: 'Ringside West',
        theatreSectionLabel: 'Ringside - West left',
        description:
          'Front-row seats where you can enjoy a close view and potential performer interaction. Aerial or high-wire acts may require craning. Comfortable seats with premium pricing.',
        quickInfo: [
          { icon: SeatIcon, label: '174 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows B-D' },
        ],
        rows: 'Rows A - J',
      },
      'ringside-west-d': {
        blockName: 'D',
        theatreSectionName: 'Ringside West',
        theatreSectionLabel: 'Ringside - West right',
        description:
          'Experience performances up close with premium stage-level views. You may have to occassionally glance upwards during large-scale productions.',
        quickInfo: [
          { icon: SeatIcon, label: '174 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows B-D' },
        ],
        rows: 'Rows A - J',
      },
      'stalls-o': {
        blockName: 'O',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - West right',
        description:
          'Versatile swivel seating enables optimal viewing angles throughout the show. Raked height and close proximity to the stage allow amazing views from all rows.',
        quickInfo: [
          { icon: SeatIcon, label: '110 seats' },
          { icon: BinocularIcon, label: 'Excellent views from all seats' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: SwivelSeatsIcon, label: 'Swivel seats' },
        ],
        rows: 'Rows 1 - 4',
      },
      'stalls-m': {
        blockName: 'M',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - West center',
        description:
          'Premium views of the stage allow you to enjoy a wide view from an optimal distance. Track the full performance with special swivel seats. Comfortably close to the action.',
        quickInfo: [
          { icon: SeatIcon, label: '111 seats' },
          { icon: BinocularIcon, label: 'Excellent views from all seats' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: SwivelSeatsIcon, label: 'Swivel seats' },
        ],
        rows: 'Rows 1 - 4',
      },
      'stalls-l': {
        blockName: 'L',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - West left',
        description:
          'Clear views of the stage for a comparatively lower price. Enjoy the full production from an optimal distance. The side angle can be mitigated as you rotate to a comfortable eyeline with the swivel seats.',
        quickInfo: [
          { icon: SeatIcon, label: '38 seats' },
          { icon: BinocularIcon, label: 'Great views, slightly angled' },
          { icon: LegRoomSvg, label: 'Spacious legroom' },
          { icon: SwivelSeatsIcon, label: 'Swivel seats' },
        ],
        rows: 'Rows 1 - 4',
      },
      'loggia-east': {
        blockName: 'LOG East',
        theatreSectionName: 'Loggia',
        theatreSectionLabel: 'Loggia - East',
        description:
          'Best for a comfortable and flexible experience. Great views of the stage from most angles. Some boxes may have restricted views due to pillars.',
        quickInfo: [
          { icon: SeatIcon, label: '104 seats' },
          { icon: BinocularIcon, label: 'Great views, some restricted' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: CouchSvg, label: 'Plush chairs' },
        ],
        rows: 'Boxes 02 - 14',
      },
      'loggia-center': {
        blockName: 'LOG Center',
        theatreSectionName: 'Loggia',
        theatreSectionLabel: 'Loggia - Center',
        description:
          'Book the full box or pick a single seat for an unbeatable private viewing experience. Great for groups and offers excellent unobstructed views from all seats. You may have to compromise on legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '32 seats' },
          { icon: BinocularIcon, label: 'Unobstructed central views' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: CouchSvg, label: 'Plush chairs' },
        ],
        rows: 'Boxes 23 - 26',
      },
      'loggia-west': {
        blockName: 'LOG West',
        theatreSectionName: 'Loggia',
        theatreSectionLabel: 'Loggia - West',
        description:
          'For a private experience, choose seats in the Loggia boxes. From an elevated height, the seats offer a great view but you may have to compromise on legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '112 seats' },
          { icon: BinocularIcon, label: 'Great views, some restricted' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: CouchSvg, label: 'Plush chairs' },
        ],
        rows: 'Boxes 27 - 40',
      },
      'grand-tier-east': {
        blockName: 'East',
        theatreSectionName: 'Grand tier',
        theatreSectionLabel: 'Grand tier - East',
        description:
          'Great view of the stage from a slightly tilted angle. Excellent for large productions. Groups can enjoy a private viewing experience with free roaming space.',
        quickInfo: [
          { icon: SeatIcon, label: '168 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: Wineries, label: 'Easy access to bar' },
        ],
        rows: 'Boxes 03 - 16',
      },
      'grand-tier-west': {
        blockName: 'West',
        theatreSectionName: 'Grand tier',
        theatreSectionLabel: 'Grand tier - West',
        description:
          'Enjoy a private viewing experience with great views for reasonable prices. The tilted angle does not affect the wide view of the stage. Excellent for large productions.',
        quickInfo: [
          { icon: SeatIcon, label: '156 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: Wineries, label: 'Easy access to bar' },
        ],
        rows: 'Boxes 29 - 41',
      },
      'second-tier-east': {
        blockName: 'East',
        theatreSectionName: '2nd tier',
        theatreSectionLabel: '2nd tier - East',
        description:
          'Unobstructed view of the full action with flexible seating. Comfortable seating and great acoustics. Boxes towards the end may be less favorable due to the side angle.',
        quickInfo: [
          { icon: SeatIcon, label: '173 seats' },
          { icon: BinocularIcon, label: 'Panoramic views' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Boxes 07 - 37',
      },
      'second-tier-west': {
        blockName: 'West',
        theatreSectionName: '2nd tier',
        theatreSectionLabel: '2nd tier - West',
        description:
          'Keep up with the full scale of the production with unobstructed views and great acoustics. Enjoy the comfortable and flexible seating in the intimate 5 to 8 seater boxes.',
        quickInfo: [
          { icon: SeatIcon, label: '160 seats' },
          { icon: BinocularIcon, label: 'Panoramic views' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Boxes 55 - 84',
      },
      'rausing-circle-p': {
        blockName: 'P',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - East P',
        description:
          'Rows 2-5 offer good views at lower prices. Great seats to enjoy large scale productions although you may compromise on legroom. Some seats may have limited views due to handrails.',
        quickInfo: [
          { icon: SeatIcon, label: '107 seats' },
          { icon: BinocularIcon, label: 'Best views from rows 1-3' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows 1 - 7',
      },
      'rausing-circle-q': {
        blockName: 'Q',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - East Q',
        description:
          'The front rows give an angled and restricted view of the stage. The raked seats higher up ensure unobstructed views even from back rows. Seats in the back may feel far from the action.',
        quickInfo: [
          { icon: SeatIcon, label: '131 seats' },
          { icon: BinocularIcon, label: 'Best views from rows 1-3' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows 1 - 7',
      },
      'rausing-circle-r': {
        blockName: 'R',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - East R',
        description:
          'Experience large productions from high up with amazing acoustics and decent legroom. The elevation may be too high for some although the seats are comfortable.',
        quickInfo: [
          { icon: SeatIcon, label: '189 seats' },
          { icon: BinocularIcon, label: 'Best views from rows 1-3' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
          { icon: LegRoomSvg, label: 'Limited legroom.' },
        ],
        rows: 'Rows 1 - 7',
      },
      'rausing-circle-s': {
        blockName: 'S',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - East S',
        description:
          'Seats towards the edge are close to the center and offer great views for lower prices. Rows 2-3 are best for a wide view of the action. Pick seats in the aisles for better legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '141 seats' },
          { icon: BinocularIcon, label: 'Great aerial views' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
          { icon: RestRoomSvg, label: 'Easy access to washrooms' },
        ],
        rows: 'Rows 1 - 7',
      },
      'rausing-circle-y': {
        blockName: 'Y',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - West Y',
        description:
          'Comfortable seats with a good rake that ensures unobstructed sightlines. Front rows offer good views even with a slightly tilted angle.',
        quickInfo: [
          { icon: SeatIcon, label: '121 seats' },
          { icon: BinocularIcon, label: 'Best views from rows 1-3' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
          { icon: LegRoomSvg, label: 'Limited legroom.' },
        ],
        rows: 'Rows 1 - 7',
      },
      'rausing-circle-x': {
        blockName: 'X',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - West X',
        description:
          'Good view of the stage from a side angle, especially for large-scale productions. The comfortable seat and decent sightline are well worth the low price tag.',
        quickInfo: [
          { icon: SeatIcon, label: '155 seats' },
          { icon: BinocularIcon, label: 'Best views from rows 1-3' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows 1 - 7',
      },
      'rausing-circle-w': {
        blockName: 'W',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - West W',
        description:
          'Front rows and a good rake make for unobstructed sightlines. You may have to lean in to take in the details. Some seats may have limited views due to handrails. Pick aisle seats for better legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '157 seats' },
          { icon: BinocularIcon, label: 'Best views from rows 1-3' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows 1 - 7',
      },
      'rausing-circle-v': {
        blockName: 'V',
        theatreSectionName: 'Rausing circle',
        theatreSectionLabel: 'Rausing circle - West V',
        description:
          'Nearly central view of the action from an elevated height. Great acoustics and unobstructed views make it a great deal for the price. Seats are arranged in a tight space, but offer good legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '145 seats' },
          { icon: BinocularIcon, label: 'Great aerial views' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows 1 - 7',
      },
    },
    [THEATRE_TYPES.APOLLO_THEATRE]: {
      'stalls-front': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Front',
        description:
          'Get excellent views of the stage & stay close to the action. Front rows may require craning as the stage is high. Middle seats in rows E-N offer clear views at an optimal distance. The Dress Circle overhang begins from row N, although views are unaffected.',
        quickInfo: [
          { icon: SeatIcon, label: '316 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows E-N' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: WheelChairIcon, label: 'Accessible seats in row Q' },
        ],
        rows: 'Rows A-R',
      },
      'stalls-rear': {
        blockName: 'Rear',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Rear',
        description:
          'Great views of the stage. A good rake ensures you feel close to the action despite the distance. The Dress Circle overhang slightly obstructs the top of the stage although the view is still clear. There is no room for movement as the seats are accessible only from the aisle.',
        quickInfo: [
          { icon: SeatIcon, label: '43 seats' },
          { icon: BinocularIcon, label: 'Great views from middle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          {
            icon: WheelChairIcon,
            label: 'Transfers available: aisle seats',
          },
        ],
        rows: 'Rows T-X',
      },
      'stalls-box-b': {
        blockName: 'Box B',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Box B',
        description:
          'Unobstructed views close to the stage. Although the position is slightly angled, you can move your seats around the private space for a better viewing angle. Great for a private experience with smaller groups.',
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Excellent views; side-on' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: CouchSvg, label: 'Plush chairs' },
        ],
        rows: 'Private Box',
      },
      'stalls-box-a': {
        blockName: 'Box A',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Stalls - Box A',
        description:
          "Enjoy excellent, clear views of the stage. The slightly tilted angle doesn't affect the views as there are no obstructions in the way. Great for a private experience close to the action. Includes extra room for keeping your belongings.",
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Excellent views; side-on' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: CouchSvg, label: 'Plush chairs' },
        ],
        rows: 'Private Box',
      },
      'dress-circle-box-c': {
        blockName: 'Box C',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Box C',
        description:
          'Great view of the stage from a comfortable distance. You may need to lean forward as part of the stage is hidden, although the experience is not hindered. The private space comes with extra room to keep small belongings.',
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Excellent views; side-on' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
        ],
        rows: 'Private Box',
      },
      'dress-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Left',
        description:
          'Wide view of the stage from a side angle. The section is curved towards the edge, so end-seats have restricted views. Stair rails may affect seats in rows B-C. Pick aisle seats for better legroom and great views. The views are clear throughout.',
        quickInfo: [
          { icon: SeatIcon, label: '51 seats' },
          { icon: BinocularIcon, label: 'Great views in aisle seats' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-F',
      },
      'dress-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Center',
        description:
          "Excellent, unobstructed views of the stage from an optimal distance. Rows A-D are close enough so you don't miss any details and get a wide view of the production. A good rake ensures clear views from all seats.",
        quickInfo: [
          { icon: SeatIcon, label: '75 seats' },
          { icon: BinocularIcon, label: 'Excellent views from rows A-D' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows A-G',
      },
      'dress-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Right',
        description:
          'Wide view of the stage from an angled position. As the section curves towards the ends, seats at the edge have restricted views of the stage. Aisle seats offer better legroom and great views. A good rake ensures clear views even from back rows.',
        quickInfo: [
          { icon: SeatIcon, label: '46 seats' },
          { icon: BinocularIcon, label: 'Great views in aisle seats' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-F',
      },
      'dress-circle-box-a-b': {
        blockName: 'Box A-B',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Dress Circle - Box A-B',
        description:
          "Great view of the stage from a comfortable distance. The side angle doesn't hinder the experience as you can move the seats around for a better view. You may have to lean forward for some parts. The private space comes with extra room to keep small items.",
        quickInfo: [
          { icon: SeatIcon, label: '7 seats' },
          { icon: BinocularIcon, label: 'Excellent views; side-on' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
        ],
        rows: 'Private Boxes',
      },
      'grand-circle-box-c-d': {
        blockName: 'Box C-D',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Box C-D',
        description:
          'Great, unobstructed views of the stage. Although positioned to the side, you can move around the private space for a better viewing angle. The private space comes with extra room to keep small belongings.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent views; side-on' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
        ],
        rows: 'Private Boxes',
      },
      'grand-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Left',
        description:
          'Unobstructed views from an elevation. A good rake ensures clear sightlines from all seats. Views from rows A-B are slightly obstructed due to a handrail, although leaning forward aides the experience. Seats at the ends have restricted views.',
        quickInfo: [
          { icon: SeatIcon, label: '70 seats' },
          { icon: BinocularIcon, label: 'Great views from aisle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows A-F',
      },
      'grand-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Right',
        description:
          "Great views of the stage from an elevation. The distance is optimal, so you don't miss any part of the show, even from the back rows. You may have to lean forward from front rows as a safety rail obstructs the view. End-seats have restricted views.",
        quickInfo: [
          { icon: SeatIcon, label: '65 seats' },
          { icon: BinocularIcon, label: 'Great views from aisle seats' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Rows A-F',
      },
      'grand-circle-box-a-b': {
        blockName: 'Box A-B',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Circle - Box A-B',
        description:
          "Unobstructed views of the stage from an elevation. If you're comfortable with the height and side angle, the private space makes for an excellent experience. You may have to lean forward to see one side of the stage.",
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Great views; side-on' },
          { icon: MovableSeatsIcon, label: 'Movable seats' },
          { icon: ValueForMoneyIcon, label: 'Value for money' },
        ],
        rows: 'Private Boxes',
      },
      'balcony-left': {
        blockName: 'Left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony - Left',
        description:
          "With a bird's eye view of the stage, the steep rake ensures clear sightlines although you may to lean forward to see the front of the stage. The high elevation is not ideal for people with vertigo or limited mobility.",
        quickInfo: [
          { icon: SeatIcon, label: '67 seats' },
          { icon: BinocularIcon, label: 'Good views from end-seats' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-F',
      },
      'balcony-right': {
        blockName: 'Right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony - Right',
        description:
          "Panoramic view of the stage from a high elevation. You may have to lean forward to see the stagefront although most seats offer clear sightlines as the rake is quite steep. If you're a person with vertigo or limited mobility, avoid this section.",
        quickInfo: [
          { icon: SeatIcon, label: '67 seats' },
          { icon: BinocularIcon, label: 'Good views from end-seats' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-F',
      },
    },
    [THEATRE_TYPES.RADIO_CITY_MUSIC_HALL]: {
      'orchestra-7': {
        blockName: 'Orchestra -  7',
        theatreSectionName: 'Orchestra',
        theatreSectionLabel: 'Orchestra -  7',
        description:
          'Stay close to the stage and get a unique, immersive perspective of the show from this section. While Rows NN to TT offer slightly limited and angled views, rows further back provide a broader perspective of the stage and are conveniently near the lobby concessions and exits.',
        quickInfo: [
          { icon: SeatIcon, label: '200 seats' },
          {
            icon: BinocularIcon,
            label: 'Close-up, largely unobstructed views row WW onwards',
          },
        ],
        rows: 'Rows NN - U',
      },
      'orchestra-6': {
        blockName: 'Orchestra -  6',
        theatreSectionName: 'Orchestra',
        theatreSectionLabel: 'Orchestra -  6',
        description:
          'Enjoy close-up views of the Rockettes and get immersed into the holiday magic from the first few rows. Views may be slightly angled as the section is towards the side but the stage is at eye-level which ensures great views.',
        quickInfo: [
          { icon: SeatIcon, label: '207 seats' },
          {
            icon: BinocularIcon,
            label: 'Close-up, largely unobstructed views row WW onwards',
          },
        ],
        rows: 'Rows BB - W',
      },
      'orchestra-5': {
        blockName: 'Orchestra -  5',
        theatreSectionName: 'Orchestra',
        theatreSectionLabel: 'Orchestra -  5',
        description:
          "Get close-up and immersive views of the Rockettes from the first few rows. The stage is at eye-level which ensures great views from almost all rows. You can even catch confetti snowflakes if you're seated in the first few rows. Legroom reduces as you move towards the back.",
        quickInfo: [
          { icon: SeatIcon, label: '635 seats' },
          {
            icon: BinocularIcon,
            label: 'Excellent views from row CC to row RR',
          },
        ],
        rows: 'Rows AA - W',
      },
      'orchestra-4': {
        blockName: 'Orchestra -  4',
        theatreSectionName: 'Orchestra',
        theatreSectionLabel: 'Orchestra -  4',
        description:
          'This section is perfectly centered and provides great views from the stage. The front rows provide an intimate look at the frost fairies, while seats further back deliver wide-angle perspectives. Legroom becomes tighter in the rear rows.',
        quickInfo: [
          { icon: SeatIcon, label: '589 seats' },
          {
            icon: BinocularIcon,
            label: 'Excellent, central views from all rows',
          },
        ],
        rows: 'Rows BB - W',
      },
      'orchestra-3': {
        blockName: 'Orchestra -  3',
        theatreSectionName: 'Orchestra',
        theatreSectionLabel: 'Orchestra -  3',
        description:
          'The first few rows deliver close-up, immersive views of the Rockettes. Rows towards the back may seem a little far from the stage but the views are clear. Legroom decreases as you move further back.',
        quickInfo: [
          { icon: SeatIcon, label: '635 seats' },
          {
            icon: BinocularIcon,
            label: 'Excellent views from row CC to row RR',
          },
        ],
        rows: 'Rows AA - W',
      },
      'orchestra-2': {
        blockName: 'Orchestra -  2',
        theatreSectionName: 'Orchestra',
        theatreSectionLabel: 'Orchestra -  2',
        description:
          'Get close-up views of the Rockettes and feel immersed in the holiday spirit from the first few rows. Though slightly angled due to the section’s side location, the stage is at eye-level and ensures great visibility from almost all seats.',
        quickInfo: [
          { icon: SeatIcon, label: '207 seats' },
          {
            icon: BinocularIcon,
            label: 'Close-up, largely unobstructed views row WW onwards',
          },
        ],
        rows: 'Rows BB - W',
      },
      'orchestra-1': {
        blockName: 'Orchestra -  1',
        theatreSectionName: 'Orchestra',
        theatreSectionLabel: 'Orchestra -  1',
        description:
          'Stay close to the stage and get a unique, immersive perspective of the show from this section. Views may be slightly limited and angled in Rows NN through TT. Rows towards the back provide a wider perspective of the stage and are closest to lobby concessions and exits.',
        quickInfo: [
          { icon: SeatIcon, label: '200 seats' },
          {
            icon: BinocularIcon,
            label: 'Close-up, largely unobstructed views row WW onwards',
          },
        ],
        rows: 'Rows NN - U',
      },

      'first-mezzanine-7': {
        blockName: 'First Mezzanine -  7',
        theatreSectionName: 'First Mezzanine',
        theatreSectionLabel: 'First Mezzanine -  7',
        description:
          'Directly above the Orchestra section, this section has good views that are quite similar to what you get from the back rows of Orchestra. The steep rake ensures clear visibility, though views may be slightly angled due to the section’s side positioning.',
        quickInfo: [
          { icon: SeatIcon, label: '108 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views; angled views towards the end of the rows',
          },
        ],
        rows: 'Rows AA - L',
      },
      'first-mezzanine-6': {
        blockName: 'First Mezzanine -  6',
        theatreSectionName: 'First Mezzanine',
        theatreSectionLabel: 'First Mezzanine -  6',
        description:
          'This mezzanine offers views comparable to the Orchestra’s back rows. However, since the number of seats is limited here there is fewer chances of your views getting blocked by those in front rows due to the inclined rake. The inclined rake ensures clear visibility, and you’ll enjoy a close-up view of the frost fairies from this section.',
        quickInfo: [
          { icon: SeatIcon, label: '153 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views from most seats',
          },
        ],
        rows: 'Rows A - K',
      },
      'first-mezzanine-5': {
        blockName: 'First Mezzanine -  5',
        theatreSectionName: 'First Mezzanine',
        theatreSectionLabel: 'First Mezzanine -  5',
        description:
          'This section is almost in the center and provides great views from the stage. The steeply raked rows offer great, obstruction-free views from most seats, especially in the middle. Get a close-up view of the flying frost fairies from this mezzanine.',
        quickInfo: [
          { icon: SeatIcon, label: '142 seats' },
          {
            icon: BinocularIcon,
            label: 'Great, clear views from most rows',
          },
        ],
        rows: 'Rows A - K',
      },
      'first-mezzanine-4': {
        blockName: 'First Mezzanine -  4',
        theatreSectionName: 'First Mezzanine',
        theatreSectionLabel: 'First Mezzanine -  4',
        description:
          'Perfectly centered, this mezzanine section offers superb stage views. While the stage is at a distance, the steep rake guarantees clear, obstruction-free views from most seats, especially in the middle. Enjoy a close-up view of the flying frost fairies from this mezzanine.',
        quickInfo: [
          { icon: SeatIcon, label: '142 seats' },
          {
            icon: BinocularIcon,
            label: 'Great, central views',
          },
        ],
        rows: 'Rows A - K',
      },
      'first-mezzanine-3': {
        blockName: 'First Mezzanine -  3',
        theatreSectionName: 'First Mezzanine',
        theatreSectionLabel: 'First Mezzanine -  3',
        description:
          'This section is almost perfectly centered and provides fantastic views of the stage. The steeply raked rows offer great, obstruction-free views from most seats, especially in the middle. Get a close-up view of the flying frost fairies from this mezzanine.',
        quickInfo: [
          { icon: SeatIcon, label: '142 seats' },
          {
            icon: BinocularIcon,
            label: 'Great, clear views from most rows',
          },
        ],
        rows: 'Rows A - K',
      },
      'first-mezzanine-2': {
        blockName: 'First Mezzanine -  2',
        theatreSectionName: 'First Mezzanine',
        theatreSectionLabel: 'First Mezzanine -  2',
        description:
          'This mezzanine offers views comparable to the Orchestra’s back rows. However, since the number of seats is limited here there is fewer chances of your views getting blocked by those in front rows due to the inclined rake. The inclined rake ensures clear visibility, and you’ll enjoy a close-up view of the frost fairies from this section.',
        quickInfo: [
          { icon: SeatIcon, label: '153 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views from most seats',
          },
        ],
        rows: 'Rows A - K',
      },
      'first-mezzanine-1': {
        blockName: 'First Mezzanine -  1',
        theatreSectionName: 'First Mezzanine',
        theatreSectionLabel: 'First Mezzanine -  1',
        description:
          'Located directly above the Orchestra, this section provides views similar to the back rows of the Orchestra. The steep rake ensures clear views. Views may be slightly angled as the section is towards the side.',
        quickInfo: [
          { icon: SeatIcon, label: '108 seats' },
          {
            icon: BinocularIcon,
            label: 'Great, slightly angled views from all rows',
          },
        ],
        rows: 'Rows BB - L',
      },

      'second-mezzanine-7': {
        blockName: 'Second Mezzanine -  7',
        theatreSectionName: 'Second Mezzanine',
        theatreSectionLabel: 'Second Mezzanine -  7',
        description:
          "While the stage is distant, the steep rake ensures clear visibility from most seats. Performers' faces may not be fully visible, but the choreography is easy to follow. Positioned slightly to the side, some views might be restricted.",
        quickInfo: [
          { icon: SeatIcon, label: '97 seats' },
          {
            icon: BinocularIcon,
            label: 'Clear, wide angle views',
          },
        ],
        rows: 'Rows AA - K',
      },
      'second-mezzanine-6': {
        blockName: 'Second Mezzanine -  6',
        theatreSectionName: 'Second Mezzanine',
        theatreSectionLabel: 'Second Mezzanine -  6',
        description:
          'The Second Mezzanine offers a fantastic vantage point for watching the Rockettes’ precision dance formations. Thanks to the steep rake and distance from the stage, you get a wide-angle overview, though side seats may have slightly angled views.',
        quickInfo: [
          { icon: SeatIcon, label: '139 seats' },
          {
            icon: BinocularIcon,
            label: 'Clear, wide angle views',
          },
        ],
        rows: 'Rows A - K',
      },
      'second-mezzanine-5': {
        blockName: 'Second Mezzanine -  5',
        theatreSectionName: 'Second Mezzanine',
        theatreSectionLabel: 'Second Mezzanine -  5',
        description:
          'This elevated section provides great views of the stage, perfect for appreciating the Rockettes’ precise dance formations. The wide-angle perspective ensures you don’t miss the grandeur of the entire stage.',
        quickInfo: [
          { icon: SeatIcon, label: '129 seats' },
          {
            icon: BinocularIcon,
            label: 'Clear, wide angle views',
          },
        ],
        rows: 'Rows A - K',
      },
      'second-mezzanine-4': {
        blockName: 'Second Mezzanine -  4',
        theatreSectionName: 'Second Mezzanine',
        theatreSectionLabel: 'Second Mezzanine -  4',
        description:
          'Though the stage is distant, the steeply raked rows deliver unobstructed views from most seats, especially in the center. This section is perfect for watching the Rockettes’ synchronized formations with a panoramic perspective of the entire stage.',
        quickInfo: [
          { icon: SeatIcon, label: '109 seats' },
          {
            icon: BinocularIcon,
            label: 'Great, central views',
          },
        ],
        rows: 'Rows A - K',
      },
      'second-mezzanine-3': {
        blockName: 'Second Mezzanine -  3',
        theatreSectionName: 'Second Mezzanine',
        theatreSectionLabel: 'Second Mezzanine -  3',
        description:
          'The Second Mezzanine provides a stunning overview of the Rockettes’ intricate formations. Its steep rake and elevated position offer clear views, though side seats may have slightly angled views.',
        quickInfo: [
          { icon: SeatIcon, label: '129 seats' },
          {
            icon: BinocularIcon,
            label: 'Clear, wide angle views',
          },
        ],
        rows: 'Rows A - K',
      },
      'second-mezzanine-2': {
        blockName: 'Second Mezzanine -  2',
        theatreSectionName: 'Second Mezzanine',
        theatreSectionLabel: 'Second Mezzanine -  2',
        description:
          "From its elevated position, this section provides excellent visibility of the Rockettes' performances. It offers a wide-angle stage overview, ideal for appreciating the choreography and formations.",
        quickInfo: [
          { icon: SeatIcon, label: '139 seats' },
          {
            icon: BinocularIcon,
            label: 'Clear, wide angle views',
          },
        ],
        rows: 'Rows A - K',
      },
      'second-mezzanine-1': {
        blockName: 'Second Mezzanine -  1',
        theatreSectionName: 'Second Mezzanine',
        theatreSectionLabel: 'Second Mezzanine -  1',
        description:
          "While the stage is distant, the steep rake ensures clear visibility from most seats. Performers' faces may not be fully visible, but the choreography is easy to follow. Positioned slightly to the side, some views might be restricted.",
        quickInfo: [
          { icon: SeatIcon, label: '97 seats' },
          {
            icon: BinocularIcon,
            label: 'Clear, wide angle views',
          },
        ],
        rows: 'Rows AA - K',
      },

      'third-mezzanine-7': {
        blockName: 'Third Mezzanine -  7',
        theatreSectionName: 'Third Mezzanine',
        theatreSectionLabel: 'Third Mezzanine -  7',
        description:
          'While the stage may feel far, the steeply raked rows ensure clear views. Projections on the ceiling are visible from all sections of the Third Mezzanine. Some seats to the side may have restricted views.',
        quickInfo: [
          { icon: SeatIcon, label: '79 seats' },
          { icon: BinocularIcon, label: 'Clear, wide angle views' },
        ],
        rows: 'Rows AA - H',
      },
      'third-mezzanine-6': {
        blockName: 'Third Mezzanine -  6',
        theatreSectionName: 'Third Mezzanine',
        theatreSectionLabel: 'Third Mezzanine -  6',
        description:
          "Despite being the farthest mezzanine, the limited seating creates an intimate experience. Projections on the ceiling provide an enhanced experience. Some seats may provide angled views due to the section's position.",
        quickInfo: [
          { icon: SeatIcon, label: '111 seats' },
          { icon: BinocularIcon, label: 'Clear, wide angle views' },
        ],
        rows: 'Rows A - H',
      },
      'third-mezzanine-5': {
        blockName: 'Third Mezzanine -  5',
        theatreSectionName: 'Third Mezzanine',
        theatreSectionLabel: 'Third Mezzanine -  5',
        description:
          "As the farthest mezzanine, the limited seating makes for an intimate setting in this section. You can view projections overhead on the ceiling from all sections of the Third Mezzanine. The section's position may result in angled views.",
        quickInfo: [
          { icon: SeatIcon, label: '103 seats' },
          { icon: BinocularIcon, label: 'Clear, wide angle views' },
        ],
        rows: 'Rows A - H',
      },
      'third-mezzanine-4': {
        blockName: 'Third Mezzanine -  4',
        theatreSectionName: 'Third Mezzanine',
        theatreSectionLabel: 'Third Mezzanine -  4',
        description:
          'Though distant, the steeply raked rows provide obstruction-free views from most seats, especially in the middle. The safety barrier may obstruct views for shorter individuals. Ceiling projections are visible from all sections.',
        quickInfo: [
          { icon: SeatIcon, label: '103 seats' },
          { icon: BinocularIcon, label: 'Clear and central views' },
        ],
        rows: 'Rows A - H',
      },
      'third-mezzanine-3': {
        blockName: 'Third Mezzanine -  3',
        theatreSectionName: 'Third Mezzanine',
        theatreSectionLabel: 'Third Mezzanine -  3',
        description:
          "The Third Mezzanine offers a cozy atmosphere with limited seating despite its distance from the stage. Ceiling projections are visible throughout. The section's position may result in angled views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '103 seats' },
          { icon: BinocularIcon, label: 'Clear, wide angle views' },
        ],
        rows: 'Rows A - H',
      },
      'third-mezzanine-2': {
        blockName: 'Third Mezzanine -  2',
        theatreSectionName: 'Third Mezzanine',
        theatreSectionLabel: 'Third Mezzanine -  2',
        description:
          "The stage may feel far away but due to the steeply raked rows the views are clear. You can witness projections overhead on the ceiling from all sections of the Third Mezzanine. The section's position may result in angled views.",
        quickInfo: [
          { icon: SeatIcon, label: '111 seats' },
          { icon: BinocularIcon, label: 'Clear, wide angle views' },
        ],
        rows: 'Rows A - H',
      },
      'third-mezzanine-1': {
        blockName: 'Third Mezzanine -  1',
        theatreSectionName: 'Third Mezzanine',
        theatreSectionLabel: 'Third Mezzanine -  1',
        description:
          'While the stage may feel far, the steeply raked rows ensure clear views. Projections on the ceiling are visible from all sections of the Third Mezzanine. Some seats to the side may have restricted views.',
        quickInfo: [
          { icon: SeatIcon, label: '79 seats' },
          { icon: BinocularIcon, label: 'Clear, wide angle views' },
        ],
        rows: 'Rows AA - H',
      },
    },
  },
  availableShowsTgid: {
    [THEATRE_TYPES.ABBA_ARENA]: ['20045'],
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: ['3031'],
    [THEATRE_TYPES.NOVELLO_THEATRE]: ['3026'],
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: ['20498'],
    [THEATRE_TYPES.PALACE_THEATRE]: ['16816'],
    [THEATRE_TYPES.SONDHEIM_THEATRE]: ['2863'],
    [THEATRE_TYPES.TROUBADOUR_WEMBLEY_PARK_THEATRE]: ['24961'],
    [THEATRE_TYPES.PRINCE_OF_WALES_THEATRE]: ['2843'],
    [THEATRE_TYPES.DOMINION_THEATRE]: ['24878'],
    [THEATRE_TYPES.ADELPHI_THEATRE]: ['13402'],
    [THEATRE_TYPES.ALDWYCH_THEATRE]: ['9162'],
    [THEATRE_TYPES.ROYAL_ALBERT_HALL]: ['28922'],
    [THEATRE_TYPES.APOLLO_THEATRE]: ['26688'],
    [THEATRE_TYPES.RADIO_CITY_MUSIC_HALL]: ['2505'],
  },

  seatMapSvgs: {
    [THEATRE_TYPES.ABBA_ARENA]: AbbaSeatMapSvg,
    [THEATRE_TYPES.NOVELLO_THEATRE]: NovelloTheatreSvg,
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: PrinceEdwardTheatreSvg,
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: HisMajestysTheatreSvg,
    [THEATRE_TYPES.PALACE_THEATRE]: PalaceTheatreSvg,
    [THEATRE_TYPES.SONDHEIM_THEATRE]: SondheimTheatreSvg,
    [THEATRE_TYPES.TROUBADOUR_WEMBLEY_PARK_THEATRE]:
      TroubadourWembleyParkTheatreSvg,
    [THEATRE_TYPES.PRINCE_OF_WALES_THEATRE]: PrinceOfWalesTheatreSvg,
    [THEATRE_TYPES.DOMINION_THEATRE]: DominionTheatreSvg,
    [THEATRE_TYPES.ADELPHI_THEATRE]: AdelphiTheatreSvg,
    [THEATRE_TYPES.ALDWYCH_THEATRE]: AldwychTheatreSvg,
    [THEATRE_TYPES.ROYAL_ALBERT_HALL]: RoyalAlbertHallSvg,
    [THEATRE_TYPES.APOLLO_THEATRE]: ApolloTheatreSvg,
    [THEATRE_TYPES.RADIO_CITY_MUSIC_HALL]: RadioCityMusicHallSvg,
  },
  viewBox: {
    [THEATRE_TYPES.ABBA_ARENA]: (isMobile: boolean) =>
      isMobile ? '0 0 343 299' : '0 0 607 471',
    [THEATRE_TYPES.NOVELLO_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 387' : '0 0 607 633',
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 484' : '0 0 607 633',
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 502' : '0 0 607 640',
    [THEATRE_TYPES.PALACE_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 342 494' : '0 0 607 663',
    [THEATRE_TYPES.SONDHEIM_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 419' : '0 0 607 663',
    [THEATRE_TYPES.TROUBADOUR_WEMBLEY_PARK_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 314' : '0 0 607 664',
    [THEATRE_TYPES.PRINCE_OF_WALES_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 168' : '0 130 607 400',
    [THEATRE_TYPES.DOMINION_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 342 312' : '0 0 607 664',
    [THEATRE_TYPES.ADELPHI_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 342 389' : '0 0 607 664',
    [THEATRE_TYPES.ALDWYCH_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 342 394' : '0 0 607 665',
    [THEATRE_TYPES.ROYAL_ALBERT_HALL]: (isMobile: boolean) =>
      isMobile ? '0 0 343 600' : '0 0 607 706',
    [THEATRE_TYPES.APOLLO_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 342 394' : '0 0 607 693',
    [THEATRE_TYPES.RADIO_CITY_MUSIC_HALL]: (isMobile: boolean) =>
      isMobile ? '0 0 343 372' : '0 0 607 663',
  },
  breadCrumbsLabel: {
    [THEATRE_TYPES.ABBA_ARENA]: 'ABBA Arena Seating Plan',
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: "His Majesty's Theatre Seating Plan",
    [THEATRE_TYPES.NOVELLO_THEATRE]: 'Novello Theatre Seating Plan',
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: 'Prince Edward Theatre Seating Plan',
    [THEATRE_TYPES.PALACE_THEATRE]: 'Palace Theatre Seating Plan',
    [THEATRE_TYPES.SONDHEIM_THEATRE]: 'Sondheim Theatre Seating Plan',
    [THEATRE_TYPES.TROUBADOUR_WEMBLEY_PARK_THEATRE]:
      'Troubadour Wembley Park Theatre Seating Plan',
    [THEATRE_TYPES.PRINCE_OF_WALES_THEATRE]:
      'Prince of Wales Theatre Seating Plan',
    [THEATRE_TYPES.DOMINION_THEATRE]: 'Dominion Theatre Seating Plan',
    [THEATRE_TYPES.ADELPHI_THEATRE]: 'Adelphi Theatre Seating Plan',
    [THEATRE_TYPES.ALDWYCH_THEATRE]: 'Aldwych Theatre Seating Plan',
    [THEATRE_TYPES.ROYAL_ALBERT_HALL]: 'Royal Albert Hall Seating Plan',
    [THEATRE_TYPES.APOLLO_THEATRE]: 'Apollo Theatre Seating Plan',
    [THEATRE_TYPES.RADIO_CITY_MUSIC_HALL]:
      'Radio city music hall Theatre Seating Plan',
  },
};
