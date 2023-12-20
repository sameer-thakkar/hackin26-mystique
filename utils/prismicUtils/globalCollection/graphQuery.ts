export const globalCollectionGq = `
    {
        global_collection {
            ...global_collectionFields
            content_framework {
                ...on content_framework {
                    ...content_frameworkFields
                }
            }
            common_header {
                ...on common_header {
                    ...common_headerFields
                }
            }
            common_footer {
                ...on common_footer {
                    ...common_footerFields
                }
            }
        }
    }
`;
