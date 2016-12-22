import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from './DatasetDetail.css'
import numeral from 'numeraljs'
import CommaNumber from './CommaNumber'

export default class DatasetDetail extends Component {


  static propTypes = {
    // getTwitterAuthUrl: PropTypes.func.isRequired,
  }

  render() {
    var d = this.props.dataset

    var status = ""
    if (d.completed) {
      status = "Completed " + d.completed
    } else if (d.hydrating) {
      status = "Hydrating" 
    } else {
      status = "Stopped"
    }

    var percentDeleted = ""
    if (d.tweetsHydrated) {
      percentDeleted = (100 - Math.round((d.tweetsHydrated / d.idsRead) * 100)) + "%"
    } else {
      "n/a"
    }

    var csvPath = ""
    if (d.csvPath) {
      csvPath = 
        <div>
           <label>CSV File</label>
           <div>{ d.csvPath }</div>
           <br />
        </div>
    }

    return(  
      <div className={styles.container}>
        <label>Title:</label>
        <div>{ d.title }</div>
        <br />
        <label>Status:</label>
        <div>{ status }</div>
        <br />
        <label>Tweet ID File:</label>
        <div>{ d.path }</div>
        <br />
        <label>Hydrated JSON:</label>
        <div>{ d.outputPath }</div>
        <br />
        { csvPath }
        <label>Total Tweet Ids:</label>
        <div><CommaNumber value={ d.numTweetIds } /></div>
        <br />
        <label>Tweet Ids Read:</label>
        <div><CommaNumber value={ d.idsRead } /></div>
        <br />
        <label>Tweets Hydrated:</label>
        <div><CommaNumber value={ d.tweetsHydrated } /></div>
        <br />
        <label>Percent Deleted:</label>
        <div>{ percentDeleted }</div> 
        <br />
        <label>Creator:</label>
        <div>{ d.creator }</div>
        <br />
        <label>Publisher:</label>
        <div>{ d.publisher }</div>
        <br />
        <label>URL:</label>
        <div>{ d.url }</div>
      </div>
    )
  }
}
