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
import { CLOSE_WHITE, SEARCH_ICON } from 'assets/SvgIcons';

const StyledSearchBox = styled.div<{
  isEntertainmentMb?: boolean;
  isNewLTTLandingPageVisible: boolean;
  isDarkMode?: boolean;
}>`
  position: relative;

  input {
    ${({ isNewLTTLandingPageVisible, isDarkMode }) => {
      return isNewLTTLandingPageVisible && isDarkMode
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
    padding-left: ${({ isNewLTTLandingPageVisible }) =>
      isNewLTTLandingPageVisible ? '1.5rem' : ' 2.5rem'};
    padding-right: ${({ isNewLTTLandingPageVisible }) =>
      isNewLTTLandingPageVisible ? '2rem' : ' 2.25rem'};
    border-radius: ${({ isNewLTTLandingPageVisible }) =>
      isNewLTTLandingPageVisible ? '0.5rem' : ' 0.25rem'};
    width: calc(100% - 2.5rem);
    min-width: 13rem;
    ${expandFontToken('UI/Label Medium')}

    ::placeholder {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `color: ${COLORS.GRAY.G4};`}
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
    left: ${({ isNewLTTLandingPageVisible }) =>
      !isNewLTTLandingPageVisible && '1rem'};
    right: ${({ isNewLTTLandingPageVisible }) =>
      isNewLTTLandingPageVisible && '0'};
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
      stroke: ${({ isNewLTTLandingPageVisible, isDarkMode }) =>
        isNewLTTLandingPageVisible && isDarkMode
          ? COLORS.BRAND.WHITE
          : COLORS.GRAY.G2};
    }
  }

  .close-icon {
    position: absolute;
    right: -1.495rem;
    display: ${({ isNewLTTLandingPageVisible }) =>
      isNewLTTLandingPageVisible ? 'none' : 'flex'};
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
  let interactionContext = useContext(InteractionContext);
  const {
    handleResults,
    allToursArray,
    clearSearch,
    isEntertainmentMb,
    isMobile,
    isNewLTTLandingPageVisible,
    isDarkMode,
  } = props || {};
  const [query, setQuery] = useRecoilState(searchQueryAtom);
  const fuse = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(
    (str: any) => {
      setQuery(str);
      if (str.length >= 3) {
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        if (interactionContext.activeTour.tgid) interactionContext.closeTour();
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
      keys: ['title'],
    };
    const searchableTours = allToursArray.filter((tour: any) => tour.available);
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
      isNewLTTLandingPageVisible={isNewLTTLandingPageVisible}
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
        onFocus={() => {
          trackEvent({
            eventName: ANALYTICS_EVENTS.SEARCH_STARTED,
          });
        }}
      />
      <div className="input-icon">{SEARCH_ICON}</div>
      <Conditional if={query.length > 0}>
        <div
          className="close-icon"
          role="button"
          tabIndex={0}
          onClick={() => {
            handleClearSearch();
          }}
        >
          {CLOSE_WHITE}
        </div>
      </Conditional>
    </StyledSearchBox>
  );
};
