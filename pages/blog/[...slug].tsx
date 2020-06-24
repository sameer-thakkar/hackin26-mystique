import { Component } from 'react';

export default class BlogSlugPage extends Component {
  static async getInitialProps({ res, query }) {
    await fetch(`https://blog.headout.com/${query.slug.join('/')}`)
      .then((r) => r.json())
      .then((r) => res.json(r));
  }
}
