export const micrositeStaticPageGq = `{
    microsite {
        ...micrositeFields
        footer_ref {
            ...on common_footer {
                ...common_footerFields
            }
        }
    }
}`;

export const globalHomepagStaticPageGq = `{
    global_homepage {
        ...global_homepageFields
        common_footer {
            ...on common_footer {
                ...common_footerFields
            }
        }
    }
}`;
