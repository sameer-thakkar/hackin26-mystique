import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import styled from 'styled-components';
import Fuse from 'fuse.js';
import InteractionContext from 'contexts/Interaction';
import Conditional from 'components/common/Conditional';
import { SOLEIL, COLORS } from 'const/ui-constants';
import { SEARCH_ICON, CLOSE_WHITE } from 'assets/SvgIcons';

const StyledSearchBox = styled.div`
  position: relative;

  input {
    padding: ${({ isEntertainmentMb }) =>
      isEntertainmentMb ? '0.563rem 0' : '0.75rem 0'};
    outline: none;
    padding-left: 2.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${COLORS.DADDY};
    width: calc(100% - 2.5rem);
    min-width: 17.5rem;
    font-family: ${SOLEIL.FONT_STACK};
    font-weight: ${SOLEIL.REGULAR};
    font-size: 1rem;

    ::placeholder {
      ${({ isEntertainmentMb }) =>
        isEntertainmentMb && `color: ${COLORS.GREY.G4};`}
    }

    ${({ isEntertainmentMb }) =>
      isEntertainmentMb &&
      `
        font-size: 0.938rem;
        line-height: 1.25rem;
        `};
  }

  .input-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translate(0, -50%);
    display: flex;
    align-items: center;

    svg {
      stroke: ${COLORS.GREY_75};
      height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '1rem' : '1.125rem'};
      height: ${({ isEntertainmentMb }) =>
        isEntertainmentMb ? '1rem' : '1.125rem'};
    }

    path {
      stroke: ${COLORS.DAVY_GREY};
    }
  }

  .close-icon {
    position: absolute;
    right: 1.125rem;
    display: flex;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;

    svg {
      height: 1rem;
      width: auto;

      path {
        stroke: ${COLORS.DAVY_GREY};
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

export const SearchBox = (props) => {
  let interactionContext = useContext(InteractionContext);
  const { handleResults, allToursArray, clearSearch, isEntertainmentMb } =
    props || {};
  const [query, setQuery] = useState('');
  const fuse = useRef(null);

  const search = useCallback(
    (str) => {
      setQuery(str);
      if (str.length >= 3) {
        if (interactionContext.activeTour.tgid) interactionContext.closeTour();
        const results = fuse.current.search(str);
        handleResults(results.slice(0, 5));
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
    const searchableTours = allToursArray.filter((tour) => tour.available);
    fuse.current = new Fuse(searchableTours, opts);

    if (clearSearch) {
      handleClearSearch();
    }
  }, [allToursArray, clearSearch, handleClearSearch, fuse]);

  return (
    <StyledSearchBox isEntertainmentMb={isEntertainmentMb}>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => {
          search(e.currentTarget.value);
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
