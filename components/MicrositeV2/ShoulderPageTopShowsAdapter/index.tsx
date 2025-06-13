import React from 'react';
import TopShowsSection from 'components/MicrositeV2/EntertainmentMBLandingPageV2/TopShowsSection';

/**
 * ⚠️ HOTFIX COMPONENT - DO NOT USE ANYWHERE ELSE ⚠️
 *
 * Owner: @asimkt
 *
 * This is a temporary adapter component created specifically for the discount-west-end-tickets
 * shoulder page to hotfix a production issue. It converts ProductsWrapper props to work with
 * TopShowsSection component.
 *
 * What this component does:
 * 1. Takes ProductsWrapper props (kept for backward compatibility)
 * 2. Converts allTours object to topShows array format expected by TopShowsSection
 * 3. Transforms categoryProps to categoriesToRender format
 * 4. Renders TopShowsSection with "London Calling Sale" hardcoded heading
 * 5. Applies main-wrapper styling with top padding
 *
 * ⚠️ WARNING: This is a HOTFIX - do not reuse this component elsewhere!
 * ⚠️ This should be replaced with a proper solution in the future.
 */

interface ShoulderPageTopShowsAdapterProps {
  directTgid: number;
  allTours: Record<string, any>;
  isMobile: boolean;
  categoryProps: {
    categories: Array<{
      id: number;
      name: string;
      rank: number;
      ranking: {
        popularity: number[];
        price: number[];
      };
    }>;
    active: number;
    hideSortBySelector: boolean;
  };
  isListicle: boolean;
}

// This is a temporary component to hotfix the production issue
const ShoulderPageTopShowsAdapter: React.FC<
  ShoulderPageTopShowsAdapterProps
> = ({ directTgid, allTours, isMobile, categoryProps, isListicle }) => {
  // Convert allTours object to topShows array format
  const topShowsRaw = Object.values(allTours).filter(Boolean);

  // Sort shows by popularity ranking
  const popularityRanking =
    categoryProps?.categories?.[0]?.ranking?.popularity || [];
  const topShows = topShowsRaw.sort((a, b) => {
    const aIndex = popularityRanking.indexOf(a.tgid);
    const bIndex = popularityRanking.indexOf(b.tgid);

    // If both shows are in the popularity ranking, sort by their position
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // If only one show is in the ranking, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // If neither show is in the ranking, maintain original order
    return 0;
  });

  // Convert categoryProps to categoriesToRender format
  const categoriesToRender = categoryProps?.categories || [];

  // Determine if we should show browse by categories
  const showBrowseByCategories = categoriesToRender.length > 1 && !isListicle;

  // Check if this is a category page
  const isCategoryPage = categoryProps?.categories?.length === 1 && !isListicle;

  //   negative margin to compensate for the padding from next section
  return (
    <div
      className="main-wrapper"
      style={{ padding: '2rem 0 0', marginBottom: '-2rem', width: '100%' }}
    >
      <TopShowsSection
        isMobile={isMobile}
        topShows={topShows}
        categoriesToRender={categoriesToRender}
        heading={'London Calling Sale'}
        showBrowseByCategories={showBrowseByCategories}
        isCategoryPage={isCategoryPage}
        directTgid={directTgid}
      />
    </div>
  );
};

export default ShoulderPageTopShowsAdapter;
