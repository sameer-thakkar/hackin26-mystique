import { Component } from 'react';

export default class BlogSlugPage extends Component {
  static async getInitialProps({
    res,
    query
  }: any) {
    await fetch(`https://blog.headout.com/${query.slug.join('/')}`)
      .then((r) => r.json())
      .then((r) => {
        res.setHeader('Content-type', 'application/json');
        res.write(JSON.stringify(r));
        res.end();
      });
  }
}
