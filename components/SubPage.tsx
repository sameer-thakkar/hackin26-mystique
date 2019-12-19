import React, { Component } from "react";
import "lazysizes";
import classNames from "classnames";
import { CONTENT_TYPES } from "../constants";
import CustomHeader from "./CustomHeader";
import { sliceHandler } from "./Slices";
import CustomFooter from "./CustomFooter";
import Masthead from "./Masthead";
import populateHead from "./common/meta";
import { Client } from "../prismic-config";
// import Banner from "./Banner";
import { isMobile } from "../utils/helper";
import dynamic from "next/dynamic";
const GroupBooking = dynamic(() => import("./GroupBooking"), { ssr: false });
import { DROPDOWN_ELEMENT } from "../constants";

export default class SubPage extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      showGroupBookingModal: false,
      groupBookingTourTitles: null,
      dropdown: {
        lang: false,
        hamburger: false
      }
    };
  }
  async componentDidMount() {
    const {
      enable_group_booking: enableGroupBooking
    } = this.props.data.header_ref.data;
    if (enableGroupBooking === "Yes") {
      let groupBookingTourTitles = [];
      let res = await Client().getByIDs([
        this.props.data.microsite_document_ref.id
      ]);
      const {
        group_booking_excluded_tgids: groupBookingExcludedTgids,
        body1
      } = res.results[0].data;
      let lang = this.props.data.microsite_document_ref.lang.split("-")[0];
      let tours = body1[0].items || [];
      let filteredTours = tours.filter(function(tour) {
        return !groupBookingExcludedTgids.find(function(excludedTour) {
          return tour.tgid === excludedTour.tgid;
        });
      });
      filteredTours.map(async (tour, index) => {
        if (!tour.tour_title_override) {
          let tourTitle = await fetch(
            `https://api.headout.com/api/v5/tour-group/get/${tour.tgid}?language=${lang}`
          ).then(r => r.json());
          groupBookingTourTitles.push({
            value: tourTitle.name,
            label: tourTitle.name
          });
        } else {
          groupBookingTourTitles.push({
            value: tour.tour_title_override,
            label: tour.tour_title_override
          });
        }
      });
      this.setState({
        groupBookingTourTitles
      });
    }
  }

  openGroupBookingModal = () => this.setState({ showGroupBookingModal: true });
  closeGroupBookingModal = () =>
    this.setState({ showGroupBookingModal: false });

  prettifyProps(props) {
    let body = props.data.body;
    let featured = props.featured;
    let footer;

    props.subs.forEach(sub => {
      switch (sub.type) {
        case CONTENT_TYPES.FOOTER:
          footer = sub;
          break;
      }
    });
    return {
      footer,
      body,
      featured,
      data: props.data
    };
  }
  handleDropdownToggle = elementIdentifier => {
    switch (elementIdentifier) {
      case DROPDOWN_ELEMENT.HAMBURGER: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            hamburger: !this.state.dropdown.hamburger,
            lang: false
          }
        });
        break;
      }
      case DROPDOWN_ELEMENT.LANGUAGE_SELECTOR: {
        this.setState({
          ...this.state,
          dropdown: {
            ...this.state.dropdown,
            lang: !this.state.dropdown.lang,
            hamburger: false
          }
        });
        break;
      }
      default:
        return;
    }
  };

  render() {
    const {
      footer,
      data,
      data: { body, header_ref, microsite_document_ref },
      featured
    } = this.prettifyProps(this.props);
    const {
      first_publication_date: datePublished,
      last_publication_date: dateModified,
      lang,
      isDev,
      host,
      serverRequestStartTimestamp
    } = this.props;

    const contentPageHasOtherMetaTags = data.other_meta_tags.filter(
      ({ meta_tag }) => meta_tag
    );

    const strKeys = [
      "title",
      "description",
      "gtm_id",
      "seo_keywords",
      "google_site_verification",
      "bing_site_verification",
      "noindex",
      "nofollow",
      "page_url"
    ];
    const objKeys = ["image", "other_meta_tags"];

    const strValues = strKeys.reduce(
      (acc, elem) => ({
        ...acc,
        [elem]: this.props.data[elem] || microsite_document_ref.data[elem]
      }),
      {}
    );

    const objValues = objKeys.reduce(
      (acc, elem) => ({
        ...acc,
        [elem]: Object.keys(this.props.data[elem]).length
          ? this.props.data[elem]
          : microsite_document_ref.data[elem]
      }),
      {}
    );

    const micrositeData = {
      ...this.props.data,
      ...strValues,
      ...objValues
    };

    const headProps = {
      ...micrositeData,
      favicon: microsite_document_ref.data.favicon,
      header_scripts: microsite_document_ref.data.header_scripts,
      canonical_link:
        this.props.data.canonical_link || this.props.data.page_url,
      other_meta_tags: contentPageHasOtherMetaTags
        ? this.props.data.other_meta_tags
        : microsite_document_ref.other_meta_tags,
      faq_schema: this.props.data.faq_schema
    };

    const {
      enable_group_booking: enableGroupBooking,
      logo_redirection_url: logoRedirectionURL
    } = this.props.data.header_ref.data;
    const {
      blackout_start_date: blackoutStartDate,
      blackout_end_date: blackoutEndDate,
      block_n_days_group_booking: blockNDaysGroupBooking,
      minimum_pax: minimumPax,
      maximum_pax: maximumPax
    } = this.props.data.microsite_document_ref.data;
    const showGroupBooking = enableGroupBooking === "Yes";
    const { groupBookingTourTitles } = this.state;
    return (
      <div className="page-wrapper">
        {this.state.showGroupBookingModal && groupBookingTourTitles && (
          <GroupBooking
            closeGroupBookingModal={() => this.closeGroupBookingModal}
            groupBookingTourTitles={groupBookingTourTitles}
            blackoutStartDate={blackoutStartDate}
            blackoutEndDate={blackoutEndDate}
            blockNDaysGroupBooking={blockNDaysGroupBooking}
            minimumPax={minimumPax ? minimumPax : 15}
            maximumPax={maximumPax ? minimumPax : undefined}
          />
        )}
        {populateHead({
          ...headProps,
          datePublished,
          dateModified,
          lang,
          isDev,
          originalHost: host,
          serverRequestStartTimestamp
        })}
        <header>
          <CustomHeader
            isMobile={isMobile}
            {...header_ref.data}
            parentComponent="SubPage"
            openGroupBookingModal={this.openGroupBookingModal}
            showGroupBooking={showGroupBooking}
            logoRedirectionURL={logoRedirectionURL.url || "/"}
            hasPoweredByHeadoutLogo={
              microsite_document_ref.data.enable_powered_by_headout_logo ===
              "Yes"
            }
            dropdown={this.state.dropdown}
            handleDropdownToggle={this.handleDropdownToggle}
          />
        </header>
        <main
          className={classNames({ "content-wrapper": !featured.image.url })}
        >
          {featured.image.url && (
            <Masthead title={featured.title} image={featured.image.url} />
          )}
          <div className="subpage-container">
            {body.map((slice, index) => (
              <div key={index} className="slice-block">
                {sliceHandler(slice)}
              </div>
            ))}
          </div>
        </main>
        <footer>
          <CustomFooter {...footer.data} />
        </footer>
      </div>
    );
  }
}
