import React, { Component } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import Menu from '../components/Menu'
import DatasetsPage from './DatasetsPage'
import DatasetPage from './DatasetPage'
import AddDatasetPage from './AddDatasetPage'
import SettingsPage from './SettingsPage'

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Menu />
          <div id="content">
            <Route exact path="/" component={DatasetsPage} />
            <Route path="/datasets" component={DatasetsPage} />
            <Route path="/dataset/:datasetId" component={DatasetPage} />
            <Route path="/add" component={AddDatasetPage} />
            <Route path="/settings" component={SettingsPage} />
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default App
