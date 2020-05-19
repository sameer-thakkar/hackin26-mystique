import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import Fuse from 'fuse.js';
import { SEARCH_ICON, CLOSE_WHITE } from '../../assets/SvgIcons';
import { SOLEIL, COLORS } from '../../constants/ui-constants';
import InteractionContext from '../../contexts/Interaction';

export const SearchBox = (props) => {
  let interactionContext = useContext(InteractionContext);
  const [query, setQuery] = useState('');
  const fuse = useRef(null);

  const search = useCallback(
    (str) => {
      setQuery(str);
      if (str.length >= 3) {
        if (interactionContext.activeTour.tgid) interactionContext.closeTour();
        const results = fuse.current.search(str);
        props.handleResults(results.slice(0, 5));
      } else {
        props.handleResults([]);
      }
    },
    [interactionContext, props]
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
    const searchableTours = props.allToursArray.filter(
      (tour) => tour.available
    );
    fuse.current = new Fuse(searchableTours, opts);

    if (props.clearSearch) {
      handleClearSearch();
    }
  }, [props.allToursArray, props.clearSearch, handleClearSearch, fuse]);

  return (
    <div className="rich-input">
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => {
          search(e.currentTarget.value);
        }}
      />
      <div className="input-icon">{SEARCH_ICON}</div>
      {query.length > 0 ? (
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
      ) : null}
      <style jsx>
        {`
          .rich-input {
            position: relative;
          }
          .rich-input input {
            padding: 12px 0;
            outline: none;
            padding-left: 40px;
            border-radius: 4px;
            border: 1px solid ${COLORS.DADDY};
            width: calc(100% - 40px);
            min-width: 385px;
            font-family: ${SOLEIL.FONT_STACK};
            font-weight: ${SOLEIL.REGULAR};
            font-size: 16px;
          }
          .input-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translate(0, -50%);
            display: flex;
            align-items: center;
          }

          .close-icon {
            position: absolute;
            right: 18px;
            display: flex;
            top: 50%;
            transform: translate(0, -50%);
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .rich-input input {
              min-width: unset;
              border-radius: 4px;
              padding: 10px 0;
              padding-left: 36px;
              font-size: 16px;
              background: #ebebeb99;
              border: none;
            }
            .input-icon {
              left: 10.5px;
            }
            .close-icon {
              display: none;
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          .input-icon {
            display: flex;
          }
          .close-icon svg {
            height: 16px;
            width: auto;
          }
          .close-icon path {
            stroke: ${COLORS.DAVY_GREY};
          }
          .input-icon svg {
            stroke: ${COLORS.GREY_75};
            height: 18px;
            width: 18px;
          }
          @media (max-width: 768px) {
            .close-icon svg {
              height: 20px;
            }
          }
        `}
      </style>
    </div>
  );
};
