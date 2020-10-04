import React, { useContext } from 'react';
import styled from 'styled-components';
import { useWindowWidth } from '@react-hook/window-size';
import { RichText } from 'prismic-reactjs';
import Swiper from '../Swiper';
import Image from '../UI/Image';
import Button from '../UI/Button';
import { MBContext } from '../../contexts/MBContext';
import * as labels from '../../constants/localization/labels';
import { COLORS, SOLEIL } from '../../constants/ui-constants';
import { CHEVRON_LEFT } from '../../assets/SvgIcons';

const variantStyles = {
  'full-width': {
    gridTemplateColumns: '49% 51%',
    img: {
      height: '382',
    },
  },
  large: {
    gridTemplateColumns: '100%',
    img: {
      height: '382',
    },
  },
  small: {
    gridTemplateColumns: '100%',
    img: {
      height: '223',
    },
  },
};

const StyledCard = styled.div((props) => {
  const styles = props.isMobile
    ? variantStyles.small
    : variantStyles[props.cardType];
  return `
  display: grid;
  align-content: start;
  box-shadow: 0px 12px 20px rgba(0, 0, 0, 0.07);
  background: ${COLORS.WHITE};
  border: 1px solid ${COLORS.CHALK};
  grid-template-columns: ${styles.gridTemplateColumns};
  height: calc(100% - 2px);
  text-decoration: none;
  ${props.link && `cursor: pointer;`}
  .flex{
    display: flex;
  }
  img {
    height: ${styles.img.height}px;
    object-fit: cover;
    width: 100%;
  }
  .card-content-section {
    padding: 16px 16px 0 16px;
    * {
      margin-top: 0;
    }
    p, li {
      font-size: 16px !important;
      line-height: 160% !important;
      font-family: ${SOLEIL.FONT_STACK};
    }
    p {
      margin-bottom: 16px !important;
    }
    a {
      color: ${COLORS.MED_SLATE_BLUE};
      word-wrap: break-word;
    }
  }
  .swiper-pagination.swiper-pagination-bullets {
    top: unset;
    display: block;
  }
  @media(max-width: 768px){
    grid-template-columns: auto;
    img{
      height: 223px;
    }
  }
`;
});

const Title = styled.h1`
  font-family: ${SOLEIL.FONT_STACK};
  font-weight: ${SOLEIL.BOLD};
  font-size: 20px;
  text-decoration: none;
  line-height: 27px;
  color: ${COLORS.DAVY_GREY} !important;
  margin-bottom: 8px;
`;

const SwiperWrapper = styled.div`
  display: flex;
  overflow: hidden;
  height: max-content;
`;

const ButtonWrapper = styled.div`
  margin: 24px 0 16px 0 !important;
  width: max-content;
  @media (max-width: 768px) {
    margin-top: 16px;
  }
`;

const CTALink = styled.a`
  color: ${({ theme }) => theme.primaryColor} !important;
  font-weight: ${SOLEIL.SEMIBOLD};
  font-family: ${SOLEIL.FONT_STACK};
  display: block;
  margin: 24px 0 16px 0 !important;
  svg {
    margin-left: 4px;
    transform: rotate(180deg);
    height: 11px;
    width: 11px;
    path {
      stroke-width: 4px;
      stroke: ${({ theme }) => theme.primaryColor};
    }
  }
  @media (max-width: 768px) {
    margin-top: 16px;
  }
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
    text?: string;
    type: string;
  };
  type?: string;
  link?: any;
  linkType?: string;
};

/**
 * A multi-variant card displaying an optional carousel of images and CTA along with a required title and body.
 *
 * Please see the <a href="https://headout.github.io/mystique/?path=/docs/slices-card--with-link-cta">Card Section</a> documentation to begin with.
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
 * - CTA Type
 *  - Option between 'Button' or 'Link'
 * - CTA Text
 *  - If left blank will default to 'Book Now' if CTA Type is 'Button' and 'Read More' if CTA Type is 'Link'
 * - CTA Link
 *
 * **Note: If the CTA link field is left blank, the CTA won't appear.**
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

const HyperLink = ({ children, data }) => {
  return (
    <a href={data.url} onClick={(e) => e.stopPropagation()}>
      {children}
    </a>
  );
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  images = [],
  cta = {},
  type = 'full-width',
  link = '',
  linkType = '',
}) => {
  const width = useWindowWidth();
  const [isMobile, setIsMobile] = React.useState(false);
  const mbContext = useContext(MBContext);

  const lang = mbContext.lang || 'en';

  React.useEffect(() => {
    switch (type) {
      case 'full-width':
        setIsMobile(width <= 960);
        break;
      case 'large':
        setIsMobile(width <= 760);
        break;
      case 'small':
        setIsMobile(true);
        break;
      default:
        break;
    }
  }, [type, setIsMobile, width]);

  const swiperParams = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    shouldSwiperUpdate: true,
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
          isCardSlices
        />
      );
      break;
    default:
      imageView = (
        <SwiperWrapper>
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
        </SwiperWrapper>
      );
      break;
  }

  let CTA;
  switch (cta.type) {
    case 'Button':
      CTA = (
        <ButtonWrapper>
          <a
            href={cta.link.url}
            target={cta.link.target}
            onClick={(e) => e.stopPropagation()}
          >
            <Button>{cta.text || labels[lang]['BOOK_NOW_CTA']}</Button>
          </a>
        </ButtonWrapper>
      );
      break;
    case 'Link':
      CTA = (
        <CTALink
          href={cta.link.url}
          target={cta.link.target}
          onClick={(e) => e.stopPropagation()}
        >
          {cta.text || labels[lang]['READ_MORE_TEXT']}
          {CHEVRON_LEFT}
        </CTALink>
      );
  }
  const hasTextContent =
    title?.length > 0 || RichText.asText(description || []).length > 0;

  return (
    <StyledCard
      {...(linkType === 'Full Card' && {
        onClick: () => {
          if (link?.target === '_blank') {
            window.open(link?.url, '_blank');
          } else {
            window.location.href = link?.url;
          }
        },
        link: true,
      })}
      isMobile={isMobile}
      cardType={type}
    >
      {imageView}
      {hasTextContent ? (
        <div className="card-content-section">
          <Title
            {...(linkType === 'Title' && {
              as: 'a',
              href: link.url,
              target: link.target,
            })}
          >
            {title}
          </Title>
          <RichText
            elements={{
              hyperlink: HyperLink,
            }}
            render={description}
          />
          {cta?.link?.url ? CTA : null}
        </div>
      ) : null}
    </StyledCard>
  );
};

export default Card;
