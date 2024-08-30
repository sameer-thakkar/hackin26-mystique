const tourListCategoryV1Gq = `
    body {
        ...on tour_list_category_v1 {
            non-repeat {
                ...non-repeatFields
                product_cards {
                    ...on product_cards {
                        ...product_cardsFields
                    }
                }
            }
            repeat {
                ...repeatFields
            }
        }
        ...on tour_list_category {
            non-repeat {
                ...non-repeatFields
            }
            repeat {
                ...repeatFields
            }
        }
        ...on custom_banner {
            non-repeat {
                ...non-repeatFields
            }
            repeat {
                ...repeatFields
            }
        }
    }
`;

export const micrositeGq = `{
    microsite {
        ...micrositeFields
        ${tourListCategoryV1Gq}
        common_header_ref {
            ...on common_header {
                ...common_headerFields
            }
        }
        content_framework {
            ...on content_framework {
                ...content_frameworkFields
            }
        }
        footer_ref {
            ...on common_footer {
                ...common_footerFields
            }
        }
        secondary_footer {
            ...on common_footer {
                ...common_footerFields
            }
        }
    }
}`;

export const micrositeDefaultLangGq = `{
    microsite {
        ...micrositeFields
        ${tourListCategoryV1Gq}
    }
}`;

export const allShowPagesGq = `{
    showpage {
        tgid
    }
}`;
