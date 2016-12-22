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
        {
          (() => {
            if (process.env.NODE_ENV !== 'production') {
              const DevTools = require('./DevTools'); // eslint-disable-line global-require
              return <DevTools />;
            }
          })()
        }
        </div>
      </div>
    );
  }
}
