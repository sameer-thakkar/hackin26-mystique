import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { YES_STRING } from 'const/index';
import { strings } from 'const/strings';

dayjs.extend(isSameOrAfter);

export const getObject = (data: any, filterArray: any) => {
  let detailsObjects: { [key: string]: string } = {},
    showType = '',
    detailObjectHeading: any,
    isSafetyBanner = false,
    currentObject: any;

  data?.forEach?.((element: any) => {
    if (element.type == 'heading6') {
      // detail object heading
      detailObjectHeading = element.content.text;
      currentObject = 'DETAIL';
    } else if (
      element.type == 'heading2' &&
      (element.content.text?.startsWith('FAQs') ||
        element.content.text?.startsWith(
          strings.SHOW_PAGE.FREQUENTLY_ASKED_QUESTIONS
        ))
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
        if (detailObjectHeading === strings.SHOW_PAGE.SHOW_TYPE) {
          showType = element.content.text;
        }
        if (
          detailObjectHeading === strings.SHOW_PAGE.THEATRE_NAME &&
          element?.content?.spans?.[0]?.data?.url
        ) {
          detailsObjects.theatrePageUrl = element.content.spans[0].data.url;
        }
        if (
          filterArray.find((x: any) => {
            return x === detailObjectHeading;
          })
        ) {
          detailsObjects[detailObjectHeading] = element.content.text;
        } else if (
          detailObjectHeading === strings.SHOW_PAGE.SAFETY_BANNER &&
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

export const safetyChecker = (data: any) => {
  let isSafetyBanner = false;

  data.forEach((element: any, index: number) => {
    if (
      element.type == 'heading6' &&
      element.text === strings.SHOW_PAGE.SAFETY_BANNER
    ) {
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

export const parseShowPageData = (data: any) => {
  let faqHeading,
    faqSchema: any = [],
    tabSchema: any = [],
    tabHeading: any = [],
    currentObject: any,
    detailsObjects: Record<string, any> = {},
    DetailObjectHeading: any,
    tabSectionHeading,
    isSafetyBanner = false,
    specialOffer: Record<string, string> = {},
    specialOfferClosingDate: any,
    hasSpecialOffer = false,
    mapURL,
    listicleSchema: any = [],
    listicleHeading: any;

  const TAB_ALLOWED_HIGHLIGHT = [
    strings.SHOW_PAGE.ABOUT_SHOW,
    strings.SHOW_PAGE.SHOW_DETAILS,
    strings.SHOW_PAGE.AGE_SUITABILITY,
    strings.SHOW_PAGE.TOP_SONGS,
    strings.SHOW_PAGE.TICKETS,
    strings.SHOW_PAGE.ABOUT_CONCERT,
    strings.SHOW_PAGE.PROGRAM,
  ];

  const TAB_ALLOWED_INFO = [
    strings.SHOW_PAGE.GETTING_THERE,
    strings.SHOW_PAGE.FACILITIES_AND_ACCESSIBILITY,
    strings.SHOW_PAGE.ADDITIONAL_INFORMATION,
  ];

  const DETAILS_ALLOWED_SHOWPAGES = [
    strings.SHOW_PAGE.OPENING_DATE,
    strings.SHOW_PAGE.CLOSING_DATE,
    strings.SHOW_PAGE.THEATRE_NAME,
    strings.SHOW_PAGE.DURATION,
    strings.SHOW_PAGE.AGE_LIMIT,
  ];

  data?.forEach?.((element: any, index: number) => {
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
        (element.content.text as string)
          ?.toLowerCase()
          .startsWith(
            strings.SHOW_PAGE.FREQUENTLY_ASKED_QUESTIONS.toLowerCase()
          ))
    ) {
      // faq heading

      faqHeading = element.content.text.trim();
      currentObject = 'FAQ';
    } else if (element.type == 'heading2') {
      // tab heading
      if (
        index < data.length - 1 &&
        data[index + 1].type != 'heading2' &&
        data[index + 1].type != 'heading6'
      ) {
        tabSchema.push({
          tab_name: element.content.text,
          default_tab: tabSchema.length ? 'No' : 'Yes',
          tab_content: [],
        });
        tabHeading.push(element.content.text);
        currentObject = 'TAB';
      } else {
        tabSectionHeading = element.content.text;
      }
    } else {
      if (currentObject === 'DETAIL') {
        // detail object content
        if (DetailObjectHeading === strings.SHOW_PAGE.GOOGLE_MAP) {
          mapURL = element.content.text;
        }
        if (
          DETAILS_ALLOWED_SHOWPAGES.find((x) => {
            return x === DetailObjectHeading;
          })
        ) {
          detailsObjects[DetailObjectHeading] = element.content.text;
        }
        if (
          DetailObjectHeading === strings.SHOW_PAGE.SAFETY_BANNER &&
          element.content.text === YES_STRING
        ) {
          isSafetyBanner = true;
        }
        if (
          DetailObjectHeading.toLowerCase() ===
          strings.SHOW_PAGE.CLOSING_DATE_SPECIAL_OFFER.toLowerCase()
        ) {
          specialOfferClosingDate = dayjs(element.content.text, 'YYYY-MM-DD');
        }
        if (DetailObjectHeading.startsWith(strings.SHOW_PAGE.SPECIAL_OFFER)) {
          if (
            specialOfferClosingDate &&
            !specialOfferClosingDate.isSameOrAfter(dayjs())
          ) {
            hasSpecialOffer = false;
          } else {
            specialOffer = {
              offerHeading: DetailObjectHeading.replace(
                /(Special Offer:)|(Special Offer :)/,
                ''
              ).trim(),
              offerText: element.content.text,
            };
            hasSpecialOffer = true;
          }
        }

        if (
          DetailObjectHeading === strings.SHOW_PAGE.THEATRE_NAME &&
          element?.content?.spans?.[0]?.data?.url
        ) {
          detailsObjects.theatrePageUrl = element.content.spans[0].data.url;
        }
      } else if (currentObject === 'TAB') {
        // tab content
        element.content.type = element.type;
        tabSchema[tabSchema.length - 1].tab_content.push(element.content);
      } else if (currentObject == 'LISTICLE') {
        // listicle content
        listicleSchema.push({
          heading: listicleHeading,
          text: element,
        });
      } else {
        // faq content
        const question = strings.SHOW_PAGE.QUESTION.find((item) =>
          element.content.text.includes(item)
        );

        if (element.content.text.startsWith(question)) {
          // Question
          faqSchema.push({
            heading: element.content.text.replace(question, ''),
            content: [],
          });
        } else {
          // Answer
          const answer = strings.SHOW_PAGE.ANSWER.find((item) =>
            element.content.text.includes(item)
          );

          element.content.text = element.content.text.replace(answer, '');
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

  let tabSchemaHighlight: any = [];
  let tabSchemaInfo: any = [];
  let tabHeadingHighlight: any = [];
  let tabHeadingInfo: any = [];
  let highlightsSection;
  let aboutTheatreSection;
  let criticReview: Record<string, any> = {};

  // @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
  tabSchema.forEach((element, index) => {
    if (element.tab_name === strings.SHOW_PAGE.ABOUT_THEATRE) {
      element.tab_content.forEach((data: any) => {
        if (data.type === 'heading3') {
          data.type = 'heading2';
        }
        if (data.type === 'heading4') {
          data.type = 'heading2';
        }
      });
      aboutTheatreSection = element;
    }
    if (element.tab_name === strings.SHOW_PAGE.CRITIC_REVIEW) {
      element.tab_content.forEach((data: any) => {
        if (data.type === 'heading3') {
          data.type = 'heading2';
        }
        if (data.type === 'heading4') {
          data.type = 'heading2';
        }
      });
      criticReview = element;
    }
    if (
      TAB_ALLOWED_HIGHLIGHT.find((x) => {
        return x === element.tab_name;
      })
    ) {
      element.tab_content.forEach((data: any) => {
        if (data.type === 'heading3' || data.type === 'heading4') {
          data.type = 'heading2';
        }
      });

      tabSchemaHighlight.push(element);
      tabHeadingHighlight.push(tabHeading[index]);
    }

    if (element.tab_name === strings.SHOW_PAGE.HIGHLIGHTS) {
      element.tab_content.forEach((data: any) => {
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
      element.tab_content.forEach((data: any) => {
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
    specialOffer,
    hasSpecialOffer,
    mapURL,
    highlightsSection,
    listicleSchema,
    aboutTheatreSection,
    criticReview,
  };
};
