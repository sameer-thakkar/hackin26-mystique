import React, {
  Component,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { RichText } from "prismic-reactjs";

export const ContentTabs = props => {
  const { tabsArr, contentArr } = props;
  const defaultTab = contentArr.find(tab => tab.default_tab == "Yes");
  const defaultTabName = defaultTab ? defaultTab.tab_name : "";
  const [activeTabName, setActiveTab] = useState(defaultTabName);
  return (
    <div className="content-tabs-wrap">
      <div className="tabs">
        {tabsArr.map((tab, index) => {
          return (
            <div
              key={index}
              className={`tab ${tab == activeTabName ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          );
        })}
      </div>
      {contentArr.map((content, index) => {
        if (content.tab_name == activeTabName)
          return (
            <div className="content">
              <RichText render={content.tab_content} />
            </div>
          );
      })}
      <style jsx>{`
        .content-tabs-wrap {
          display: grid;
          grid-row-gap: 16px;
        }
        .tabs {
          display: grid;
          grid-auto-flow: column;
          font-size: 18px;
          grid-column-gap: 32px;
          border-bottom: 1px solid #ebebeb;
          justify-content: left;
        }
        .tab.active {
          color: #ec1943;
          border-bottom: 2px solid;
          padding-bottom: 8px;
        }
        @media (max-width: 768px) {
          .tabs {
            overflow-x: scroll;
          }
        }
      `}</style>
      <style global jsx>{`
        .content-tabs-wrap .content p {
          margin: 0;
        }
        .content-tabs-wrap .content img {
          width: 100%;
          max-width: 100%;
        }
        .content-tabs-wrap .content a {
          color: #ec1943;
        }
      `}</style>
    </div>
  );
};
