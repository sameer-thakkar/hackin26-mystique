import React, { useState } from 'react';
import { RichText } from 'prismic-reactjs';
import { AVENIR, COLORS } from '../../constants/ui-constants';
import { Slider } from '../UI/Slider';
import { CHEVRON_DOWN } from '../../public/static/svg-icons';

const Question = (props) => {
  const {
    question,
    answer,
    images,
    setActiveItem,
    index: tabIndex,
    activeItem,
  } = props;
  const normalizedImages = images.reduce((acc, image) => {
    let img = {
      url: image.upload_image?.url || image.linked_image,
      caption: image.upload_image?.alt || image.image_caption,
      alt: image.alt_text,
    };
    return [...acc, img];
  }, []);
  const [isOpen, setOpen] = useState(false);
  let isActiveItem = tabIndex == activeItem;
  if (!setActiveItem) isActiveItem = isOpen;
  return (
    <div className="question-container">
      <div className={`question-carousel ${isActiveItem ? 'active' : ''}`}>
        {isActiveItem ? (
          <div className={`slider-wrap `}>
            <Slider images={normalizedImages} />
          </div>
        ) : null}
      </div>
      <div className={`content ${isActiveItem ? 'active' : ''}`}>
        <div
          className="question"
          role="button"
          tabIndex={0}
          onClick={() => {
            (setActiveItem && setActiveItem(tabIndex)) || setOpen(!isOpen);
          }}
        >
          <div className="question-text">{question}</div>
          <div className="state-icon">{CHEVRON_DOWN}</div>
        </div>
        <div className="answer">
          <RichText render={answer} />
        </div>
      </div>
      <style>{`
            .question{
              display: grid;
              grid-template-columns: 1fr auto;
              justify-items: space-between;
              font-weight: ${AVENIR.HEAVY};
              font-family: ${AVENIR.FONT_STACK};
            }
            .question-carousel{
              display: flex;
            }
            .question-carousel.active::after{
              height: 368px;
              content: '';
            }
            .question-container .content{
              padding-bottom: 16px;
              border-bottom: 1px solid #EBEBEB;
              display: grid;
              grid-row-gap: 16px;
            }
            .question-carousel.active .slider-wrap{
              position: absolute;
              height: 368px;
              top: 0;
              left: 0;
            }
            .slider-wrap{
              overflow: hidden;
              max-height: 368px;
              width: auto;
              display: flex;
            }
            .content .answer{
              display: none;
            }
            .content.active .answer{
              display: block;
            }
            .question-container{
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 24px;
              width: 100%;
            }
          `}</style>
      <style global jsx>{`
        .answer p {
          margin: 0;
        }
        .answer img {
          width: 100%;
          max-width: 100%;
        }
        .slider-wrap img {
          width: 100%;
          height: 100%;
          display: flex;
          object-fit: cover;
        }
        .answer a {
          color: ${COLORS.MED_SLATE_BLUE};
        }
      `}</style>
    </div>
  );
};

export default Question;
