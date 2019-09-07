import React from "react";

const Masthead = props => {
  const { title, image } = props;
  return (
    <div className="banner">
      <img src={image} alt="banner" />>
      <div className="banner-text">
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default Masthead;
