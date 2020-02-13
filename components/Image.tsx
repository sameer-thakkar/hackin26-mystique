import React from 'react';

export default class Image extends React.Component<any, any> {
  static defaultProps = {
    imageId: '',
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.setState({ ready: true });
  }
  getRenderedImage = () => {
    const {
      url,
      width,
      height,
      format,
      imageId,
      dontLazyLoad,
      alt,
    } = this.props;
    const makeUrl = (density = 1.5, fm = 'pjpg') => {
      const w = width ? `&w=${width * density}` : '';
      const h = height ? `&h=${height * density}` : '';
      if (!url) {
        return null;
      }
      return `${url.replace(
        /\s/g,
        '%20'
      )}?auto=compress&fm=${fm}${w}${h}&crop=faces&fit=min`;
    };
    if (!dontLazyLoad)
      return (
        <picture>
          <source type="image/webp" data-srcset={makeUrl(1, 'webp')} />
          {/* a non-static className (imageId) is required for lazyLoad specific classNames to be reset to original on re-render,
        fixes cards continue showing previous render images */}
          <img
            className={`lazyload ${imageId}`}
            data-src={makeUrl(1, format)}
            alt={alt}
          />
        </picture>
      );
    else return <img src={makeUrl(1, format)} />;
  };
  render() {
    return <React.Fragment>{this.getRenderedImage()}</React.Fragment>;
  }
}
