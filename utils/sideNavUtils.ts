import { SLICE_TYPES } from 'const/index';
import { strings } from 'const/strings';

const sideNavHandler = (slices: any) => {
  const sideNavItems: Array<string> = [];
  slices?.forEach((slice: any) => {
    switch (slice?.slice_type) {
      case SLICE_TYPES.RICH_TEXT:
      case SLICE_TYPES.RICH_TEXT_ONLY:
        slice?.items?.[0]?.text?.forEach((el: TRichTextArray) => {
          el.type === 'heading2' && sideNavItems.push(el?.text);
        });
        break;
      case SLICE_TYPES.MICROBRAND_CARDS:
        slice?.primary?.content_above_cards?.forEach(
          (el: TRichTextArray) =>
            el.type === 'heading2' && sideNavItems.push(el?.text)
        );
        slice?.primary?.content_below_cards?.forEach(
          (el: TRichTextArray) =>
            el.type === 'heading2' && sideNavItems.push(el?.text)
        );
        break;
      case SLICE_TYPES.CARD_CAROUSEL:
        slice?.primary?.carousel_heading?.forEach(
          (el: TRichTextArray) =>
            el.type === 'heading2' && sideNavItems.push(el?.text)
        );
        break;
      case SLICE_TYPES.CUSTOM_LINKED_TOURS:
        slice?.primary?.content?.forEach(
          (el: TRichTextArray) =>
            el.type === 'heading2' && sideNavItems.push(el?.text)
        );
        break;
      case SLICE_TYPES.IMAGE_TEXT_COMBO_GRID:
        slice?.items?.forEach((el: Record<string, any>) => {
          sideNavItems.push(el?.card_title);
        });
        break;
      case SLICE_TYPES.TAB_WRAPPER_START:
      case SLICE_TYPES.TABLE_V2_START:
      case SLICE_TYPES.TICKET_CARDS:
      case SLICE_TYPES.REVIEWS:
      case SLICE_TYPES.INTERNAL_CONTENT_CARD:
      case SLICE_TYPES.SHOULDER_PAGE_TICKET_CARD:
      case SLICE_TYPES.FULL_WIDTH_ACTION_CARD:
        sideNavItems.push(slice?.primary?.title);
        break;
      case SLICE_TYPES.CARD_SECTION_START:
        sideNavItems.push(slice?.primary?.card_section_title);
        break;
      case SLICE_TYPES.IMAGE_GALLERY:
      case SLICE_TYPES.ACCORDION:
      case SLICE_TYPES.CAROUSEL_GALLERY:
        sideNavItems.push(slice?.primary?.heading);
        break;
      case SLICE_TYPES.IMAGE_LINKS_CAROUSEL:
        sideNavItems.push(slice?.primary?.carousel_heading);
        break;
      case SLICE_TYPES.LISTICLE_SECTION_START:
      case SLICE_TYPES.AUTOMATED_COMPARISION_TABLE:
        sideNavItems.push(slice?.primary?.section_title);
        break;
      case SLICE_TYPES.UGC_CAROUSEL:
        sideNavItems.push(slice?.primary?.title || strings.UGC.HEADING);
        break;
      case SLICE_TYPES.TABLE:
        sideNavItems.push(slice?.primary?.table_heading);
        break;
      default:
    }
  });
  return sideNavItems.filter(Boolean);
};

export default sideNavHandler;
