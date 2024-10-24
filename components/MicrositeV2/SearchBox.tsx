import React, { useCallback, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import Fuse from 'fuse.js';
import Conditional from 'components/common/Conditional';
import InteractionContext from 'contexts/Interaction';
import { trackEvent } from 'utils/analytics';
import { searchQueryAtom } from 'store/atoms/searchQuery';
import COLORS from 'const/colors';
import { ANALYTICS_EVENTS, ANALYTICS_PROPERTIES } from 'const/index';
import { strings } from 'const/strings';
import { expandFontToken } from 'const/typography';
import CloseWhite from 'assets/closeWhite';
import SearchIcon from 'assets/searchIcon';

const StyledSearchBox = styled.div<{
  isEntertainmentMb?: boolean;
  isEntertainmentLandingPageVisible: boolean;
  isDarkMode?: boolean;
}>`
  position: relative;

  input {
    ${({ isEntertainmentLandingPageVisible, isDarkMode }) => {
      return isEntertainmentLandingPageVisible && isDarkMode
        ? `
      background: rgba(255, 255, 255, 0.12);
      border: none;
      `
        : `
          border: 1px solid ${COLORS.GRAY.G6};

      `;
    }};
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '0.563rem 0' : '0.75rem 0'};
    outline: none;
    padding-left: ${({ isEntertainmentLandingPageVisible }) =>
      isEntertainmentLandingPageVisible ? '1.5rem' : ' 2.5rem'};
    padding-right: ${({ isEntertainmentLandingPageVisible }) =>
      isEntertainmentLandingPageVisible ? '2rem' : ' 2.25rem'};
    border-radius: ${({ isEntertainmentLandingPageVisible }) =>
      isEntertainmentLandingPageVisible ? '0.5rem' : ' 0.25rem'};
    width: calc(100% - 2.5rem);
    min-width: 13rem;
    ${expandFontToken('UI/Label Medium')};
    font-size: 1rem;

    ::placeholder {
      opacity: 1;
      ${({ isEntertainmentMb, isDarkMode }) =>
        isEntertainmentMb && isDarkMode
          ? `color: ${COLORS.GRAY.G5}; `
          : `color: ${COLORS.GRAY.G3};`};
    }

    ${({ isDarkMode }) => isDarkMode && `color: ${COLORS.BRAND.WHITE};`}

    ${({ isEntertainmentMb }) =>
      isEntertainmentMb &&
      `
        font-size: 0.938rem;
        line-height: 1.25rem;
        `};
  }

  .input-icon {
    position: absolute;
    left: ${({ isEntertainmentLandingPageVisible }) =>
      !isEntertainmentLandingPageVisible && '1rem'};
    right: ${({ isEntertainmentLandingPageVisible }) =>
      isEntertainmentLandingPageVisible && '0'};
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;

    svg {
      stroke: ${COLORS.GRAY.G3};
      height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '1.25rem' : '1.125rem'};
    }

    path {
      stroke: ${({ isEntertainmentLandingPageVisible, isDarkMode }) =>
        isEntertainmentLandingPageVisible && isDarkMode
          ? COLORS.BRAND.WHITE
          : COLORS.GRAY.G3};
    }
  }

  .close-icon {
    position: absolute;
    right: -1.495rem;
    display: ${({ isEntertainmentLandingPageVisible }) =>
      isEntertainmentLandingPageVisible ? 'none' : 'flex'};
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;

    svg {
      height: 1rem;
      width: auto;

      path {
        stroke: ${COLORS.GRAY.G2};
      }
    }
  }

  @media (max-width: 768px) {
    input {
      min-width: unset;
      border-radius: 0.25rem;
      padding: 0.625rem 0;
      padding-left: 2.25rem;
    }

    .input-icon {
      left: 0.656rem;
    }

    .close-icon {
      display: none;

      svg {
        height: 1.25rem;
      }
    }
  }
`;

export const SearchBox = (props: any) => {
  let interactionContext: any = useContext(InteractionContext);
  const {
    handleResults,
    allToursArray,
    clearSearch,
    isEntertainmentMb,
    isMobile,
    isEntertainmentLandingPageVisible,
    isDarkMode,
    onEscapePress,
  } = props || {};
  const [query, setQuery] = useRecoilState(searchQueryAtom);
  const fuse = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(
    (str: any) => {
      setQuery(str);
      if (str.length >= 3) {
        if (interactionContext?.activeTour?.tgid)
          interactionContext?.closeTour?.();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        const results = fuse.current.search(str);
        handleResults(results.slice(0, 5));

        trackEvent({
          eventName: 'Search Suggestions Viewed',
          [ANALYTICS_PROPERTIES.SEARCH_QUERY]: str,
        });
      } else {
        handleResults([]);
      }
    },
    [interactionContext, handleResults]
  );

  const handleClearSearch = useCallback(() => {
    search('');
  }, [search]);

  useEffect(() => {
    const opts = {
      shouldSort: true,
      threshold: 0.4,
      distance: 150,
      keys: ['title', 'name', 'baseLangTitle'],
    };
    const searchableTours = allToursArray
      ?.filter((tour: any) => tour.available || tour.listingPrice)
      ?.map((tour: any) => {
        const { showPageUid } = tour;
        if (!showPageUid) return tour;
        const baseLangTitle = showPageUid.split('.').pop().replace(/-/g, ' ');
        return {
          ...tour,
          baseLangTitle,
        };
      });
    // @ts-expect-error TS(2322): Type 'Fuse<unknown, { shouldSort: boolean; thresho... Remove this comment to see the full error message
    fuse.current = new Fuse(searchableTours, opts);

    if (clearSearch) {
      handleClearSearch();
    }
  }, [allToursArray, clearSearch, handleClearSearch, fuse]);

  useEffect(() => {
    if (isMobile && inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <StyledSearchBox
      isEntertainmentMb={isEntertainmentMb}
      isEntertainmentLandingPageVisible={isEntertainmentLandingPageVisible}
      isDarkMode={isDarkMode}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={strings.SEARCH}
        value={query}
        onChange={(e) => {
          search(e.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (!onEscapePress || event.key !== 'Escape') {
            return;
          }

          onEscapePress();
        }}
        onFocus={() => {
          trackEvent({
            eventName: ANALYTICS_EVENTS.SEARCH_STARTED,
          });
        }}
      />
      <div className="input-icon">{SearchIcon}</div>
      <Conditional if={query.length > 0}>
        <div
          className="close-icon"
          role="button"
          tabIndex={0}
          onClick={() => {
            handleClearSearch();
          }}
        >
          {CloseWhite}
        </div>
      </Conditional>
    </StyledSearchBox>
  );
};
