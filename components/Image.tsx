import React from "react";

export default class Image extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  getRenderedImage = () => {
    const { url, width, height, format } = this.props;
    const makeUrl = (density = 1.5, fm = "pjpg") => {
      const w = width ? `&w=${width * density}` : "";
      const h = height ? `&h=${height * density}` : "";
      return `${url}?auto=compress&fm=${fm}${w}${h}&crop=faces&fit=min`;
    };
    return (
      <picture>
        <source type="image/webp" data-srcSet={makeUrl(1, "webp")} />
        <img className="lazyload" data-src={makeUrl(1, format)} />
      </picture>
    );
  };
  render() {
    return <React.Fragment>{this.getRenderedImage()}</React.Fragment>;
  }
}
