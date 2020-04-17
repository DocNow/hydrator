import React, { Component } from 'react'
import moment from 'moment'

export default class DatasetDetail extends Component {

  render() {
    var d = this.props.dataset

    var status = ""
    if (d.completed) {
      status = "Completed " + moment(d.completed).format('LLL')
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
      <div>
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
        <div>{ d.numTweetIds.toLocaleString() }</div>
        <br />
        <label>Tweet Ids Read:</label>
        <div>{ d.idsRead.toLocaleString() }</div>
        <br />
        <label>Tweets Hydrated:</label>
        <div>{ d.tweetsHydrated.toLocaleString() }</div>
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
