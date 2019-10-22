import React from "react";
import { RichText } from "prismic-reactjs";
import { shortCodeSerializer } from "../utils/shortCodes";
import Image from "./Image";
type ImgTxtCardObject = {
  card_description: Array<Object>;
  card_title: String;
  image_source: any;
  image_url: any;
};
type ImageTextProps = {
  cols: number;
  cards: Array<ImgTxtCardObject>;
};

class ImageText extends React.Component<ImageTextProps, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { cards, cols } = this.props;
    return (
      <div className="combo-cards-grid">
        {cards.map((card, index) => (
          <div key={index} className="combo-card">
            <div className="card-title">{card.card_title}</div>
            {/* <img src={card.image_url.url} alt="" /> */}
            <Image
              width={580}
              height={300}
              format="pjpg"
              url={card.image_url.url || card.image_source.url}
            />
            <div className="description">
              <RichText
                render={card.card_description}
                htmlSerializer={shortCodeSerializer}
              />
            </div>
          </div>
        ))}

        <style jsx>
          {`
            .combo-cards-grid {
              display: grid;
              grid-gap: 1.5em;
              grid-template-columns: repeat(${cols}, 1fr);
            }
            .combo-card {
              display: grid;
              grid-template-rows: auto auto 1fr;
              grid-gap: 10px;
              padding: 20px;
              border-radius: 3px;
              box-shadow: 0 1px 8px rgba(0, 0, 0, 0.18);
            }
            .combo-card .card-title {
              font-size: 16px;
              line-height: 28px;
              color: #666666;
              text-align: justify;
              font-weight: 600;
              font-family: Avenir, Proxima-Nova, arial, sans-serif;
            }

            @media (max-width: 768px) {
              .combo-cards-grid {
                grid-template-columns: 1fr;
              }
              .combo-card {
                padding: 10px;
              }
            }
          `}
        </style>
        <style jsx global>
          {`
            .combo-card > *,
            .description > * {
              margin: 0;
            }
          `}
        </style>
      </div>
    );
  }
}

export default ImageText;
