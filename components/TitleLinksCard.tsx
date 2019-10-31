import React, { Component } from "react";
import LinkResolver from "./LinkResolver";
type TitleLinksProps = {
  title: string;
  links: Array<any>;
};

export default class TitleLinksCard extends Component<TitleLinksProps, any> {
  render() {
    const { links, title } = this.props;
    return (
      <div className="links-card">
        <div className="title">{title}</div>
        <div className="card-links">
          <ul className="link-list">
            {links.map((link, index) => (
              <li key={index}>
                <LinkResolver className="link-item" url={link.link_type.url}>
                  {link.link_text}
                </LinkResolver>
              </li>
            ))}
          </ul>
        </div>

        <style jsx>
          {`
            .links-card {
              display: grid;
              grid-gap: 1em;
              align-items: start;
              grid-template-rows: max-content max-content;
              font-family: "Graphik", "Proxima Nova", "Helvetica Neue",
                Helvetica, Arial, sans-serif;
              line-height: 1.6;
            }
            .title {
              color: white;
              font-size: 20px;
              font-weight: 600;
              text-transform: Capitalize;
            }
            .link-list {
              display: grid;
              align-self: start;
              grid-auto-flow: row;
              grid-row-gap: 10px;
              margin: 0;
              padding: 0;
              list-style: none;
            }
            .link-list :global(.link-item) {
              color: white;
              text-decoration: none;
              font-size: 16px;
            }
            @media (max-width: 768px) {
              .links-card {
                grid-gap: unset;
                place-items: center;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
