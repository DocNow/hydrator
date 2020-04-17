import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import styled from 'styled-components'

import Menu from '../components/Menu'
import DatasetsPage from './DatasetsPage'
import DatasetPage from './DatasetPage'
import AddDatasetPage from './AddDatasetPage'
import SettingsPage from './SettingsPage'

const Container = styled.div`
  background-color: white;
`

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Container>
          <Menu />
          <div id="content">
            <Route exact path="/" component={DatasetsPage} />
            <Route path="/datasets" component={DatasetsPage} />
            <Route path="/dataset/:datasetId" component={DatasetPage} />
            <Route path="/add" component={AddDatasetPage} />
            <Route path="/settings" component={SettingsPage} />
          </div>
        </Container>
      </HashRouter>
    )
  }
}

export default App
