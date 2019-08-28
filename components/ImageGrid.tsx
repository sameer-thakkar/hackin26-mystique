import React from "react";
import Image from "./Image";

type PrismicImageObject = {
  image_url: any;
  image_source: any;
};
type ImageGridProps = {
  cols: number;
  images: Array<PrismicImageObject>;
};

class ImageGrid extends React.Component<ImageGridProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { images, cols } = this.props;
    return (
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-box">
            {/* <img src={image.image_url.url} alt="" /> */}
            <Image
              width={580}
              height={300}
              format="pjpg"
              url={image.image_url.url}
            />
          </div>
        ))}
        <style jsx>
          {`
            .image-grid {
              display: grid;
              grid-gap: 1.5em;
              grid-template-columns: repeat(${cols}, 1fr);
            }
            .image-box {
              padding: 20px;
              border-radius: 3px;
              box-shadow: 0 1px 8px rgba(0, 0, 0, 0.18);
            }
            img {
              width: 100%;
            }
            @media (max-width: 768px) {
              .image-grid {
                grid-template-columns: 1fr;
              }
              .image-box {
                padding: 10px;
              }
            }
          `}
        </style>
      </div>
    );
  }
}

export default ImageGrid;
