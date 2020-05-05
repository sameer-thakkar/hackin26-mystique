import React from 'react';
import InlinePrice from '../components/InlinePrice';
import NextAvailable from '../components/shortcodes/NextAvailable';
import InlineInvPrice from '../components/InlineInvPrice';
import CTA from '../components/shortcodes/CTA';
import Booster from '../components/Booster';
import RatingBoosterCombo from '../components/shortcodes/RatingBoosterCombo';
import PopupTrigger from '../components/shortcodes/PopupTrigger';
import IFrame from '../components/shortcodes/IFrame';
import { WrapInLazyComponent } from '../components/common/LazyComponent';

interface ShortCodeDictionary {
  [key: string]: {
    component: React.ComponentClass | React.FunctionComponent;
  };
}

const shortCodesDict: ShortCodeDictionary = {
  price: {
    component: InlinePrice,
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
};

const getAllAttributes = (attributesString) => {
  let attributePattern = /([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|(\S+)(?:\s|$)/g;
  attributesString = attributesString.replace(/[\u00a0\u200b]/g, ' ');

  let named = {};
  let numeric = [];
  let match;
  while ((match = attributePattern.exec(attributesString))) {
    if (match[1]) {
      named[match[1].toLowerCase()] = match[2];
    } else if (match[3]) {
      named[match[3].toLowerCase()] = match[4];
    } else if (match[5]) {
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
  name,
  indexStart,
  indexEnd,
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

const getShortcodesList = (stringToSearch) => {
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
        shortcodeAttributes['numeric'],
        match[5]
      )
    );
  }
  return matches;
};

const renderShortCodes = (CMSString, props = {}) => {
  let shortCodesList = getShortcodesList(CMSString);
  let fullLength = CMSString.length;
  let renderedRichList = [];
  let cursor = -1;
  shortCodesList.forEach((shortCodeObj, index) => {
    renderedRichList.push(
      CMSString.slice(cursor + 1, shortCodeObj.indices.start)
    );
    renderedRichList.push(
      React.createElement(shortCodesDict[shortCodeObj.name].component, {
        ...shortCodeObj.attributes.named,
        key: index,
        parentProps: props,
      })
    );
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

const propsWithUniqueKey = function (props, key) {
  return Object.assign(props || {}, { key });
};

export const shortCodeSerializer = (
  type,
  element,
  content,
  children,
  key,
  parentProps
) => {
  let props = {};
  if (getShortcodesList(content).length && !children.length) {
    let renderedChildrens: any = renderShortCodes(content, parentProps);
    renderedChildrens = WrapInLazyComponent(renderedChildrens);
    return React.createElement(
      tagsMap[type] || React.Fragment,
      propsWithUniqueKey(props, key),
      renderedChildrens
    );
  }

  return null;
};

export const shortCodeSerializerWithParentProps = (
  defaultArgs,
  parentProps
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
