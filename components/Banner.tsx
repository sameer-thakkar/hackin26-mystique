import React, { Component } from 'react';
import classNames from 'classnames';
import { BANNER_PARAMS } from '../constants/index';
import * as labels from '../static/localization/labels';
import { attachQueryParam } from '../utils/helper';

const imgixUrl = (url, format, w, ar, q = 75) =>
    attachQueryParam(
        url,
        `auto=compress&w=${w}&fm=${format}&crop=faces&fit=crop&ar=${ar}&q=${q}`
    );

export default class Banner extends Component<any, any> {
    hasIndicators: boolean;
    MAX_SLIDES: number;
    SLIDE_CHANGE_INTERVAL: number;
    activeSlideIndex: number;
    prevSlideIndex: number;
    MB_CAROUSEL_INT: any;

    constructor(props) {
        super(props);
        this.hasIndicators = true;
        this.MAX_SLIDES = this.props.bannerImages.length;
        this.SLIDE_CHANGE_INTERVAL = 3500;
        this.prevSlideIndex = this.activeSlideIndex = 0;
        this.state = {
            counter: 0,
            isMobile: null,
            isClient: false,
        };
    }

    componentDidMount() {
        const mobileCheck = window.innerWidth < 768;
        this.setState({
            isMobile: mobileCheck,
            isClient: true,
        });
        if (this.props.bannerImages.length > 1) this.autoSlide();
    }

    nextSlide = () => {
        clearInterval(this.MB_CAROUSEL_INT);
        this.changeSlide(1);
        this.autoSlide();
    };
    prevSlide = () => {
        clearInterval(this.MB_CAROUSEL_INT);
        this.changeSlide(-1);
        this.autoSlide();
    };

    getBoundedIndex = (index, dir) => {
        index = index == 0 ? this.MAX_SLIDES : index;
        index = (index + 1 * dir) % this.MAX_SLIDES;
        return index;
    };

    changeSlide = (dir = 1) => {
        this.prevSlideIndex = this.activeSlideIndex;
        this.activeSlideIndex = this.getBoundedIndex(
            this.activeSlideIndex,
            dir
        );
        this.setState({ counter: this.state.counter + 1 });
    };

    autoSlide = () => {
        this.MB_CAROUSEL_INT = setInterval(
            this.changeSlide,
            this.SLIDE_CHANGE_INTERVAL
        );
    };

    slideTo = (index = 0) => {
        clearInterval(this.MB_CAROUSEL_INT);
        this.activeSlideIndex = this.getBoundedIndex(index, -1);
        this.changeSlide();
        this.autoSlide();
    };

    renderBanners = url => {
        const { isMobile } = this.state;
        const { ASPECT_RATIO, WIDTH } = isMobile
            ? BANNER_PARAMS.MOBILE
            : BANNER_PARAMS.DESKTOP;
        return (
            <picture>
                <source
                    type="image/webp"
                    data-srcset={imgixUrl(url, 'webp', WIDTH, ASPECT_RATIO)}
                    srcSet={imgixUrl(url, 'webp', WIDTH, ASPECT_RATIO, 10)}
                ></source>
                <img
                    className="lazyload"
                    data-src={imgixUrl(url, 'pjpg', WIDTH, ASPECT_RATIO)}
                    src={imgixUrl(url, 'pjpg', WIDTH, ASPECT_RATIO, 10)}
                    alt={'banner'}
                />
            </picture>
        );
    };

    render() {
        const {
            bannerHeading,
            bannerImages,
            boxed,
            currentLanguage,
        } = this.props;
        const { isClient } = this.state;
        return (
            <div className={classNames('mb-carousel', { boxed: boxed })}>
                {bannerImages.map((banner, index) => {
                    let imageUrl =
                        banner.image_src.url || banner.uploaded_image.url;
                    return (
                        <div
                            key={index}
                            className={classNames(
                                'mb-slide',
                                {
                                    'active-mb-slide fade-in':
                                        this.activeSlideIndex == index,
                                },
                                {
                                    'prev-slide fade-out':
                                        this.prevSlideIndex == index,
                                }
                            )}
                        >
                            {isClient ? this.renderBanners(imageUrl) : null}
                        </div>
                    );
                })}

                <div className="mb-captions">
                    <div className="mb-caption">
                        <div className="caption">
                            <h1>{bannerHeading}</h1>
                        </div>
                        <a
                            className="mb-cta book-now-text"
                            href="#select-tickets"
                        >
                            {labels[currentLanguage].BANNER_CTA}
                        </a>
                    </div>
                </div>
                {this.hasIndicators && bannerImages.length > 1 ? (
                    <div className="indicators">
                        {bannerImages.map((banner, index) => (
                            <div
                                key={index}
                                className={classNames('indicator', {
                                    active: this.activeSlideIndex == index,
                                })}
                                onClick={() => {
                                    this.slideTo(index);
                                }}
                            ></div>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
}
