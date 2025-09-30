import React from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Head from 'next/head';
import { getUID } from '../utils/helper';

// Force SSR instead of static generation to prevent build-time Leaflet imports
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default class CreateUID extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      uid: '',
      copied: false,
    };

    this.onChangeURL = this.onChangeURL.bind(this);
  }

  onChangeURL(e: any) {
    let text = e.target.value;
    if (text.indexOf('http') !== 0) {
      text = `https://${text}`;
    }
    this.setState({ uid: getUID(text), copied: false });
  }

  render() {
    return (
      <div>
        <Head>
          <meta name="robots" content="nofollow, noindex" />
          <title>Headout | Generate Prismic UID</title>
        </Head>

        <div style={{ width: '600px', margin: '0 auto', padding: '5rem 0' }}>
          <form>
            <label
              htmlFor="uid-url"
              style={{
                fontSize: '18px',
                marginBottom: '4px',
                display: 'block',
              }}
            >
              Enter Full Page URL here:
            </label>
            <input
              type="text"
              id="uid-url"
              name="uid-url"
              onChange={this.onChangeURL}
              style={{
                height: '40px',
                width: '100%',
                outline: 'none',
                border: '2px solid #aaa',
                borderRadius: '0',
                display: 'block',
                lineHeight: '40px',
                padding: '0 8px',
                fontSize: '24px',
                boxSizing: 'border-box',
              }}
            />
          </form>

          {this.state.uid ? (
            <CopyToClipboard
              text={this.state.uid}
              onCopy={() => this.setState({ copied: true })}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <p
                  style={{
                    cursor: 'pointer',
                    fontSize: '18px',
                    marginRight: '8px',
                  }}
                >
                  UID: {this.state.uid}
                </p>
                <button
                  style={{
                    lineHeight: '16px',
                    fontSize: '16px',
                    background: 'none',
                    color: 'green',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    flex: '0 0 210px',
                    padding: 0,
                    textAlign: 'right',
                  }}
                >
                  Tap anywhere to copy!
                </button>
              </div>
            </CopyToClipboard>
          ) : null}

          {this.state.copied ? (
            <p
              style={{
                color: 'green',
                fontSize: '12px',
              }}
            >
              Copied.
            </p>
          ) : null}
        </div>
      </div>
    );
  }
}
