import React, { Component } from "react";

export default class Banner extends Component<any, any> {
  componentDidMount() {
    const MB_CAROUSEL = document.querySelector('.mb-carousel');
    const SLIDES = MB_CAROUSEL.querySelectorAll('.mb-slide');
    const MAX_SLIDES = SLIDES.length;
    const SLIDE_CHANGE_INTERVAL = 3500;
    let activeSlideIndex = MAX_SLIDES - 1;
    let MB_CAROUSEL_INT;
    let indicators;
    let indi = true;
    const nextSlide = () => {
      clearInterval(MB_CAROUSEL_INT)
      changeSlide(1)
      autoSlide()
    }
    const prevSlide = () => {
      clearInterval(MB_CAROUSEL_INT)
      changeSlide(-1)
      autoSlide()
    }
    const genIndicators = () => {
      let html = document.createElement('div')
      html.classList.add('indicators')

      SLIDES.forEach((e, i) => {
        html.innerHTML += "<div class='indicator' onclick='slideTo(" + i + ")'></div>"
      })
      MB_CAROUSEL.appendChild(html)
      return MB_CAROUSEL.querySelectorAll('.indicator')
    }
    if (indi && (MAX_SLIDES > 1))
      indicators = genIndicators()
    else
      indicators = false
    const slideTo = (index = 0) => {
      clearInterval(MB_CAROUSEL_INT)
      SLIDES[activeSlideIndex].classList.remove('active-mb-slide')
      indi && indicators[activeSlideIndex].classList.remove('active')
      activeSlideIndex = getBoundedIndex(index, -1);
      changeSlide()
      autoSlide()
    }
    const getBoundedIndex = (index, dir) => {
      index = index == 0 ? MAX_SLIDES : index;
      index = (index + (1 * dir)) % MAX_SLIDES;
      return index;
    }
    const changeSlide = (dir = 1) => {
      SLIDES[activeSlideIndex].classList.remove('active-mb-slide')
      indi && indicators[activeSlideIndex].classList.remove('active')
      activeSlideIndex = getBoundedIndex(activeSlideIndex, dir)
      SLIDES[activeSlideIndex].classList.add('active-mb-slide')
      indi && indicators[activeSlideIndex].classList.add('active')

    }

    const autoSlide = () => {
      if (MAX_SLIDES > 1)
        MB_CAROUSEL_INT = setInterval(changeSlide, SLIDE_CHANGE_INTERVAL)
    }
    changeSlide();
    autoSlide();
  }

  render() {
    const { bannerCtaText, bannerHeading, bannerImages } = this.props;
    return (
      <div className="mb-carousel boxed">
        {bannerImages.map((banner, index) => {
          return (
            <div key={index} className="mb-slide active-mb-slide">
              <img
                src={banner.image_src.url || banner.uploaded_image.url}
                alt=""
              />
            </div>
          );
        })}

        <div className="mb-captions">
          <div className="mb-caption">
            <div className="caption">{bannerHeading}</div>
            <a className="mb-cta book-now-text" href="#select-tickets">
              {bannerCtaText}
            </a>
          </div>
        </div>
      </div>
    );
  }
}
