import { EProductDescriptor } from 'components/Espeon/ProductCard/Descriptor/types';

/**
 * Converts Product Card data object to the schema
 * compatible with FE to avoid cascading changes.
 * @param input Product Card Object in New Schema
 * @param currentLang Current Language to put the slug in the right place
 * @returns Product Card Object in Old Schema
 */
const mapNewToOldProductCard = (input: any, currentLang = 'EN') => {
  const showRatings = !!(input.ratings?.count > 10);

  const { descriptors: combinedDescriptors } = input;
  const { standardDescriptors, inclusionBasedDescriptors } =
    combinedDescriptors.reduce(
      (acc: any, curr: any) => {
        // special case for Inclusion based descriptors
        if (
          curr.type === 'INCLUSION_BASED' ||
          curr.code === EProductDescriptor.GROUP_SIZE
        ) {
          const description = curr.description ?? '';
          curr.displayName = description || curr.displayName;
        } else if (curr.code === EProductDescriptor.DURATION) {
          // special case for duration, if description has a number, use it as displayName otherwise use the original displayName
          const description = curr.description ?? '';
          curr.displayName = /\d/.test(description)
            ? description
            : curr.displayName;
        }

        if (curr.type === 'STANDARD') {
          acc.standardDescriptors.push(curr);
        } else if (curr.type === 'INCLUSION_BASED') {
          acc.inclusionBasedDescriptors.push(curr);
        }
        return acc;
      },
      { standardDescriptors: [], inclusionBasedDescriptors: [] }
    );

  return {
    ...input,
    id: input.id,
    name: input.displayName,
    media: {
      productImages: input.medias?.map(
        (media: {
          url: any;
          type: any;
          metadata: {
            altText: any;
            videoDuration: any;
            uploadDate: any;
          };
        }) => ({
          url: media.url,
          type: media.type,
          metadata: {
            altText: media.metadata?.altText,
            height: null, // Add appropriate height if available
            width: null, // Add appropriate width if available
            videoDuration: media.metadata?.videoDuration,
            uploadDate: media.metadata?.uploadDate,
            filename: '', // Add appropriate filename if available
            fileSize: null, // Add appropriate file size if available
          },
          info: {
            sourceType: 'SOURCED', // Set sourceType as needed
            sourceUrl: '', // Add source URL if applicable
            credit: '', // Add credit if available
            filename: '', // Add filename if available
            fileSize: null, // Add file size if applicable
          },
        })
      ),
    },
    microBrandInfo: {
      descriptors: input.descriptors || null,
      highlights: null,
      supportedLanguages: [input.language],
      metaTitle: null,
      metaDescription: '',
    },
    ratingsInfo: {
      ratingsCount: input.ratings.count,
      averageRating: input.ratings.value,
      showRatings,
    },
    reviewsDetails: {
      ratingsCount: input.ratings.count,
      averageRating: input.ratings.value,
      showRatings,
    },
    ratingsCount: input.ratings.count,
    averageRating: input.ratings.value,
    showRatings,
    cityDisplayName: input.primaryCity?.displayName,
    cityCode: input.primaryCity?.code,
    ratingCount: input.ratings.count,
    startPoint: {
      latitude: null, // Add latitude if available
      longitude: null, // Add longitude if available
    },
    urlSlugs: {
      [currentLang]: input.urlSlug,
    },
    currencyCode: input.listingPrice?.currencyCode,
    standardDescriptors,
    inclusionBasedDescriptors,
    highlights: input.content.highlights,
    tourGroupUrl: input.urlSlug,
  };
};

export default mapNewToOldProductCard;
