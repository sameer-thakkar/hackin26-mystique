/**
 * Converts Collection Card data object to the schema
 * compatible with FE to avoid cascading changes.
 * @param input Collection Card Object in New Schema
 * @param currentLang Current Language to put the slug in the right place
 * @returns Collection Card Object in Old Schema
 */
const mapNewToOldCollectionCard = (input: any, currentLang = 'EN') => {
  return {
    ...input,
    id: input.id,
    name: input.displayName,
    media: input.medias?.map(
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
      showRatings: !(input.ratings.count === 0 && input.ratings.value === 0),
    },
    startingPrice: input?.listingPrice,
    ratingsCount: input.ratings.count,
    averageRating: input.ratings.value,
    showRatings: !(input.ratings.count === 0 && input.ratings.value === 0),
    cityDisplayName: input.primaryCity?.displayName,
    cityCode: input.primaryCity?.code,
    ratingCount: input.ratings.count,
    urlSlugs: {
      [currentLang]: input.urlSlug,
    },
    cardImageUrl: input.medias?.[0]?.url,
    subtext: input.content?.subtext,
    durationInMinutes: input.durationInMinutes,
    personaAffinityTags: input.personas.map((persona: any) => ({
      ...persona,
      name: persona.displayName,
    })),
  };
};

export default mapNewToOldCollectionCard;
