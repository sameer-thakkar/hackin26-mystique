import {
  DETAILS_ALLOWED_SHOWPAGES,
  YES_STRING,
  SAFETY_BANNER_STRING,
  TAB_ALLOWED_HIGHLIGHT,
  TAB_ALLOWED_INFO,
} from 'constants/index';

export const parseShowPageData = (data) => {
  let faqHeading,
    faqSchema = [],
    tabSchema = [],
    tabHeading = [],
    currentObject,
    detailsObjects = {},
    DetailObjectHeading,
    tabSectionHeading,
    isSafetyBanner = false;

  data.forEach((element, idx) => {
    if (element.type == 'heading6') {
      // detail object heading
      DetailObjectHeading = element.content.text;
      currentObject = 'DETAIL';
    } else if (
      element.type == 'heading2' &&
      element.content.text?.startsWith('FAQs')
    ) {
      // faq heading

      faqHeading = element.content.text.replace('FAQs |', '').trim();
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
      } else {
        // faq content
        if (element.content.text.startsWith('Q-')) {
          // Question

          faqSchema.push(
            JSON.parse(`
                        {
                            "heading": "${element.content.text
                .replace('Q-', '')
                .trim()}",
                            "content": []
                        }
                        `)
          );
        } else {
          // Answer
          element.content.text = element.content.text.replace('A-', '').trim();
          element.content.type = element.type;

          faqSchema[faqSchema.length - 1]?.content.push(element.content);
        }
      }
    }
  });

  let tabSchemaHighlight = [];
  let tabSchemaInfo = [];
  let tabHeadingHighlight = [];
  let tabHeadingInfo = [];

  tabSchema.forEach((element, index) => {
    if (
      TAB_ALLOWED_HIGHLIGHT.find((x) => {
        return x === element.tab_name;
      })
    ) {
      tabSchemaHighlight.push(element);
      tabHeadingHighlight.push(tabHeading[index]);
    }

    if (
      TAB_ALLOWED_INFO.find((x) => {
        return x === element.tab_name;
      })
    ) {
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
  };
};
