import { createClient } from 'prismicio';
import { predicate } from '@prismicio/client';
import type { NumberField } from '@prismicio/types';
import { ShowpageDocument } from 'types.prismic';
import {
  getObject,
  parseShowPageData,
} from 'components/ShowPages/parseShowPage';
import { getHeadoutLanguagecode, getPrimarySubCategoryIdData } from 'utils';
import { fetchMediaResource } from 'utils/apiUtils';
import { sendLog } from 'utils/logger';
import { allShowPagesGq } from 'utils/prismicUtils/microsite/graphQuery';
import {
  generateDescriptor,
  standardizeCancellationPolicy,
} from 'utils/productUtils';
import { getEncodedUrlSlugs } from 'utils/urlUtils';
import { CURRENCY_SYMBOL_MAP } from 'const/currency';
import { DESIGN, PRISMIC_DEV_TAG } from 'const/index';
import { TProduct } from '../categoryTourListParserV2/interface';

type TGetProductData = {
  allData: [];
  allTgids: number[][];
  lang: string;
  localizedStrings: Record<string, any>;
  MBDesign: string;
  primarySubCategoryID?: NumberField;
  currencyObject?: Record<string, string | number | null>;
};

const getProductData = async ({
  allData,
  allTgids,
  lang,
  localizedStrings,
  MBDesign,
  primarySubCategoryID,
  currencyObject,
}: TGetProductData) => {
  let finalObj: Record<string, any> = {},
    data;

  if (allData?.length) {
    const tgids = allTgids?.flat();
    const tgidSet = new Set(tgids);

    let verticalImagesDataMap = new Map<string, any>();
    const mediaData = await fetchMediaResource({
      language: getHeadoutLanguagecode(lang),
      resourceType: 'MB_EXPERIENCE',
      entityIds: tgids?.join(','),
    });
    mediaData?.resourceEntityMedias?.forEach((resource) => {
      const verticalImageData = resource.medias.find(
        (media) => media.type === 'IMAGE'
      );
      if (verticalImageData) {
        verticalImagesDataMap.set(
          resource.resourceEntityId,

          {
            url: verticalImageData.url,
            height: verticalImageData.metadata.height,
            width: verticalImageData.metadata.width,
            altText: verticalImageData.metadata.altText,
          }
        );
      }
    });

    let showpageData: Record<number, string> = {};
    let showpages: ShowpageDocument[] | never[] = [];

    try {
      const prismicClient = createClient();
      showpages = await prismicClient.getAllByType('showpage', {
        pageSize: 100,
        ...(lang && { lang }),
        graphQuery: allShowPagesGq,
        predicates: [
          predicate.not(`document.tags`, [PRISMIC_DEV_TAG]),
          predicate.any('my.showpage.tgid', Array.from(tgidSet)),
        ],
      });
    } catch (error) {
      sendLog({
        err: error,
        message: '[categoryTourListParserV2] allShowPages fetch failed',
      });
    }

    for (const page of showpages ?? []) {
      const {
        uid,
        data: { tgid },
      } = page || { data: {} };
      showpageData[tgid as number] = uid;
    }

    const tgidsWithShowPages = Object.keys(showpageData);
    const hasShowPageData = !!tgidsWithShowPages.length;

    allData?.forEach((c: any) => {
      const { collection, category, subCategory, items } = c || {};
      const { id: categoryId } = collection || category || subCategory || {};

      let itemsToRender = items;
      if (MBDesign !== DESIGN.V3) {
        itemsToRender = items?.filter((product: TProduct) =>
          tgidsWithShowPages.includes(String(product.id))
        );
      }
      finalObj[categoryId] = itemsToRender?.map((product: TProduct) => {
        const {
          microBrandsDescriptor,
          descriptors: secondaryDescriptors,
          listingPrice,
          allTags,
          name,
          imageUrl,
          id,
          averageRating,
          reviewCount,
          ratingCount,
          primaryCollection,
          primaryCategory,
          primarySubCategory,
          cancellationPolicy,
          cancellationPolicyV2,
          reschedulePolicy,
          ticketValidity,
          minDuration,
          maxDuration,
          combo,
          multiVariant,
          urlSlugs,
          media,
          flowType,
        } = product || {};
        const { displayName: collectionName } = primaryCollection || {};
        const { displayName: primaryCategoryName } = primaryCategory || {};
        const { displayName: primarySubCategoryName } =
          primarySubCategory || {};
        const {
          urlSlugs: _primaryCategoryUrlSlugs,
          ...primaryCategoryWithoutSlugs
        } = primaryCategory ?? {};
        const {
          urlSlugs: _primarySubCategoryUrlSlugs,
          ...primarySubCategoryWithoutSlugs
        } = primarySubCategory ?? {};
        const {
          finalPrice,
          originalPrice,
          currencyCode,
        }: {
          finalPrice: number;
          originalPrice: number;
          currencyCode: string;
        } = listingPrice || {};
        const currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode as keyof {}];
        const mbDescriptors = generateDescriptor({
          v2Descriptors: microBrandsDescriptor,
          lang: 'en',
          isEntertainmentMb: true,
        });
        let { microBrandsHighlight } = product ?? {};

        microBrandsHighlight = standardizeCancellationPolicy({
          highlights: microBrandsHighlight,
          cancellationPolicy: cancellationPolicyV2 ?? cancellationPolicy,
          reschedulePolicy,
          ticketValidity,
          showValidity: false,
          lang: getHeadoutLanguagecode(lang),
          localizedStrings,
        });

        const filterHighlights = [
          localizedStrings.SHOW_PAGE.THEATRE_NAME,
          localizedStrings.SHOW_PAGE.SHOW_TIMINGS,
          localizedStrings.SHOW_PAGE.DURATION,
          localizedStrings.SHOW_PAGE.YOUR_TICKETS,
          localizedStrings.SHOW_PAGE.CANCELLATION_POLICY,
          localizedStrings.SHOW_PAGE.AGE_LIMIT,
        ];
        const { listicleSchema, hasSpecialOffer } =
          parseShowPageData(microBrandsHighlight);
        let listicleShowSummary, listicleWhyWatch;

        for (let item of listicleSchema) {
          const heading = item['heading'];
          if (heading === localizedStrings.SHOW_PAGE.LISTICLE_SHOW_WHY_WATCH) {
            listicleWhyWatch = item;
          }
          if (heading === localizedStrings.SHOW_PAGE.LISTICLE_SHOW_SUMMARY) {
            listicleShowSummary = item;
          }
        }

        const { detailsObjects: highlights, isSafetyBanner: hasBestSafety } =
          getObject(microBrandsHighlight, filterHighlights) || {};
        const { detailsObjects: reopeningDate } =
          getObject(microBrandsHighlight, [
            localizedStrings.SHOW_PAGE.OPENING_DATE,
            localizedStrings.SHOW_PAGE.CLOSING_DATE,
          ]) || {};

        const contentBlocks: any = {
          hidden: [],
          left: [],
          right: [],
        };
        for (const key of filterHighlights) {
          const isLeftBlock = [
            localizedStrings.SHOW_PAGE.THEATRE_NAME,
            localizedStrings.SHOW_PAGE.SHOW_TIMINGS,
            localizedStrings.SHOW_PAGE.DURATION,
          ].includes(key);
          const value = highlights[key];
          const block = {
            label: value ? key : null,
            content: value ? value : null,
            align: isLeftBlock ? 'left' : 'right',
            len: value?.length,
            labelId: key?.toLowerCase()?.split(' ')?.join('-'),
          };
          isLeftBlock
            ? contentBlocks?.left?.push(block)
            : contentBlocks?.right?.push(block);
        }

        const { productImages } = media || {};
        const [, descriptionImage] = productImages || [];
        const verticalImage = verticalImagesDataMap.get(String(id));
        return {
          title: name,
          highlights: microBrandsHighlight,
          primaryCollection,
          primaryCategory: primaryCategoryWithoutSlugs,
          primarySubCategory: primarySubCategoryWithoutSlugs,
          descriptors: mbDescriptors,
          secondaryDescriptors,
          productHighlights: null,
          cardFooter: null,
          theater: null,
          content_theater: null,
          contentBlocks,
          productImage: imageUrl,
          descriptionImage:
            productImages?.length > 1 ? descriptionImage?.url : imageUrl,
          price: finalPrice,
          flowType,
          scratchPrice: originalPrice,
          currencySymbol,
          tgid: id,
          images: productImages,
          averageRating,
          reviewCount,
          ratingCount,
          ctaBooster: null,
          description: null,
          available: !!listingPrice?.finalPrice,
          overlayBooster: null,
          vendor: null,
          allTags,
          reopeningDate: reopeningDate[localizedStrings.SHOW_PAGE.OPENING_DATE],
          closingDate: reopeningDate[localizedStrings.SHOW_PAGE.CLOSING_DATE],
          hasBestSafety,
          category: {
            collectionName,
            primaryCategoryName,
            primarySubCategoryName,
          },
          microBrandsHighlight: highlights,
          listingPrice,
          safetyImages: null,
          showPageUid: hasShowPageData ? showpageData[id] : null,
          listicleShowSummary,
          listicleWhyWatch,
          hasSpecialOffer,
          minDuration,
          maxDuration,
          combo,
          multiVariant,
          urlSlugs: getEncodedUrlSlugs(urlSlugs),
          verticalImage,
          primarySubCategoryIdData: {
            ...(getPrimarySubCategoryIdData(primarySubCategoryID, allData) ||
              {}),
          },
        };
      });
    });
    data = { ...finalObj, activeCurrency: currencyObject };
  }
  return data;
};

export default getProductData;
