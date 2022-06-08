const ampFonts = `
/* Halyard Fonts START */
@font-face {
  font-family:"halyard-display";
  src:url("https://use.typekit.net/af/165087/00000000000000007735adc0/30/l?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n5&v=3") format("woff2"),url("https://use.typekit.net/af/165087/00000000000000007735adc0/30/d?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n5&v=3") format("woff"),url("https://use.typekit.net/af/165087/00000000000000007735adc0/30/a?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n5&v=3") format("opentype");
  font-display: swap;
  font-style: normal;
  font-weight: 500;
}
  
@font-face {
  font-family:"halyard-text";
  src:url("https://use.typekit.net/af/e40556/00000000000000007735adbc/30/l?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n3&v=3") format("woff2"),url("https://use.typekit.net/af/e40556/00000000000000007735adbc/30/d?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n3&v=3") format("woff"),url("https://use.typekit.net/af/e40556/00000000000000007735adbc/30/a?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n3&v=3") format("opentype");
  font-display: swap;
  font-style: normal;
  font-weight: 300;
}
  
@font-face {
  font-family:"halyard-text";
  src:url("https://use.typekit.net/af/06aac1/00000000000000007735adbe/30/l?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=i3&v=3") format("woff2"),url("https://use.typekit.net/af/06aac1/00000000000000007735adbe/30/d?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=i3&v=3") format("woff"),url("https://use.typekit.net/af/06aac1/00000000000000007735adbe/30/a?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=i3&v=3") format("opentype");
  font-display: swap;
  font-style: italic;
  font-weight: 300;
}
  
  @font-face {
  font-family:"halyard-text";
  src:url("https://use.typekit.net/af/a7393c/00000000000000007735adc2/30/l?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n4&v=3") format("woff2"),url("https://use.typekit.net/af/a7393c/00000000000000007735adc2/30/d?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n4&v=3") format("woff"),url("https://use.typekit.net/af/a7393c/00000000000000007735adc2/30/a?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n4&v=3") format("opentype");
  font-display: swap;
  font-style: normal;
  font-weight: 400;
}
  
@font-face {
  font-family:"halyard-text";
  src:url("https://use.typekit.net/af/7c9acc/00000000000000007735adc8/30/l?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n5&v=3") format("woff2"),url("https://use.typekit.net/af/7c9acc/00000000000000007735adc8/30/d?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n5&v=3") format("woff"),url("https://use.typekit.net/af/7c9acc/00000000000000007735adc8/30/a?primer=f592e0a4b9356877842506ce344308576437e4f677d7c9b78ca2162e6cad991a&fvd=n5&v=3") format("opentype");
  font-display: swap;
  font-style: normal;
  font-weight: 500;
}

/* Halyard Fonts END */

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'halyard-text', sans-serif;
}
a {
  text-decoration: none;
  color: #8000ff;
}

* {
  outline: none;
}

li,
span,
p,
td,
div {
  color: #444;
}

h1 > strong,
h2 > strong,
h3 > strong,
h4 > strong,
h5 > strong,
h6 > strong {
  font-weight: 600;
  color: #444444;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 600;
  color: #444444;
}

/* Some global css which which shouldn't exist */
.content-page-container {
  max-width: 1190px;
  margin: auto;
}

.main-wrapper,
.slice-wrapper {
  max-width: 1200px;
  padding: 0 5.46vw;
  margin: auto;
  width: calc(100% - (5.46vw * 2));
}

.content-wrapper {
  margin-top: 90px;
}
body.scroll-lock {
  overflow: hidden;
  padding-right: 1em;
}

@media (max-width: 768px) {
  .main-wrapper {
    padding: 0 16px;
  }

  .slice-wrapper.slice-block {
    padding: 0 16px;
    width: calc(100vw - 32px);
  }
}

/* Removes grid-gap for anchor slices. */
.slice-wrapper.anchor_point + .slice-wrapper {
  margin-top: -60px;
}

.slice-wrapper.unspace + .slice-wrapper {
  margin-top: -72px;
}

.slice-wrapper + .slice-wrapper.unspace + .slice-wrapper {
  margin-top: -144px;
}

@media (max-width: 768px) {
  .main-wrapper,
  .slice-wrapper {
    padding: 0;
    width: 100%;
  }
  .slice-wrapper.unspace + .slice-wrapper {
    margin-top: -52px;
  }

  .slice-wrapper + .slice-wrapper.unspace + .slice-wrapper {
    margin-top: -104px;
  }
}

/* SWIPER OVERRIDES */
.swiper-pagination.swiper-pagination-bullets {
  position: absolute;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 5px;
}

.swiper-container {
  width: 100%;
}

.swiper-pagination-custom,
.swiper-pagination-fraction {
  width: unset;
}

.swiper-pagination.swiper-pagination-bullets {
  bottom: 18px;
}

span.swiper-pagination-bullet {
  background: #ffffffa1;
  opacity: 1;
}

span.swiper-pagination-bullet-active {
  background: #fff;
}

@media (max-width: 768px) {
  .swiper-wrapper {
    grid-template-columns: 1fr;
  }
}
`;

export default ampFonts;
