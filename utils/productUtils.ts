import { RichText } from 'prismic-reactjs';
import { THEMES } from 'constants/index';
export const extractTabsFromHighlights = (highlights) => {
  let tabs = [];
  const nonTabHighlights = highlights.reduce((acc, highlight) => {
    if (highlight.type === 'heading6') {
      tabs.push({
        type: 'tab',
        heading: RichText.asText([highlight]),
        contents: [],
      });
      return acc;
    }
    if (tabs.length) {
      tabs[tabs.length - 1].contents.push(highlight);
      return acc;
    } else return [...acc, highlight];
  }, []);
  return { highlights: nonTabHighlights, tabs };
};

export const getProductCardLayout = ({
  mbTheme,
  hasSafetyFlag,
  isDFProduct,
  hasOffer,
  hasV1Booster,
  hasShortSummary,
}) => {
  let layout = { desktop: [], mobile: [] };
  const hasIconBoosters = hasSafetyFlag || isDFProduct;
  switch (mbTheme) {
    case THEMES.MIN_BLUE:
      layout = {
        desktop: [
          'title cta-combo',
          hasIconBoosters && 'icon-booster cta-combo',
          hasOffer && 'offer cta-combo',
          hasV1Booster && 'booster cta-combo',
          (!hasOffer || !hasV1Booster) && '. cta-combo',
          'line line',
          'tags tags',
          'body body',
        ],
        mobile: [
          'title',
          'tags',
          'price-block',
          hasIconBoosters && 'icon-booster',
          hasOffer && 'offer',
          hasV1Booster && 'booster ',
          'body',
          'cta-block',
          'next-available',
        ],
      };
      break;
    case THEMES.DEF_INTERIM:
      layout = layout = {
        desktop: [
          'title line cta-combo',
          hasShortSummary && 'summary line cta-combo',
          hasIconBoosters && 'icon-booster line cta-combo',
          hasOffer && 'offer line cta-combo',
          hasV1Booster && 'booster line cta-combo',
          'body line cta-combo',
          ((!hasV1Booster && !hasOffer) || !hasShortSummary) &&
            '. line cta-combo',
        ],
        mobile: [
          'title title',
          'next-available next-available',
          `price-block ${hasIconBoosters ? 'icon-booster' : 'price-block'}`,
          hasOffer && 'offer offer',
          'summary summary',
          'tags tags',
          hasV1Booster && 'booster booster',
          'body body',
          'cta-block cta-block',
        ],
      };
      break;
    case THEMES.DEFAULT:
    default:
      layout = {
        desktop: [
          'title cta-combo',
          'tags cta-combo',
          hasIconBoosters && 'icon-booster cta-combo',
          hasOffer && 'offer cta-combo',
          hasV1Booster && 'booster cta-combo',
          'line line',
          'body body',
        ],
        mobile: [
          'title',
          'tags',
          'price-block',
          hasIconBoosters && 'icon-booster',
          hasOffer && 'offer',
          hasV1Booster && 'booster ',
          'body',
          'cta-block',
          'next-available',
        ],
      };
  }
  layout = {
    mobile: layout.mobile.filter((row) => row),
    desktop: layout.desktop.filter((row) => row),
  };

  return layout;
};

export const parseDescriptorIcon = (str) => {
  const baseURL = 'https://cdn-imgix-open.headout.com/mb-icons/';
  const {
    icon,
    descriptor,
    ext = 'svg',
  } = /(\{(?<icon>[\S]*)((\s*)?ext=(['"])?(?<ext>[^"'\s]*)?\S*?)?(\s*)?\})?(\s*)(?<descriptor>.*)/g.exec(
    str
  )?.groups;
  return {
    icon: icon ? `${baseURL}${icon}.${ext}` : null,
    descriptor,
  };
};
