import { THEATRE_TYPES } from 'const/index';
import AbbaSeatMapSvg from 'assets/abbaSeatMapSvg';
import BinocularIcon from 'assets/binocularIcon';
import CouchSvg from 'assets/couchSvg';
import DiscoBallSvg from 'assets/discoBallSvg';
import DrinkSvg from 'assets/drinkSvg';
import HisMajestysTheatreSvg from 'assets/hisMajestysTheatreSvg';
import LegRoomSvg from 'assets/legRoomSvg';
import NovelloTheatreSvg from 'assets/novelloThetreSvg';
import PrinceEdwardTheatreSvg from 'assets/princeEdwardTheatreSvg';
import RestRoomSvg from 'assets/restRoomSvg';
import SeatIcon from 'assets/seatIcon';
import SeatIcon2 from 'assets/seatIcon2';
import TheatreRoyalDruryLaneSvg from 'assets/theatreRoyalDruryLaneSvg';
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
  icon: React.FC<{ width?: string; height?: string }>;
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
    [THEATRE_TYPES.THEATRE_ROYAL_DRURY_LANE]: {
      BANNER_HEADING: 'Theatre Royal Drury Lane seating plan',
      BANNER_DESCRIPTION:
        "West End's oldest theatre, this venue has been a royal favourite since 1633. Theatre Royal Drury Lane's seating plan guide will help you locate the best seats based on both the view and cost-effectiveness.",
      BANNER_ICONS: [
        {
          name: '1974 seats',
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
    [THEATRE_TYPES.THEATRE_ROYAL_DRURY_LANE]: {
      kings: {
        blockName: 'Grand King’s Box',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand King’s Box',
        description:
          'With comfortable seating and ample legroom, this section features inclined seats offering mostly clear views, albeit with slight obstructions. Some seats may have the top of the stage cut off. There is also space available for storing bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      princess: {
        blockName: 'Grand Prince’s Box',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Prince’s Box seats',
        description:
          'With comfortable seating and ample legroom, this section features inclined seats offering mostly clear views, albeit with slight obstructions. Some seats may have the top of the stage cut off. There is also space available for storing bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-k': {
        blockName: 'Box K',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Box K Grand Circle',
        description:
          'With comfortable seating and ample legroom, this section features inclined seats offering mostly clear views, albeit with slight obstructions. Some seats may have the top of the stage cut off. There is also space available for storing bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-l': {
        blockName: 'Box L',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Box L Grand Circle',
        description:
          'With comfortable seating and ample legroom, this section features inclined seats offering mostly clear views, albeit with slight obstructions. Some seats may have the top of the stage cut off. There is also space available for storing bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'stalls-left-slip': {
        blockName: 'Left Slips',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Left Slips - Stalls',
        description:
          'This section offers comfortable seats with ample legroom and storage for bags and coats. While the views are mostly clear, there are slight obstructions on the side.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'stalls-right-slip': {
        blockName: 'Right Slips',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Right Slips - Stalls',
        description:
          'This section offers comfortable seats with ample legroom and storage for bags and coats. While the views are mostly clear, there are slight obstructions on the side.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'royal-box': {
        blockName: 'The Royal Box',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'The Royal Box seats',
        description:
          'This section offers comfortable seats with ample legroom and storage for bags and coats. While the views are mostly clear, there are slight obstructions on the side.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'princess-box': {
        blockName: 'The Prince’s Box',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'The Prince’s Box seats',
        description:
          'This section offers comfortable seats with ample legroom and storage for bags and coats. While the views are mostly clear, there are slight obstructions on the side.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-a': {
        blockName: 'Box A',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box A Royal Circle',
        description:
          'This section offers comfortable seats with ample legroom and storage for bags and coats. While the views are mostly clear, there are slight obstructions on the side.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-b': {
        blockName: 'Box B',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box B Royal Circle',
        description:
          "With comfortable seats and ample legroom, this section's inclined seats offer clear views with minimal obstructions. Convenient storage space for bags and coats is also available..",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great views; slightly restricted' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-c': {
        blockName: 'Box C',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box C Royal Circle',
        description:
          "With comfortable seats and ample legroom, this section's inclined seats offer clear views with minimal obstructions. Convenient storage space for bags and coats is also available..",
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Great views; slightly restricted' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-d': {
        blockName: 'Box D',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box D Royal Circle',
        description:
          'This section features comfortable seats and ample legroom. The inclined seating offers central, clear views, with additional space for bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-e': {
        blockName: 'Box E',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box E Royal Circle',
        description:
          'This section features comfortable seats and ample legroom. The inclined seating offers central, clear views, with additional space for bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-f': {
        blockName: 'Box F',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box F Royal Circle',
        description:
          'The seats and legroom in this section are comfortable. The inclined seats provide central views. There is also additional space for bags and coats. However, the views are slightly obstructed here.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-g': {
        blockName: 'Box G',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box G Royal Circle',
        description:
          "With comfortable seats and ample legroom, this section's inclined seats offer clear and central views. Convenient storage space for bags and coats is also available.",
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-h': {
        blockName: 'Box H',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box H Royal Circle',
        description:
          "With comfortable seats and ample legroom, this section's inclined seats offer clear and central views. Convenient storage space for bags and coats is also available.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'box-j': {
        blockName: 'Box J',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box J Royal Circle',
        description:
          "With comfortable seating and ample legroom, this section's inclined seats offer mostly clear views, albeit with slight obstructions. Some seats may have the top of the stage cut off. There is also space available for storing bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: '',
      },
      'stalls-front-left': {
        blockName: 'Front Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front Left Stalls',
        description:
          'This section offers clear, close-up views of the stage. However, being on the left side, most seats provide an angled perspective.',
        quickInfo: [
          { icon: SeatIcon, label: '58 seats' },
          { icon: BinocularIcon, label: 'Great views towards the aisle' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'rows A-K',
      },
      'stalls-center': {
        blockName: 'Center',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Center Stalls',
        description:
          'Prime seating area, offers excellent views from every seat. Middle seats in Rows E-M provide particularly great views.',
        quickInfo: [
          { icon: SeatIcon, label: '389 seats' },
          {
            icon: BinocularIcon,
            label: 'Best views in Rows E - M, middle seats',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'rows A-X',
      },
      'stalls-front-right': {
        blockName: 'Front Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front Right Stalls',
        description:
          'This section offers clear, close-up views of the stage. However, since the seats are towards the right, most views are angled.',
        quickInfo: [
          { icon: SeatIcon, label: '58 seats' },
          { icon: BinocularIcon, label: 'Great views towards the aisle' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'rows A-K',
      },
      'stalls-rear-left': {
        blockName: 'Rear Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Left Stalls',
        description:
          'This section, located very close to the stage, offers great, clear views. Aisle seats are particularly advantageous, providing extra legroom and unobstructed views.',
        quickInfo: [
          { icon: SeatIcon, label: '110 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows M - P' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows M-X',
      },
      'stalls-rear-right': {
        blockName: 'Rear Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Right - Stalls',
        description:
          'This section, located very close to the stage, offers great, clear views. Aisle seats are particularly advantageous, providing extra legroom and unobstructed views.',
        quickInfo: [
          { icon: SeatIcon, label: '110 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows M - P' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows M-X',
      },
      'royal-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Left Royal Circle',
        description:
          'The first few rows in this section are close to the stage, offering excellent views. The steep seating ensures clear views from most rows.',
        quickInfo: [
          { icon: SeatIcon, label: '120 seats' },
          { icon: BinocularIcon, label: 'Great, clear views in Rows A - H' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-L',
      },
      'royal-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Center Royal Circle',
        description:
          'Centrally located and close to the stage, this section offers excellent, clear views due to the steep seating arrangement.',
        quickInfo: [
          { icon: SeatIcon, label: '180 seats' },
          {
            icon: BinocularIcon,
            label: 'Brilliant views in all middle seats',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-L',
      },
      'royal-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Right Royal Circle',
        description:
          'The first few rows in this section are close to the stage, offering excellent views. The steep seating ensures clear views from most rows.',
        quickInfo: [
          { icon: SeatIcon, label: '120 seats' },
          { icon: BinocularIcon, label: 'Great, clear views in Rows A - H' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-L',
      },
      'grand-circle-left': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Left Grand Circle',
        description:
          "This section's steep rake positions rear seats high up, ensuring clear visibility of the stage from most seats.",
        quickInfo: [
          { icon: SeatIcon, label: '122 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A - C' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-K',
      },
      'grand-circle-center': {
        blockName: 'Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Center Grand Circle',
        description:
          "This section's steep rake places rear seats high up, ensuring excellent visibility of the stage from most angles. The central location enhances the viewing experience.",
        quickInfo: [
          { icon: SeatIcon, label: '155 seats' },
          {
            icon: BinocularIcon,
            label: 'Great, central views from all seats',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-K',
      },
      'grand-circle-right': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Right Grand Circle',
        description:
          "This section's steep rake positions rear seats high up, ensuring clear visibility of the stage from most seats.",
        quickInfo: [
          { icon: SeatIcon, label: '121 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A - C' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'rows A-K',
      },
      'balcony-left': {
        blockName: 'Left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Left Balcony',
        description:
          'The section is steeply raked and located quite far from the stage. However, the elevated seating offers clear views from most seats. Positioned towards the left, the views are slightly angled.',
        quickInfo: [
          { icon: SeatIcon, label: '107 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views in Rows A - C, aisle seats',
          },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows A-K',
      },
      'balcony-center': {
        blockName: 'Center',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Center Balcony',
        description:
          'The section is steeply raked and located quite far from the stage. However, the elevated seating offers clear views from most seats.',
        quickInfo: [
          { icon: SeatIcon, label: '157 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A - C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows A-K',
      },
      'balcony-right': {
        blockName: 'Right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Right Balcony',
        description:
          'The section is steeply raked and located quite far from the stage. However, the elevated seating offers clear views from most seats. Positioned towards the right, the views are slightly angled.',
        quickInfo: [
          { icon: SeatIcon, label: '107 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views in Rows A - C, aisle seats',
          },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'rows A-K',
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
        blockName: 'Rear Centre',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Centre Stalls',
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
        blockName: 'Rear Centre',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rear Centre Dress Circle',
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
        blockName: 'Front Centre',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Front Centre Grand Circle',
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
        blockName: 'Rear Centre',
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
  },
  availableShowsTgid: {
    [THEATRE_TYPES.ABBA_ARENA]: ['20045'],
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: ['3031'],
    [THEATRE_TYPES.NOVELLO_THEATRE]: ['3026'],
    [THEATRE_TYPES.THEATRE_ROYAL_DRURY_LANE]: ['18161'],
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: ['20498'],
  },
  seatMapSvgs: {
    [THEATRE_TYPES.ABBA_ARENA]: AbbaSeatMapSvg,
    [THEATRE_TYPES.THEATRE_ROYAL_DRURY_LANE]: TheatreRoyalDruryLaneSvg,
    [THEATRE_TYPES.NOVELLO_THEATRE]: NovelloTheatreSvg,
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: PrinceEdwardTheatreSvg,
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: HisMajestysTheatreSvg,
  },
  viewBox: {
    [THEATRE_TYPES.ABBA_ARENA]: (isMobile: boolean) =>
      isMobile ? '0 0 343 299' : '0 0 607 471',
    [THEATRE_TYPES.THEATRE_ROYAL_DRURY_LANE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 535' : '0 0 607 633',
    [THEATRE_TYPES.NOVELLO_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 387' : '0 0 607 633',
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 484' : '0 0 607 633',
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: (isMobile: boolean) =>
      isMobile ? '0 0 343 502' : '0 0 607 640',
  },
  breadCrumbsLabel: {
    [THEATRE_TYPES.ABBA_ARENA]: 'ABBA Arena Seating Plan',
    [THEATRE_TYPES.THEATRE_ROYAL_DRURY_LANE]:
      'Theatre Royal Drury Lane Seating Plan',
    [THEATRE_TYPES.HIS_MAJESTYS_THEATRE]: "His Majesty's Theatre Seating Plan",
    [THEATRE_TYPES.NOVELLO_THEATRE]: 'Novello Theatre Seating Plan',
    [THEATRE_TYPES.PRINCE_EDWARD_THEATRE]: 'Prince Edward Theatre Seating Plan',
  },
};
