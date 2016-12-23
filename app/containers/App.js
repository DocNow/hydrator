import React, { Component, PropTypes } from 'react';

import Menu from '../components/Menu';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <div>
        <Menu />
        <div id="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
