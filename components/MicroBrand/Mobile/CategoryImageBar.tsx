import React, { Component, useState, useEffect } from "react";
import Image from "../../Image";

export const CategoryImageBar = props => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  let tagsRef = {};

  const addTgidToCategory = tgid => {
    if (this.props.availableTGIDs.tgid) {
      let newState = this.state.categoryProps;
      let { categories, active } = newState;
      categories[active].push(tgid);
      this.state.setState(newState);
    }
  };

  const openCategory = (index: Number) => {
    this.props.openCategory(index);
  };
  let { categories, title } = props;
  categories = [...categories, ...categories, ...categories];
  return (
    <div className="category-bar-wrapper">
      <div className="category-heading">{title}</div>
      <div className="category-wrap">
        {categories.map((category, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                this.openCategory(index);
              }}
              ref={ref => {
                tagsRef[index] = ref;
              }}
              className="category-card"
              data-tgid={category.ranking.popularity}
            >
              <Image url={category.image} />
              <span className="category-name">{category.name}</span>
            </div>
          );
        })}
      </div>

      <style jsx>
        {`
          .category-heading {
            font-family: Graphik;
            font-size: 24px;
            font-weight: 500;
            margin-left: 10px;
            margin-bottom: 24px;
          }
          .category-wrap {
            display: grid;
            grid-auto-flow: column;
            grid-column-gap: 10px;
            justify-content: left;
            max-width: 100vw;
            overflow-x: scroll;
          }
          .category-card:first-child {
            margin-left: 10px;
          }
          .category-card:last-child {
            padding-right: 10px;
          }
          .category-card {
            display: grid;
            align-content: start;
            font-family: Graphik;
            font-size: 14px;
            font-weight: 500;
            grid-row-gap: 8px;
            letter-spacing: 0.3px;
          }
          .category-bar-wrapper {
            margin-top: 40px;
          }
        `}
      </style>
      <style jsx global>
        {`
          .category-card img {
            height: 144px;
            width: 104px;
            object-fit: cover;
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
};
