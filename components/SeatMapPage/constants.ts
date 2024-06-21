import { THEATRE_TYPES } from 'const/index';
import AbbaSeatMapSvg from 'assets/abbaSeatMapSvg';
import BinocularIcon from 'assets/binocularIcon';
import CouchSvg from 'assets/couchSvg';
import DiscoBallSvg from 'assets/discoBallSvg';
import DrinkSvg from 'assets/drinkSvg';
import LegRoomSvg from 'assets/legRoomSvg';
import RestRoomSvg from 'assets/restRoomSvg';
import SeatIcon from 'assets/seatIcon';
import SeatIcon2 from 'assets/seatIcon2';
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
export const MAX_VISIBLE_POINT_X_ON_MAP = 996;
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
        rows: 'Rows A - C',
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
        rows: 'Rows A - C',
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
        rows: 'Rows A - C',
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
        rows: 'Rows A - C',
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
        rows: 'Rows A - C',
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
        rows: 'Rows A - P',
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
        rows: 'Rows A - P',
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
        rows: 'Rows A - P',
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
        rows: 'Rows A - P',
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
        rows: 'Rows A - P',
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
    'his-majesty-theatres': {
      'front-stalls': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front',
        description:
          'The most premium section in the theatre - the views are excellent from all of the seats here. The middle seats in Rows E-H provide good views at slightly lower prices.',
        quickInfo: [
          { icon: SeatIcon, label: '369 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows B-F' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows A-N',
      },
      'rear-stalls': {
        blockName: 'Rear',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear',
        description:
          'The views are great here due to the centrality and proximity to the stage. However, pillars and the circle overhang may restrict the views from some seats.',
        accessibleSeating: 'Wheelchair accessibility: Row S',
        quickInfo: [
          { icon: SeatIcon, label: '140 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows P-Q' },
          { icon: LegRoomSvg, label: 'Good legroom' },
          { icon: WheelChairIcon, label: 'Wheelchair accessibility: Row S' },
        ],
        rows: 'Rows P-T',
      },
      'box1-stalls': {
        blockName: 'Box 1',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Box 1',
        description:
          'The box provides a super close-up view of the stage. If you don’t mind missing some views of the stage on one side, the comfort, privacy and the special experience provided by the box seats is unbeatable.',
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
      'box2-stalls': {
        blockName: 'Box 2',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Box 2',
        description:
          'The box provides a super close-up view of the stage. If you don’t mind missing some views of the stage on one side, the comfort, privacy and the special experience provided by the box seats is unbeatable.',
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
      'left-royal-circle': {
        blockName: 'Left',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Left',
        description:
          'The first 3 rows offer great views even though the ends are marked as restricted views. The seats towards the ends provide a slightly angled view as the rows curve along the sides of the auditorium.',
        quickInfo: [
          { icon: SeatIcon, label: '79 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows A-H',
      },
      'center-royal-circle': {
        blockName: 'Center',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Center',
        description:
          'Due to its central location and proximity to the stage, this section provides some of the best views of the stage. 4 pillars in this section obstruct views in the seats around them.',
        quickInfo: [
          { icon: SeatIcon, label: '123 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-F' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows A-H',
      },
      'right-royal-circle': {
        blockName: 'Right',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Right',
        description:
          'The first 3 rows offer great views even though the ends are marked as restricted views. The seats towards the ends provide a slightly angled view as the rows curve along the sides of the auditorium.',
        quickInfo: [
          { icon: SeatIcon, label: '79 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows A-H',
      },
      'box3-royal-circle': {
        blockName: 'Box 3',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box 3',
        description:
          'If you don’t mind missing some views of the stage on one side, the comfort, privacy and the special experience provided by the box seats is unbeatable.',
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
      'box4-royal-circle': {
        blockName: 'Box 4',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box 4',
        description:
          'If you don’t mind missing some views of the stage on one side, the comfort, privacy and the special experience provided by the box seats is unbeatable.',
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
      'left-grand-circle': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Left',
        description:
          'This section is steeply raked, which makes the seats towards the rear very high up. Expect partial obstructions from support pillars in some seats. Largely unrestricted views towards the aisle in Rows A-D.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A-D' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-K',
      },
      'center-grand-circle': {
        blockName: 'Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Center',
        description:
          'This section is steeply raked, which makes the seats towards the rear very high up. Great views in the middle seats (12-23) in Rows A-C.',
        quickInfo: [
          { icon: SeatIcon, label: '170 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows A-K',
      },
      'right-grand-circle': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Right',
        description:
          'This section is steeply raked, which makes the seats towards the rear very high up. Expect partial obstructions from support pillars in some seats. Largely unrestricted views towards the aisle in Rows A-D.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A-D' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-K',
      },
      'left-balcony': {
        blockName: 'Left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Left',
        description:
          'The seats are very far and high up so consider renting binoculars if you wish to sit here. Opt for aisle seats for a little extra space & legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '29 seats' },
          { icon: BinocularIcon, label: 'Decent views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-F',
      },
      'mid-left-balcony': {
        blockName: 'Mid - left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Mid - left',
        description:
          'The stage is very far away but as this section is in the far back center, the views are still great. Rent binoculars for enhanced views. Opt for aisle seats for a little extra space & legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '27 seats' },
          { icon: BinocularIcon, label: 'Good views in Row A' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-C',
      },
      'mid-right-balcony': {
        blockName: 'Mid - right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Mid - right',
        description:
          'The stage is very far away but as this section is in the far back center, the views are still great. Rent binoculars for enhanced views.',
        quickInfo: [
          { icon: SeatIcon, label: '27 seats' },
          { icon: BinocularIcon, label: 'Good views in Row A' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-C',
      },
      'right-balcony': {
        blockName: 'Right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Right',
        description:
          'The seats are very far and high up so consider renting binoculars if you wish to sit here. Opt for aisle seats for a little extra space & legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '20 seats' },
          { icon: BinocularIcon, label: 'Decent views in Rows A-C' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-D',
      },
    },
    'novello-theatre': {
      'front-stalls': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front',
        description:
          'This section is well-raked ensuring premium views from all rows. Unlike other sections, the rows don’t curve here so even the seats on the edge provide great views.',
        quickInfo: [
          { icon: SeatIcon, label: '230 seats' },
          { icon: BinocularIcon, label: 'Excellent views in Rows D-H' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows C-M',
      },
      'rear-stalls': {
        blockName: 'Rear',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear',
        description:
          'This section is well-raked ensuring premium views from all rows. Unlike other sections, the rows don’t curve here so even the seats on the edge provide great views. The overhang from the dress circle affects the last few rows.',
        quickInfo: [
          { icon: SeatIcon, label: '249 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows N-T' },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows N-X',
      },
      'left-dress-circle': {
        blockName: 'Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Left',
        description:
          'As the row curves along the sides of the auditorium, most of the seats provide limited and angled views of the stage. However, you can get good stage views from AA10, AA11, and AA12 at a decent price.',
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
      'center-dress-circle': {
        blockName: 'Center',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Center',
        description:
          'The proximity to the stage and the steeped structure ensure that almost all seats in this section provide clear views of the stage. The rows gently curve towards the edges, meaning that these seats offer a slightly angled view.',
        quickInfo: [
          { icon: SeatIcon, label: '227 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows A-F' },
          { icon: LegRoomSvg, label: 'Good legroom' },
        ],
        rows: 'Rows A-K',
      },
      'right-dress-circle': {
        blockName: 'Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Right',
        description:
          'As the row curves along the sides of the auditorium, most of the seats provide limited and angled views of the stage. However, you can get good stage views from AA8, AA9, BB2, and BB3 at a decent price.',
        quickInfo: [
          { icon: SeatIcon, label: '12 seats' },
          { icon: BinocularIcon, label: 'Restricted & side-on views' },
        ],
        rows: 'Rows AA-BB',
      },
      'left-grand-circle': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Left',
        description:
          'As the row curves along the sides of the auditorium, most of the seats provide limited and angled views of the stage. However, you can get good stage views from AA13 and AA14 at a decent price.',
        quickInfo: [
          { icon: SeatIcon, label: '12 seats' },
          { icon: BinocularIcon, label: 'Restricted & side-on views' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Row AA',
      },
      'center-grand-circle': {
        blockName: 'Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Center',
        description:
          'As the rows curve along the sides of the auditorium, the seats towards the end provide limited and angled views of the stage. However, the steepness of the section ensures that the middle seats offer clear views.',
        quickInfo: [
          { icon: SeatIcon, label: '190 seats' },
          {
            icon: BinocularIcon,
            label: 'Great views in the middle seats of Rows A-C',
          },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-H',
      },
      'right-grand-circle': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Right',
        description:
          'As the row curves along the sides of the auditorium, most of the seats provide limited and angled views of the stage. However, you can get good stage views from AA11 and AA12 at a decent price.',
        quickInfo: [
          { icon: SeatIcon, label: '12 seats' },
          { icon: BinocularIcon, label: 'Restricted & side-on views' },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Row AA',
      },
      balcony: {
        blockName: 'Balcony',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Balcony',
        description:
          "The stage is far away but as the rows are steeply raked, the views are still great & obstruction-free from most seats, especially in the middle. A large safety bar runs along the balcony's length, affecting the views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '142 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views in the middle seats of Rows A-D',
          },
          { icon: LegRoomSvg, label: 'Limited legroom' },
        ],
        rows: 'Rows A-F',
      },
      'dress-circle-box-a': {
        blockName: 'Dress Circle Box A',
        theatreSectionName: 'Dress Circle Boxes',
        theatreSectionLabel: 'Dress Circle Box A',
        description:
          'The box seats provide a super close-up view of the stage. If you don’t mind missing some views of the stage on one side, the comfort, privacy, and special experience the box seats provide are unbeatable.',
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
      'dress-circle-box-c': {
        blockName: 'Dress Circle Box C',
        theatreSectionName: 'Dress Circle Boxes',
        theatreSectionLabel: 'Dress Circle Box C',
        description:
          'The box seats provide a super close-up view of the stage. If you don’t mind missing some views of the stage on one side, the comfort, privacy, and special experience the box seats provide are unbeatable.',
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
      'grand-circle-box-e': {
        blockName: 'Grand Circle Box E',
        theatreSectionName: 'Grand Circle Boxes',
        theatreSectionLabel: 'Grand Circle Box E',
        description:
          'If you don’t mind missing some views of the stage on one side, the comfort, privacy, and special experience the box seats provide are unbeatable. Due to its elevated position, you get largely unrestricted views.',
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
      'grand-circle-box-f': {
        blockName: 'Grand Circle Box F',
        theatreSectionName: 'Grand Circle Boxes',
        theatreSectionLabel: 'Grand Circle Box F',
        description:
          'If you don’t mind missing some views of the stage on one side, the comfort, privacy, and special experience the box seats provide are unbeatable. Due to its elevated position, you get largely unrestricted views.',
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
    'theatre-royal-drury-lane': {
      'front-left-stalls': {
        blockName: 'Front Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front Left',
        description:
          'The section provides clear, close-up views of the stage. However, as the seats are towards the left, most seats provide an angled view of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '58 seats' },
          { icon: BinocularIcon, label: 'Great views towards the aisle' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Rows A-K',
      },
      'center-stalls': {
        blockName: 'Center',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Center',
        description:
          'The most premium section in the theatre - the views are excellent from most seats here. The middle seats in Rows E-M provide great views.',
        quickInfo: [
          { icon: SeatIcon, label: '389 seats' },
          {
            icon: BinocularIcon,
            label: 'Best views in Rows E - M, middle seats',
          },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Rows A-X',
      },
      'front-right-stalls': {
        blockName: 'Front Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Front Right',
        description:
          'The section provides clear, close-up views of the stage. However, as the seats are towards the right, most seats provide an angled view of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '58 seats' },
          { icon: BinocularIcon, label: 'Great views towards the aisle' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
        ],
        rows: 'Rows A-K',
      },
      'rear-left-stalls': {
        blockName: 'Rear Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Left',
        description:
          "The section is located very close to the stage and provides great, clear views of the stage. The seats towards the aisle are great as they provide extra legroom and there's no one to block your views.",
        quickInfo: [
          { icon: SeatIcon, label: '110 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows M - P' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows M-X',
      },
      'rear-right-stalls': {
        blockName: 'Rear Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rear Right',
        description:
          "The section is located very close to the stage and provides great, clear views of the stage. The seats towards the aisle are great as they provide extra legroom and there's no one to block your views.",
        quickInfo: [
          { icon: SeatIcon, label: '110 seats' },
          { icon: BinocularIcon, label: 'Great views in Rows M - P' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows M-X',
      },
      'left-slips-stalls': {
        blockName: 'Left Slips',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Left Slips',
        description:
          'With comfortable seats and legroom, this section provide largely clear views with slight obstructions to the side. The section has space to store bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'No row',
      },
      'right-slips-stalls': {
        blockName: 'Right Slips',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Right Slips',
        description:
          'With comfortable seats and legroom, this section provide largely clear views with slight obstructions to the side. The section has space to store bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'No row',
      },
      'left-royal-circle': {
        blockName: 'Left',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Left',
        description:
          'The first few rows of this section are relatively close to the stage and provide great views. Due to the steeped nature of seats, most of the rows here provide good, clear views.',
        quickInfo: [
          { icon: SeatIcon, label: '120 seats' },
          { icon: BinocularIcon, label: 'Great, clear views in Rows A - H' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-L',
      },
      'center-royal-circle': {
        blockName: 'Center',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Center',
        description:
          'The section is centrally located and relatively close to the stage. Due to the steeped nature of seats, most of the rows here provide great, clear views.',
        quickInfo: [
          { icon: SeatIcon, label: '180 seats' },
          {
            icon: BinocularIcon,
            label: 'Brilliant views in all middle seats',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-L',
      },
      'right-royal-circle': {
        blockName: 'Right',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Right',
        description:
          'The first few rows of this section are relatively close to the stage and provide great views. Due to the steeped nature of seats, most of the rows here provide good, clear views.',
        quickInfo: [
          { icon: SeatIcon, label: '120 seats' },
          { icon: BinocularIcon, label: 'Great, clear views in Rows A - H' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-L',
      },
      'royal-box-royal-circle': {
        blockName: 'The Royal Box',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'The Royal Box',
        description:
          'With comfortable seats and legroom, this section provide largely clear views with slight obstructions to the side. The section has space to store bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'princes-box-royal-circle': {
        blockName: 'The Prince’s Box',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'The Prince’s Box',
        description:
          'With comfortable seats and legroom, this section provide largely clear views with slight obstructions to the side. The section has space to store bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '6 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-a-royal-circle': {
        blockName: 'Box A',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box A',
        description:
          'With comfortable seats and legroom, this section provide largely clear views with slight obstructions to the side. The section has space to store bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-b-royal-circle': {
        blockName: 'Box B',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box B',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide largely clear views with slight obstructions. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great views; slightly restricted' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-c-royal-circle': {
        blockName: 'Box C',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box C',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide largely clear views with slight obstructions. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Great views; slightly restricted' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-d-royal-circle': {
        blockName: 'Box D',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box D',
        description:
          'The seats and legroom in this section are comfortable. The inclined seats provide central and clear views. There is also additional space for bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-e-royal-circle': {
        blockName: 'Box E',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box E',
        description:
          'The seats and legroom in this section are comfortable. The inclined seats provide central and clear views. There is also additional space for bags and coats.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-f-royal-circle': {
        blockName: 'Box F',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box F',
        description:
          'The seats and legroom in this section are comfortable. The inclined seats provide central views. There is also additional space for bags and coats. However, the views are slightly obstructed here.',
        quickInfo: [
          { icon: SeatIcon, label: '4 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-g-royal-circle': {
        blockName: 'Box G',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box G',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide central and clear views. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-h-royal-circle': {
        blockName: 'Box H',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box H',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide central and clear views. The seats have space to store bags and coats. The loos and bar are easily accessible from here.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Excellent views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-j-royal-circle': {
        blockName: 'Box J',
        theatreSectionName: 'Royal Circle',
        theatreSectionLabel: 'Box J',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide largely clear views with slight obstructions. The top of the stage may get cut off here. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'left-grand-circle': {
        blockName: 'Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Left',
        description:
          'This section is steeply raked, which makes the seats towards the rear very high up. However, due to this, the stage is clearly visible as well from most seats.',
        quickInfo: [
          { icon: SeatIcon, label: '122 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A - C' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-K',
      },
      'center-grand-circle': {
        blockName: 'Center',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Center',
        description:
          'This section is steeply raked, which makes the seats towards the rear very high up. Due to this, the stage is clearly visible as well from most seats. The views are better here due to the central location.',
        quickInfo: [
          { icon: SeatIcon, label: '155 seats' },
          {
            icon: BinocularIcon,
            label: 'Great, central views from all seats',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-K',
      },
      'right-grand-circle': {
        blockName: 'Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Right',
        description:
          'This section is steeply raked, which makes the seats towards the rear very high up. However, due to this, the stage is clearly visible as well from most seats.',
        quickInfo: [
          { icon: SeatIcon, label: '121 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A - C' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-K',
      },
      'grand-kings-box-grand-circle': {
        blockName: 'Grand King’s Box',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand King’s Box',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide largely clear views with slight obstructions. The top of the stage may get cut off here. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'grand-princes-box-grand-circle': {
        blockName: 'Grand Prince’s Box',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Grand Prince’s Box',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide largely clear views with slight obstructions. The top of the stage may get cut off here. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '3 seats' },
          { icon: BinocularIcon, label: 'Great; close-up views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon, //TODO: Comfortable chair
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-k-grand-circle': {
        blockName: 'Box K',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Box K',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide largely clear views with slight obstructions. The top of the stage may get cut off here. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'box-l-grand-circle': {
        blockName: 'Box L',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Box L',
        description:
          "With comfortable seats and legroom, this section's inclined seats provide largely clear views with slight obstructions. The top of the stage may get cut off here. The seats have space to store bags and coats.",
        quickInfo: [
          { icon: SeatIcon, label: '2 seats' },
          { icon: BinocularIcon, label: 'Great views' },
          { icon: LegRoomSvg, label: 'Excellent legroom' },
          {
            icon: SeatIcon,
            label: 'Comfortable & movable chairs',
          },
        ],
        rows: 'Box seats',
      },
      'left-balcony': {
        blockName: 'Left',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Left',
        description:
          'The section is very steeply raked and quite far from the stage. However, as the seats are very high up, you can get clear views from most seats. As the section is towards the left, the views are angled.',
        quickInfo: [
          { icon: SeatIcon, label: '107 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views in Rows A - C, aisle seats',
          },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows A-K',
      },
      'center-balcony': {
        blockName: 'Center',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Center',
        description:
          'The section is very steeply raked and quite far from the stage. However, as the seats are very high up, you can get clear views from most seats.',
        quickInfo: [
          { icon: SeatIcon, label: '157 seats' },
          { icon: BinocularIcon, label: 'Good views in Rows A - C' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows A-K',
      },
      'right-balcony': {
        blockName: 'Right',
        theatreSectionName: 'Balcony',
        theatreSectionLabel: 'Right',
        description:
          'The section is very steeply raked and quite far from the stage. However, as the seats are very high up, you can get clear views from most seats. As the section is towards the left, the views are angled.',
        quickInfo: [
          { icon: SeatIcon, label: '107 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views in Rows A - C, aisle seats',
          },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows A-K',
      },
    },
    'prince-edward-theatre': {
      'Front-Stalls': {
        blockName: 'Front',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rows AA-K',
        description:
          "The most premium section in the theatre - the views are excellent from all of the seats here. The seats are staggered so your view won't get restricted by people in front of you even if you are seated in one of the rows at the back.",
        quickInfo: [
          { icon: SeatIcon, label: '327 seats' },
          { icon: BinocularIcon, label: 'Best views in Rows C-G' },
          { icon: LegRoomSvg, label: 'Comfortable legroom' },
        ],
        rows: 'Rows AA-K',
      },
      'RearLeft-Stalls': {
        blockName: 'Rear Left',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rows L-ZC',
        description:
          'The section provides great, clear views of the stage. The seats towards the aisle are great as they provide extra legroom. As the section is located to the left of the stage, some seats provide angled views and you may miss the far left section of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '169 seats' },
          { icon: BinocularIcon, label: 'Best views from aisle seats' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows L-ZC',
      },
      'RearCentre-Stalls': {
        blockName: 'Rear Centre',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rows L-ZC',
        description:
          "The views are great here due to the centrality and proximity to the stage. The steeped seats ensure that the rows ahead don't block your views.",
        quickInfo: [
          { icon: SeatIcon, label: '215 seats' },
          { icon: BinocularIcon, label: 'Great views from Rows L-T' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows L-ZC',
      },
      'RearRight-Stalls': {
        blockName: 'Rear Right',
        theatreSectionName: 'Stalls',
        theatreSectionLabel: 'Rows L-ZC',
        description:
          'The section is located close to the stage and provides great, clear views of the stage. As the section is located to the right of the stage, some seats provide angled views and you may miss the far right section of the stage.',
        quickInfo: [
          { icon: SeatIcon, label: '169 seats' },
          { icon: BinocularIcon, label: 'Great views from Rows L-T' },
          { icon: LegRoomSvg, label: 'Average legroom' },
        ],
        rows: 'Rows L-ZC',
      },
      'FrontLeft-DressCircle': {
        blockName: 'Front Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rows A-E',
        description:
          'The section is a bit far from the stage but the steep rake provides great and clear views from all the rows. The seats to the extreme left provide great legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Best views from Rows A-D' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-E',
      },
      'FrontRight-DressCircle': {
        blockName: 'Front Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rows A-E',
        description:
          'The section is a bit far from the stage but the steep rake provides great and clear views from all the rows. The seats to the extreme left provide great legroom. The safety rail in front of Row A may obstruct the view slightly.',
        quickInfo: [
          { icon: SeatIcon, label: '80 seats' },
          { icon: BinocularIcon, label: 'Best views from Rows A-D' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-E',
      },
      'RearLeft-DressCircle': {
        blockName: 'Rear Left',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rows F-O',
        description:
          'The stage may seem quite far but the steeped seating ensures good views from most seats. The seats towards the aisle on the right provide great legroom. Note that some of the stage may be obstructed due to the Grand Circle overhang.',
        quickInfo: [
          { icon: SeatIcon, label: '59 seats' },
          { icon: BinocularIcon, label: 'Good views from Rows F-J' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows F-O',
      },
      'RearCentre-DressCircle': {
        blockName: 'Rear Centre',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rows F-M',
        description:
          'The centrality of this section along with the steep make this section a great choice. great unobstructed views of the stage. Almost all seats in this section offer brilliant and unobstructed views. The seats are also comfortable and provide ample legroom.',
        quickInfo: [
          { icon: SeatIcon, label: '120 seats' },
          {
            icon: BinocularIcon,
            label: 'Best views from seats at the end of the row',
          },
          { icon: LegRoomSvg, label: 'Great legroom' },
        ],
        rows: 'Rows F-M',
      },
      'RearRight-DressCircle': {
        blockName: 'Rear Right',
        theatreSectionName: 'Dress Circle',
        theatreSectionLabel: 'Rows F-M',
        description:
          'The stage may seem quite far but the steeped seating ensures good views from most seats. The seats towards the aisle on the right provide great legroom. Note that some of the stage may be obstructed due to the Grand Circle overhang.',
        quickInfo: [
          { icon: SeatIcon, label: '50 seats' },
          { icon: BinocularIcon, label: 'Good views from Rows F-J' },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows F-M',
      },
      'FrontLeft-GrandCircle': {
        blockName: 'Front Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rows A-F',
        description:
          "The stage is far away but as the rows are steeply raked, the views are good but as the section is towards the left of the stage, some views of the stage are restricted. A large safety bar runs along the section's length, affecting the views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '60 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-F',
      },
      'FrontCentre-GrandCircle': {
        blockName: 'Front Centre',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rows A-G',
        description:
          "The stage is far away but as the rows are steeply raked, the views are still great & obstruction-free from most seats, especially in the middle. A large safety bar runs along the section's length, affecting the views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '119 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the front; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-G',
      },
      'FrontRight-GrandCircle': {
        blockName: 'Front Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rows A-F',
        description:
          "The stage is far away but as the rows are steeply raked, the views are good but as the section is towards the right of the stage, some views of the stage are restricted. A large safety bar runs along the section's length, affecting the views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '60 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows A-F',
      },
      'RearLeft-GrandCircle': {
        blockName: 'Rear Left',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rows H-L',
        description:
          "The stage is far away but as the rows are steeply raked, the views are good but as the section is towards the left of the stage, some views of the stage are restricted. A large safety bar runs along the section's length, affecting the views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '30 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows H-L',
      },
      'RearCentre-GrandCircle': {
        blockName: 'Rear Centre',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rows H-N',
        description:
          "The stage is far away but as the rows are steeply raked, the views are still great & obstruction-free from most seats, especially in the middle. A large safety bar runs along the section's length, affecting the views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '98 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the front; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows H-N',
      },
      'RearRight-GrandCircle': {
        blockName: 'Rear Right',
        theatreSectionName: 'Grand Circle',
        theatreSectionLabel: 'Rows H-L',
        description:
          "The stage is far away but as the rows are steeply raked, the views are good but as the section is towards the right of the stage, some views of the stage are restricted. A large safety bar runs along the section's length, affecting the views from some seats.",
        quickInfo: [
          { icon: SeatIcon, label: '30 seats' },
          {
            icon: BinocularIcon,
            label: 'Good views towards the aisle; far-off from the stage',
          },
          { icon: LegRoomSvg, label: 'Decent legroom' },
        ],
        rows: 'Rows H-L',
      },
    },
  },
  availableShowsTgid: {
    [THEATRE_TYPES.ABBA_ARENA]: ['20045'],
  },
  seatMapSvgs: {
    [THEATRE_TYPES.ABBA_ARENA]: AbbaSeatMapSvg,
  },
};
