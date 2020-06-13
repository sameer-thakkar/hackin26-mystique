import { Component } from 'react';

export default class BlogSlugPage extends Component {
  static async getInitialProps({ res, query }) {
    res.writeHead(301, {
      Location: `https://blog.headout.com/${query.slug.join('/')}`,
    });
    res.end();
  }
}
