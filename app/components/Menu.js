import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Menu.css';


export default class Menu extends Component {
  render() {
    return (
      <div className={styles.container}>
        <ul>
          <li className="logo"><img src="./app.png" /></li>
          <li><Link to="/datasets" activeClassName={styles.active}>Datasets</Link></li>
          <li><Link to="/add" activeClassName={styles.active}>Add</Link></li>
          <li><Link to="/settings" activeClassName={styles.active}>Settings</Link></li>
        </ul>
      </div>
    );
  }
}
