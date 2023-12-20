import React from 'react';
import dynamic from 'next/dynamic';
import { WrapInLazyComponent } from 'components/common/LazyComponent';
import BestDiscount from 'components/shortcodes/BestDiscount';
import DynamicDate from 'components/shortcodes/DynamicDate';
import MinPrice from 'components/shortcodes/MinPrice';
import { getRichtextElements } from 'utils/shortcodeUtils';
import { SHORT_CODE_TYPES } from 'const/index';

const InlinePrice = dynamic(() => import('components/InlinePrice'));
const NextAvailable = dynamic(() =>
  import('components/shortcodes/NextAvailable')
);
const InlineInvPrice = dynamic(() => import('components/InlineInvPrice'));
const CTA = dynamic(() => import('components/shortcodes/CTA'));
const Booster = dynamic(() => import('components/Booster'));
const RatingBoosterCombo = dynamic(() =>
  import('components/shortcodes/RatingBoosterCombo')
);
const PopupTrigger = dynamic(() =>
  import('components/shortcodes/PopupTrigger')
);
const IFrame = dynamic(() => import('components/shortcodes/IFrame'));
const Cross = dynamic(() => import('components/shortcodes/Cross'));
const Check = dynamic(() => import('components/shortcodes/Check'));
const SpotifyPlayer = dynamic(() =>
  import('components/shortcodes/SpotifyPlayer')
);
const Notes = dynamic(() => import('components/shortcodes/Notes'));

const Train = dynamic(() => import('components/shortcodes/Train'));
const Bus = dynamic(() => import('components/shortcodes/Bus'));
const Car = dynamic(() => import('components/shortcodes/Car'));
const Plane = dynamic(() => import('components/shortcodes/Plane'));
const Ship = dynamic(() => import('components/shortcodes/Ship'));
const Snow = dynamic(() => import('components/shortcodes/Snow'));
const Location = dynamic(() => import('components/shortcodes/Location'));
const Timings = dynamic(() => import('components/shortcodes/Timings'));
const Map = dynamic(() => import('components/shortcodes/Map'));
const Weather = dynamic(() => import('components/shortcodes/Weather'));
const Rain = dynamic(() => import('components/shortcodes/Rain'));
const Drizzle = dynamic(() => import('components/shortcodes/Drizzle'));
const Distance = dynamic(() => import('components/shortcodes/Distance'));
const Calendar = dynamic(() => import('components/shortcodes/Calendar'));
const Ticket = dynamic(() => import('components/shortcodes/Ticket'));
type ComponentType<TProps = {}> =
  | React.ComponentClass<TProps>
  | React.FunctionComponent<TProps>
  | React.ComponentType<TProps>;

interface ShortCodeDictionary {
  [key: string]: {
    component?: ComponentType<any>;
    function?: Function;
    type?: string;
  };
}

const shortCodesDict: ShortCodeDictionary = {
  price: {
    component: InlinePrice,
  },
  'min-price': {
    function: MinPrice,
    type: SHORT_CODE_TYPES.FUNCTION,
  },
  'best-discount': {
    function: BestDiscount,
    type: SHORT_CODE_TYPES.FUNCTION,
  },
  'next-available': {
    component: NextAvailable,
  },
  booster: {
    component: Booster,
  },
  'inv-price': {
    component: InlineInvPrice,
  },
  cta: {
    component: CTA,
  },
  'rating-cta': {
    component: RatingBoosterCombo,
  },
  popup: {
    component: PopupTrigger,
  },
  iframe: {
    component: IFrame,
  },
  cross: {
    component: Cross,
  },
  check: {
    component: Check,
  },
  date: {
    function: DynamicDate,
    type: SHORT_CODE_TYPES.FUNCTION,
  },
  'spotify-player': {
    component: SpotifyPlayer,
    type: SHORT_CODE_TYPES.COMPONENT,
  },
  notes: {
    component: Notes,
    type: SHORT_CODE_TYPES.COMPONENT,
  },
  train: {
    component: Train,
  },
  bus: {
    component: Bus,
  },
  car: {
    component: Car,
  },
  plane: {
    component: Plane,
  },
  ship: {
    component: Ship,
  },
  snow: {
    component: Snow,
  },
  location: {
    component: Location,
  },
  address: {
    component: Location,
  },
  ticket: {
    component: Ticket,
  },
  drizzle: {
    component: Drizzle,
  },
  rain: {
    component: Rain,
  },
  weather: {
    component: Weather,
  },
  season: {
    component: Weather,
  },
  sun: {
    component: Weather,
  },
  map: {
    component: Map,
  },
  calendar: {
    component: Calendar,
  },
  distance: {
    component: Distance,
  },
  timings: {
    component: Timings,
  },
  duration: {
    component: Timings,
  },
};

