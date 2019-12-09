import React from "react";
import { attachQueryParam } from "../utils/helper";

const Masthead = props => {
  const { title, image } = props;
  return (
    <div className="banner">
      <img
        src={attachQueryParam(image, "q=10")}
        data-src={image}
        alt="banner"
        className="lazyload"
      />
      <div className="banner-text">
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default Masthead;
