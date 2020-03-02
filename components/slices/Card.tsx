import React from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Swiper from '../Swiper';
import useWindowSize from '../hooks/useWindowSize';
import Button from '../UI/Button';
import { COLORS, GRAPHIK, AVENIR } from '../../constants/ui-constants';

const variantStyles = {
  desktop: {
    gridTemplateColumns: '49% 51%',
    img: {
      height: '382px',
    },
  },
  column: {
    gridTemplateColumns: '100%',
    img: {
      height: '382px',
    },
  },
  mobile: {
    gridTemplateColumns: '100%',
    img: {
      height: '223px',
    },
  },
};

const StyledCard = styled.div(props => {
  const styles = props.isMobile
    ? variantStyles.mobile
    : variantStyles[props.type];
  return `
  display: grid;
  align-content: start;
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.07);
  border: 1px solid ${COLORS.CHALK};
  grid-template-columns: ${styles.gridTemplateColumns};
  color: ${COLORS.DAVY_GREY};
  height: 100%;
  .flex{
    display: flex;
  }
  img {
    height: ${styles.img.height};
    object-fit: cover;
    width: 100%;
  }
  .card-content-section {
    padding: 16px;
    span {
      font-family: ${GRAPHIK.FONT_STACK};
      font-style: normal;
      font-weight: ${GRAPHIK.HEAVY};
      font-size: 20px;
    }
    p {
      font-size: 16px;
      line-height: 160%;
      font-family: ${AVENIR.FONT_STACK}
    }
  }
  .swiper-pagination.swiper-pagination-bullets {
    top: unset;
    display: block;
  }
`;
});

type CardProps = {
  title: string;
  description: any[];
  images?: any;
  cta?: {
    link: {
      url: string;
      target: string;
    };
    text: string;
  };
  type?: string;
};

/**
 * A multi-variant card displaying an optional carousel of images and CTA along with a required title and body
 *
 * **All fields marked with a * are mandatory and will break the slice if left blank.**
 *
 * ### Non-repeatable zone
 * - *Card Title
 * - *Card Description
 *  - Rich Text field
 * - CTA Text
 * - CTA Link
 *
 * **Note: If either of the CTA fields is left blank, the CTA won't appear.**
 *
 * ### Repeatable zone
 * - Image Source
 *  - Add your image from prismic
 *  - Additionally add an 'alt' field
 * - Image URL
 *  - Add a link to the image directly
 *  - Will take precedence over 'Image Source'
 * - Image Alt
 *  - 'alt' field for Image URL
 *  - Will take precedence over 'Image Source' alt
 */

const Card: React.FC<CardProps> = ({
  title,
  description,
  images = [],
  cta = {},
  type = 'desktop',
}) => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    switch (type) {
      case 'desktop':
        setIsMobile(width <= 960);
        break;
      case 'column':
        setIsMobile(width <= 760);
        break;
      case 'mobile':
        setIsMobile(true);
        break;
      default:
        break;
    }
  }, [width, setIsMobile]);

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
  };

  let imageView;
  switch (images.length) {
    case 0:
      imageView = null;
      break;
    case 1:
      imageView = <img src={images[0].url} alt={images[0].alt} />;
      break;
    default:
      imageView = (
        <div className="flex">
          <Swiper {...swiperParams}>
            {images.map((image, index) => {
              return <img key={index} src={image.url} alt={image.alt} />;
            })}
          </Swiper>
        </div>
      );
      break;
  }
  return (
    <StyledCard isMobile={isMobile} type={type}>
      {imageView}
      <div className="card-content-section">
        <span>{title}</span>
        <RichText render={description} />
        {cta.link && cta.text ? (
          <a href={cta.link.url} target={cta.link.target}>
            <Button>{cta.text}</Button>
          </a>
        ) : null}
      </div>
    </StyledCard>
  );
};

export default Card;