const getAllAttributes = (attributesString: any) => {
  let attributePattern = /([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/g;
  attributesString = attributesString.replace(/[\u00a0\u200b]/g, ' ');

  let named = {};
  let numeric = [];
  let match;
  while ((match = attributePattern.exec(attributesString))) {
    if (match[1]) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      named[match[1].toLowerCase()] = match[2];
    } else if (match[3]) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      named[match[3].toLowerCase()] = match[4];
    } else if (match[5]) {
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      named[match[5].toLowerCase()] = match[6];
    } else if (match[7]) {
      numeric.push(match[7]);
    } else if (match[8]) {
      numeric.push(match[8]);
    }
  }
  return {
    named,
    numeric,
  };
};

const returnShortcodeObject = (
  name: any,
  indexStart: any,
  indexEnd: any,
  attributesNamed = {},
  attributesNumeric = [],
  content = ''
) => {
  return {
    attributes: {
      named: attributesNamed,
      numeric: attributesNumeric,
    },
    content,
    indices: {
      end: indexEnd,
      start: indexStart,
    },
    name,
  };
};

const getShortcodesList = (stringToSearch: any) => {
  const findShortcodeRegExp = new RegExp(
    '\\{(\\{?)(' +
      Object.keys(shortCodesDict).join('|') +
      ')(?![\\w-])([^\\}\\/]*(?:\\/(?!\\})[^\\}\\/]*)*?)(?:(\\/)\\}|\\}(?:([^\\{]*(?:\\{(?!\\/\\2\\})[^\\{]*)*)(\\{\\/\\2\\}))?)(\\}?)',
    'g'
  );
  let match;
  let matches = [];
  while ((match = findShortcodeRegExp.exec(stringToSearch)) !== null) {
    if (match[1] === '{' && match[7] === '}') {
      continue;
    }
    let matchIndex = match.index;
    let matchLastIndex = findShortcodeRegExp.lastIndex - 1;
    if (match[1]) {
      matchIndex++;
    }
    if (match[7]) {
      matchLastIndex--;
    }
    const shortcodeAttributes = getAllAttributes(match[3]);
    matches.push(
      returnShortcodeObject(
        match[2],
        matchIndex,
        matchLastIndex,
        shortcodeAttributes['named'],
        // @ts-expect-error TS(2345): Argument of type 'string[]' is not assignable to p... Remove this comment to see the full error message
        shortcodeAttributes['numeric'],
        match[5]
      )
    );
  }
  return matches;
};

export const renderShortCodes = (CMSString = '', props = {}): Array<string> => {
  if (!CMSString) return [];

  let shortCodesList = getShortcodesList(CMSString);
  let fullLength = CMSString.length;
  let renderedRichList = [];
  let cursor = -1;
  shortCodesList.forEach((shortCodeObj, index) => {
    renderedRichList.push(
      CMSString.slice(cursor + 1, shortCodeObj.indices.start)
    );
    let shortcodeElement = null;
    if (shortCodesDict[shortCodeObj.name].type === SHORT_CODE_TYPES.FUNCTION) {
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      shortcodeElement = shortCodesDict[shortCodeObj.name].function(
        {
          ...shortCodeObj.attributes.named,
        },
        props
      );
    } else {
      shortcodeElement = React.createElement(
        // @ts-expect-error TS(2769): No overload matches this call.
        shortCodesDict[shortCodeObj.name].component,
        {
          ...shortCodeObj.attributes.named,
          key: index,
          parentProps: props,
        }
      );
    }
    renderedRichList.push(shortcodeElement);
    cursor = shortCodeObj.indices.end;
  });
  renderedRichList.push(CMSString.slice(cursor + 1, fullLength));
  return renderedRichList;
};

const tagsMap = {
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading5: 'h5',
  heading6: 'h6',
  span: 'span',
  paragraph: 'p',
  strong: 'strong',
  em: 'i',
};

const propsWithUniqueKey = function (props: any, key: any) {
  return Object.assign(props || {}, { key });
};

export const shortCodeSerializer: any = (
  type: any,
  element: any,
  content: any,
  children: any,
  key: any,
  parentProps: any
) => {
  let props = {};
  if (getShortcodesList(content).length && !children.length) {
    let renderedChildrens: any = renderShortCodes(content, parentProps);
    renderedChildrens = WrapInLazyComponent(renderedChildrens);
    return React.createElement(
      // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      tagsMap[type] || React.Fragment,
      propsWithUniqueKey(props, key),
      renderedChildrens
    );
  }
  return getRichtextElements({ type, element, children });
};

export const shortCodeSerializerWithParentProps = (
  defaultArgs: any,
  parentProps: any
) => {
  return shortCodeSerializer(
    defaultArgs[0],
    defaultArgs[1],
    defaultArgs[2],
    defaultArgs[3],
    defaultArgs[4],
    parentProps
  );
};
export default renderShortCodes;
