import {
  DETAILS_ALLOWED_SHOWPAGES,
  YES_STRING,
  SAFETY_BANNER_STRING,
  TAB_ALLOWED_HIGHLIGHT,
  TAB_ALLOWED_INFO,
} from 'constants/index';

export const getObject = (data, filterArray) => {
  let detailsObjects: { [key: string]: string } = {},
    showType = '',
    detailObjectHeading,
    isSafetyBanner = false,
    currentObject;

  data.forEach((element) => {
    if (element.type == 'heading6') {
      // detail object heading
      detailObjectHeading = element.content.text;
      currentObject = 'DETAIL';
    } else if (
      element.type == 'heading2' &&
      (element.content.text?.startsWith('FAQs') ||
        element.content.text?.startsWith('Frequently Asked Questions'))
    ) {
      currentObject = 'FAQ';
    } else if (element.type == 'heading2') {
      // tab heading
      currentObject = 'TAB';
    } else if (
      element.type == 'heading5' &&
      element.content.text?.startsWith('Listicle')
    ) {
      // listicle
      currentObject = 'LISTICLE';
    } else {
      if (currentObject === 'DETAIL') {
        // detail object content
        if (detailObjectHeading == 'Show Type') {
          showType = element.content.text;
        }
        if (
          filterArray.find((x) => {
            return x === detailObjectHeading;
          })
        ) {
          detailsObjects[detailObjectHeading] = element.content.text;
        } else if (
          detailObjectHeading === SAFETY_BANNER_STRING &&
          element.content.text === YES_STRING
        ) {
          isSafetyBanner = true;
        }
      }
    }
  });

  return {
    detailsObjects,
    showType,
    isSafetyBanner,
  };
};

export const safetyChecker = (data) => {
  let isSafetyBanner = false;

  data.forEach((element, index) => {
    if (element.type == 'heading6' && element.text === SAFETY_BANNER_STRING) {
      if (index + 1 < data.length) {
        let nextElement = data[index + 1];
        if (
          nextElement.type == 'paragraph' &&
          nextElement.text === YES_STRING
        ) {
          isSafetyBanner = true;
        }
      }
    }
  });

  return isSafetyBanner;
};

export const parseShowPageData = (data) => {
  let faqHeading,
    faqSchema = [],
    tabSchema = [],
    tabHeading = [],
    currentObject,
    detailsObjects = {},
    DetailObjectHeading,
    tabSectionHeading,
    showType = '',
    isSafetyBanner = false,
    mapURL,
    listicleSchema = [],
    listicleHeading;

  data.forEach((element, idx) => {
    if (element.type == 'heading6') {
      // detail object heading
      DetailObjectHeading = element.content.text;
      currentObject = 'DETAIL';
    } else if (
      element.type == 'heading5' &&
      element.content.text?.startsWith('Listicle')
    ) {
      // listicle

      listicleHeading = element.content.text;
      currentObject = 'LISTICLE';
    } else if (
      element.type == 'heading2' &&
      (element.content.text?.startsWith('FAQs') ||
        element.content.text?.startsWith('Frequently Asked Questions'))
    ) {
      // faq heading

      faqHeading = element.content.text.trim();
      currentObject = 'FAQ';
    } else if (element.type == 'heading2') {
      // tab heading
      if (
        idx < data.length - 1 &&
        data[idx + 1].type != 'heading2' &&
        data[idx + 1].type != 'heading6'
      ) {
        if (tabSchema.length) {
          tabSchema.push(
            JSON.parse(`
                    {
                        "tab_name": "${element.content.text}",
                        "default_tab": "No",
                        "tab_content": []
                      }
                    `)
          );
        } else {
          tabSchema.push(
            JSON.parse(`
                    {
                        "tab_name": "${element.content.text}",
                        "default_tab": "Yes",
                        "tab_content": []
                      }
                    `)
          );
        }
        tabHeading.push(element.content.text);
        currentObject = 'TAB';
      } else {
        tabSectionHeading = element.content.text;
      }
    } else {
      if (currentObject === 'DETAIL') {
        // detail object content
        if (DetailObjectHeading == 'Show Type') {
          showType = element.content.text;
        }
        if (DetailObjectHeading === 'Google Map') {
          mapURL = element.content.text;
        }
        if (
          DETAILS_ALLOWED_SHOWPAGES.find((x) => {
            return x === DetailObjectHeading;
          })
        ) {
          detailsObjects[DetailObjectHeading] = element.content.text;
        } else if (
          DetailObjectHeading === SAFETY_BANNER_STRING &&
          element.content.text === YES_STRING
        ) {
          isSafetyBanner = true;
        }
      } else if (currentObject === 'TAB') {
        // tab content

        element.content.type = element.type;
        tabSchema[tabSchema.length - 1].tab_content.push(element.content);
      } else if (currentObject == 'LISTICLE') {
        // listicle content

        listicleSchema.push(
          JSON.parse(`{
          "heading": "${listicleHeading}",
          "text": ${JSON.stringify(element)}
        }`)
        );
      } else {
        // faq content
        if (element.content.text.startsWith('Q-')) {
          // Question

          faqSchema.push(
            JSON.parse(`
                {
                "heading": "${element.content.text.replace('Q-', '')}",
                    "content": []
                }`)
          );
        } else {
          // Answer
          element.content.text = element.content.text.replace('A-', '');
          element.content.type = element.type;
          for (let i = 0; i < element.content.spans.length; i++) {
            element.content.spans[i].start = element.content.spans[i].start - 2;
            element.content.spans[i].end = element.content.spans[i].end - 2;
          }
          faqSchema[faqSchema.length - 1]?.content.push(element.content);
        }
      }
    }
  });

  let tabSchemaHighlight = [];
  let tabSchemaInfo = [];
  let tabHeadingHighlight = [];
  let tabHeadingInfo = [];
  let highlightsSection;
  let aboutTheatreSection;

  tabSchema.forEach((element, index) => {
    if (element.tab_name === 'About Theatre') {
      element.tab_content.forEach((data) => {
        if (data.type === 'heading3') {
          data.type = 'heading2';
        }
        if (data.type === 'heading4') {
          data.type = 'heading2';
        }
      });
      aboutTheatreSection = element;
    }

    if (
      TAB_ALLOWED_HIGHLIGHT.find((x) => {
        return x === element.tab_name;
      })
    ) {
      element.tab_content.forEach((data) => {
        if (data.type === 'heading3') {
          data.type = 'heading2';
        }
        if (data.type === 'heading4') {
          data.type = 'heading2';
        }
      });

      tabSchemaHighlight.push(element);
      tabHeadingHighlight.push(tabHeading[index]);
    }

    if (element.tab_name === 'Highlights') {
      element.tab_content.forEach((data) => {
        if (data.type === 'heading3') {
          data.type = 'heading2';
        }
        if (data.type === 'heading4') {
          data.type = 'heading2';
        }
      });
      highlightsSection = element;
    }

    if (
      TAB_ALLOWED_INFO.find((x) => {
        return x === element.tab_name;
      })
    ) {
      element.tab_content.forEach((data) => {
        if (data.type === 'heading3') {
          data.type = 'heading2';
        }
      });

      tabSchemaInfo.push(element);
      tabHeadingInfo.push(tabHeading[index]);
    }
  });

  return {
    faqHeading,
    faqSchema,
    tabSchemaHighlight,
    tabSchemaInfo,
    tabHeadingHighlight,
    tabHeadingInfo,
    detailsObjects,
    tabSectionHeading,
    isSafetyBanner,
    showType,
    mapURL,
    highlightsSection,
    listicleSchema,
    aboutTheatreSection,
  };
};
