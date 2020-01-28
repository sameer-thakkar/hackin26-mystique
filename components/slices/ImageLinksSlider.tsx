import React, { useState, useContext, useEffect, useCallback } from 'react';
import Swiper from '../Swiper';
import { ProductsContext } from '../contexts/Products';
import { CHEVRON_LEFT } from '../../static/svg-icons';
import { shortCodeSerializer } from '../../utils/shortCodes';
import { RichText } from 'prismic-reactjs';
import { GRAPHIK, AVENIR, COLORS } from '../../constants/ui-constants';
import Image from '../Image';
export const ImageLinksSlider = props => {
    const carouselId = props.heading.replace(/\s/g, '-').toLowerCase();
    const [swiper, updateSwiper] = useState(null);
    const [currentIndex, updateCurrentIndex] = useState(0);
    const goNext = () => {
        if (swiper !== null) {
            swiper.slideNext();
        }
    };

    const goPrev = () => {
        if (swiper !== null) {
            swiper.slidePrev();
        }
    };

    const updateIndex = useCallback(
        () => updateCurrentIndex(swiper.realIndex),
        [swiper]
    );

    useEffect(() => {
        if (isMobile) return;
        if (swiper !== null) {
            swiper.on('slideChange', updateIndex);
        }

        return () => {
            if (swiper !== null) {
                swiper.off('slideChange', updateIndex);
            }
        };
    }, [swiper, updateIndex]);

    const productsContext = useContext(ProductsContext);

    const { cards, carouselOptions, heading, description, isMobile } = props;

    return (
        <div className="image-link-slider">
            <div className="content">
                <h2>{heading}</h2>
                <div className="link-description">
                    <RichText
                        render={description}
                        htmlSerializer={shortCodeSerializer}
                    />
                </div>
            </div>
            {isMobile ? (
                <div className="links-container">{cards.map(Slide)}</div>
            ) : (
                <div className="slider-wrap">
                    <div className="slider-container">
                        <Swiper
                            {...carouselOptions}
                            slidesPerGroup={4}
                            getSwiper={updateSwiper}
                        >
                            {cards.map(Slide)}
                        </Swiper>
                    </div>
                    <div className="controls">
                        {swiper && !swiper.isBeginning ? (
                            <div
                                className="swiper-btn btn btn-left"
                                onClick={goPrev}
                            >
                                {CHEVRON_LEFT}
                            </div>
                        ) : null}
                        {swiper && !swiper.isEnd ? (
                            <div
                                className="swiper-btn btn btn-right"
                                onClick={goNext}
                            >
                                {CHEVRON_LEFT}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
            <style jsx>{`
                .image-link-slider .swiper-container {
                    width: 100%;
                    margin: auto;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                .card {
                    background: #ecf0f1;
                    padding: 10px;
                }
                .image-link-slider {
                    display: grid;
                    grid-auto-flow: row;
                    grid-row-gap: 16px;
                }
                .image-link-slider .content > h2 {
                    margin: 0;
                    margin-bottom: 8px;
                    font-family: ${AVENIR.FONT_STACK};
                    font-size: 24px;
                    line-height: 33px;
                    font-weight: ${AVENIR.HEAVY};
                    color: ${COLORS.DAVY_GREY};
                }
                .image-link-slider .content .link-description {
                    margin: 0;
                    margin-bottom: 16px;
                }
                .slider-container {
                    overflow: hidden;
                    display: flex;
                    width: 100%;
                    /* TODO: Remove this from here. [Safari Fix] */
                    max-width: 1200px;
                    margin: auto;
                }
                .slider-wrap {
                    display: grid;
                    position: relative;
                }
                .controls {
                    display: flex;
                }
                .controls .btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: -32px;
                    display: flex;
                    cursor: pointer;
                }
                .controls .btn-right {
                    left: unset;
                    right: -32px;
                }
            `}</style>
            <style global jsx>
                {`
                    .availability p {
                        font-size: 12px !important;
                        line-height: 12px !important;
                        color: #24a1b2 !important;
                        text-align: left !important;
                        font-family: ${GRAPHIK.FONT_STACK} !important;
                    }
                    .controls .btn svg {
                        stroke-width: 1.5px;
                    }
                    .controls .btn-right svg {
                        transform: rotate(180deg);
                    }
                    .image-link-slider .swiper-wrapper {
                        display: grid;
                        grid-auto-flow: column;
                        justify-content: left;
                    }
                    .image-link-slider .swiper-wrapper img {
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                    }
                    .image-link-slider .content .link-description {
                        font-family: ${AVENIR.FONT_STACK};
                        font-size: 14px;
                        line-height: 1.43;
                    }
                    .image-link-slider .content .link-description p {
                        margin: 0;
                    }
                    @media (max-width: 768px) {
                        .image-link-slider .swiper-slide img {
                            max-width: 104px;
                            width: auto;
                            border-radius: 2px;
                        }
                        .image-link-slider .links-container {
                            display: grid;
                            grid-auto-flow: column;
                            grid-gap: 12px;
                            overflow: scroll;
                            margin: 0 -16px;
                            padding: 0 16px;
                        }
                        .image-link-slider h2 {
                            font-size: 24px;
                            font-family: ${GRAPHIK.FONT_STACK};
                            line-height: 1.4;
                        }
                        .image-link-slider .link-description {
                        }
                        .image-link-slider .card-title {
                            font-size: 14px;
                            font-family: ${GRAPHIK.FONT_STACK};
                            line-height: 1.3;
                            margin-top: 8px;
                        }
                        .image-link-slider
                            .links-container
                            .swiper-slide:last-child {
                            margin-right: 16px;
                        }
                    }
                `}
            </style>
        </div>
    );
};

ImageLinksSlider.defaultProps = {
    carouselOptions: {
        direction: 'horizontal',
        speed: 650,
        slidesPerView: 4,
        spaceBetween: 24,
        navigaton: {
            nextEl: '.swiper-btn.btn-left',
            prevEl: '.swiper-btn.btn-right',
        },
    },
};

export default ImageLinksSlider;

const Slide = (card, index) => {
    return (
        <div key={index} className="swiper-slide">
            <a href={card.link.url} target={card.link.target}>
                <Image url={card.image.url} alt={card.image.alt} />
                <div className="card-title">{card.title}</div>
            </a>
        </div>
    );
};
