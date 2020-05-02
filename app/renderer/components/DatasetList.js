import React, { Component } from 'react';
import Dataset from './Dataset'
import styled from 'styled-components'

const Container = styled.div`
  h2 {
    font-size: 5rem;
  }

  a {
    font-size: 1.4rem;
  }

  ul {
    list-style-type: none;
    -webkit-padding-start: 0px;
  }

  li {
    margin-top: 15px;
    margin-left: 0px;
  }
`

const RateLimit = styled.div`
  font-size: 12pt;  
  color: red;
`

class DatasetList extends Component {

  componentDidMount() { 
    if (this.props.datasets.length == 0) {
      this.props.history.push("/add") 
    }
  }

  render() {
    var resetMessage = ""
    if (this.props.resetTime) {
      const t = new Date(this.props.resetTime)
      resetMessage = 
        <RateLimit>
          {`Rate limited until ${t.toLocaleTimeString()}`}
        </RateLimit>
    }
    return (
      <Container>
        <details open>
        <summary>Your Datasets</summary>
        <p>
        <em>Start</em> and <em>Stop</em> hydration as needed. 
        Hydrator will manage your <em>Twitter API Rate Limits</em> for you. 
        Click on the dataset for details.
        </p>
        </details>
        {resetMessage}
        <ul>
          {this.props.datasets.map(dataset => 
            <li key={dataset.id}>
              <Dataset {...dataset} 
                startHydration={this.props.startHydration}
                deleteDataset={this.props.deleteDataset} 
                stopHydration={this.props.stopHydration}
                setOutputPath={this.props.setOutputPath}
                exportCsv={this.props.exportCsv}
                csvExportStarted={dataset.csvExportStarted}
                numTweetIds={dataset.numTweetIds} 
                idsRead={dataset.idsRead}
                tweetsHydrated={dataset.tweetsHydrated}
                completed={dataset.completed} />
              </li>
          )}
        </ul>
        <br />
      </Container>
    )
  }
}

export default DatasetList
