import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Menu.css';


export default class Menu extends Component {
  render() {
    return (
      <div className={styles.container}>
        <ul>
          <li className="logo"><img src="./images/app.png" /></li>
          <li><NavLink to="/datasets" activeClassName={styles.active}>Datasets</NavLink></li>
          <li><NavLink to="/add" activeClassName={styles.active}>Add</NavLink></li>
          <li><NavLink to="/settings" activeClassName={styles.active}>Settings</NavLink></li>
        </ul>
      </div>
    );
  }
}
