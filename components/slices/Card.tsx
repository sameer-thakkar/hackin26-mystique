import React from 'react';
import styled from 'styled-components';
import { RichText } from 'prismic-reactjs';
import Swiper from '../Swiper';
import Image from '../UI/Image';
import Button from '../UI/Button';
import { COLORS, GRAPHIK, AVENIR } from '../../constants/ui-constants';

const variantStyles = {
  desktop: {
    gridTemplateColumns: '49% 51%',
    img: {
      height: '382',
    },
  },
  column: {
    gridTemplateColumns: '100%',
    img: {
      height: '382',
    },
  },
  mobile: {
    gridTemplateColumns: '100%',
    img: {
      height: '223',
    },
  },
};

const StyledCard = styled.div((props) => {
  const styles = props.isMobile
    ? variantStyles.mobile
    : variantStyles[props.type];
  return `
  display: grid;
  align-content: start;
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.07);
  background: ${COLORS.WHITE};
  border: 1px solid ${COLORS.CHALK};
  grid-template-columns: ${styles.gridTemplateColumns};
  color: ${COLORS.DAVY_GREY};
  height: ${props.type === 'desktop' ? `${styles.img.height}px` : `100%`};
  .flex{
    display: flex;
  }
  img {
    height: ${styles.img.height}px;
    object-fit: cover;
    width: 100%;
  }
  .card-content-section {
    padding: 16px;
    span, a {
      font-family: ${GRAPHIK.FONT_STACK};
      font-style: normal;
      font-weight: ${GRAPHIK.HEAVY};
      font-size: 20px;
      text-decoration: none;
      color: ${COLORS.DAVY_GREY}
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

const StyledTitle = styled.span``;

const StyledSwiperWrapper = styled.div`
  display: flex;
  overflow: hidden;
`;

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
  link?: any;
  linkType?: string;
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
 * - Card Link
 * - Card Link Type
 *  - 'Full Card' will make the entire card a link and 'Title' will only make the title a link
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
  link = '',
  linkType = '',
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    let width = window.innerWidth;
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
  }, [type, setIsMobile]);

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    rebuildOnUpdate: true,
  };

  let imageView;
  switch (images.length) {
    case 0:
      imageView = null;
      break;
    case 1:
      imageView = (
        <Image
          url={images[0].url}
          alt={images[0].alt}
          height={variantStyles[type].img.height}
        />
      );
      break;
    default:
      imageView = (
        <StyledSwiperWrapper>
          <Swiper {...swiperParams}>
            {images.map((image, index) => {
              return (
                <Image
                  className="swiper-slide"
                  key={index}
                  url={image.url}
                  alt={image.alt}
                  height={variantStyles[type].img.height}
                />
              );
            })}
          </Swiper>
        </StyledSwiperWrapper>
      );
      break;
  }
  return (
    <StyledCard
      {...(linkType === 'Full Card' && {
        as: 'a',
        href: link.url,
        target: link.target,
      })}
      isMobile={isMobile}
      type={type}
    >
      {imageView}
      <div className="card-content-section">
        <StyledTitle
          {...(linkType === 'Title' && {
            as: 'a',
            href: link.url,
            target: link.target,
          })}
        >
          {title}
        </StyledTitle>
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
