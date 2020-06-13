import { Component } from 'react';

export default class BlogPage extends Component {
  static async getInitialProps({ res }) {
    res.writeHead(301, { Location: 'https://blog.headout.com/' });
    res.end();
  }
}
