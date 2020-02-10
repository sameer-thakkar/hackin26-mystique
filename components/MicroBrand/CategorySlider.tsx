import React, {
    Component,
    useState,
    useLayoutEffect,
    useContext,
    useEffect,
    useCallback,
} from 'react';
import Swiper from '../../components/Swiper';
import { ProductsContext } from '../contexts/Products';
import { Product } from './Product';
import { FullLengthProductCard } from './FullLengthProductCard';
import { scroller } from 'react-scroll';
import { CHEVRON_LEFT } from '../../static/svg-icons';

export const CategorySlider = props => {
    const [tgidClicked, setTgidClicked] = useState(null);
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

    const handleProductClicked = productTgid => {
        setTgidClicked(prevTgid =>
            prevTgid != productTgid ? productTgid : null
        );
    };

    useLayoutEffect(() => {
        if (tgidClicked)
            scroller.scrollTo(`${carouselId}-${tgidClicked}`, {
                duration: 750,
                delay: 100,
                smooth: 'easeInQuad',
                offset: 100,
            });
    }, [tgidClicked]);

    const closeDescription = () => {
        setTgidClicked(null);
    };
    const {
        tgidsArray,
        carouselOptions,
        currentLanguage,
        host,
        uid,
        heading,
        description,
    } = props;
    const { allTours, isMobile } = productsContext;
    let filteredTgids = tgidsArray.filter(
        (tgid, index, arr) =>
            allTours[tgid] &&
            allTours[tgid].available &&
            arr.slice(0, index).indexOf(tgid) == -1
    );
    const cardPosition = filteredTgids.indexOf(tgidClicked) + 1;
    const elementId = heading
        .trim()
        .replace(/\s/g, '-')
        .toLowerCase();
    return (
        <div className="category-slider" id={elementId}>
            <div className="content">
                <h2>{heading}</h2>
                <p>{description}</p>
            </div>
            <div className="slider-wrap">
                <div className="slider-container">
                    <Swiper
                        {...carouselOptions}
                        slidesPerGroup={4}
                        getSwiper={updateSwiper}
                    >
                        {filteredTgids.map((tgid, index) => {
                            return (
                                <div key={index} className="swiper-slide">
                                    <Product
                                        tgid={tgid}
                                        productClick={handleProductClicked}
                                        allTours={allTours}
                                        isMobile={isMobile}
                                        imageId={tgid}
                                        cardIdPrefix={carouselId}
                                    />
                                </div>
                            );
                        })}
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
            <div className="slider-product-description">
                {tgidClicked ? (
                    <FullLengthProductCard
                        tgidClicked={tgidClicked}
                        key={carouselId}
                        allTours={allTours}
                        isMobile={isMobile}
                        currentLanguage={currentLanguage}
                        host={host}
                        uid={uid}
                        cardPosition={cardPosition - currentIndex}
                        closeDescription={closeDescription}
                    />
                ) : null}
            </div>
            <style jsx>{`
                .category-slider .swiper-container {
                    width: 100%;
                    margin: auto;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                .card {
                    background: #ecf0f1;
                    padding: 10px;
                }
                .category-slider {
                    display: grid;
                    grid-auto-flow: row;
                    grid-row-gap: 16px;
                }
                .category-slider .content > h2 {
                    margin: 0;
                    margin-bottom: 8px;
                }
                .category-slider .content > p {
                    width: 60%;
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
                    top: 88px;
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
                        font-family: Graphik !important;
                    }
                    .controls .btn svg {
                        stroke-width: 1.5px;
                    }
                    .controls .btn-right svg {
                        transform: rotate(180deg);
                    }
                    .category-slider .swiper-wrapper {
                        display: grid;
                        grid-auto-flow: column;
                        justify-content: left;
                    }
                `}
            </style>
        </div>
    );
};

CategorySlider.defaultProps = {
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

export default CategorySlider;
