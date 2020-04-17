import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const styles = {}

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #444;
  color: white;
  -webkit-app-region: drag;
`

const Link = styled.a`
  text-decoration: none;
  color: white;
`

const List = styled.ul`
  list-style: none;
  border: thin solid green;
  line-height: 30px;
  padding-left: 20px;
  margin: 0px;
  font-size: 12pt;

  a {
    color: white;
    text-decoration: none;
  }

  a.active {
    color: lightblue;
  }

  a:hover {
    color: lightblue;
  }
`

const ListItem = styled.li`
  display: inline;
  margin-right: 40px;
  font-weight: bold;
`

const Image = styled.img`
  height: 15px;
  vertical-align: middle; 
  margin-right: 10px;
`
export default class Menu extends Component {
  render() {
    return (
      <Container>
        <List>
          <ListItem className="logo"><Image src="./images/app.png" /></ListItem>
          <ListItem><NavLink to="/datasets" activeClassName={styles.active}>Datasets</NavLink></ListItem>
          <ListItem><NavLink to="/add" activeClassName={styles.active}>Add</NavLink></ListItem>
          <ListItem><NavLink to="/settings" activeClassName={styles.active}>Settings</NavLink></ListItem>
        </List>
      </Container>
    )
  }
}
