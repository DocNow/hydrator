import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styles from './Dataset.css'
import CommaNumber from './CommaNumber'

const {dialog} = require('electron').remote

var ProgressBar = (props) => {
  let complete = Math.ceil((props.idsRead / props.numTweetIds) * 100)
  let style = {width: complete + "%"}
  var barProgress = styles.progress
  if (props.completed) {
    barProgress = styles.complete
  }
  return(
    <Link to={"/dataset/" + props.datasetId}>
    <div className={styles.bar}>
      <div className={barProgress} style={style}><span>&nbsp;<CommaNumber value={props.idsRead} /> of <CommaNumber value={props.numTweetIds} /> ids read (<CommaNumber value={props.tweetsHydrated} />)</span></div>
    </div>
    </Link>
  )
}

var StartButton = (props) => {
  return <button onClick={props.onClick} className={styles.start}>Start</button>
}

var StopButton = (props) => {
  return <button onClick={props.onClick} className={styles.stop}>Stop</button>
}

var CsvButton = (props) => {
  if (props.csvExportStarted) {
    return <button disabled className={styles.csv}>CSV</button>
  } else {
    return <button onClick={props.onClick} className={styles.csv}>CSV</button>
  }
}

export default class Dataset extends Component {
  render() {
    var button = null
    if (this.props.completed) {
      button = <CsvButton csvExportStarted={this.props.csvExportStarted} onClick={(e) => {
        let file = dialog.showSaveDialog({title: "Export JSON as CSV to:"})
        if (file) {
          this.props.exportCsv(this.props.id, file)
        } else {
          return
        }
     }} />
    }  else if (this.props.hydrating) {
      button = <StopButton onClick={(e) => this.props.stopHydration(this.props.id)} />
    } else {
      button = <StartButton onClick={(e) => {
        if (! this.props.outputPath) {
          let file = dialog.showSaveDialog({title: "Write Tweet JSON to:"})
          if (file) {
            this.props.setOutputPath(this.props.id, file)
          } else {
            return
          }
        }
        this.props.startHydration(this.props.id)
      }}/>
    }
    return (
      <item className={styles.container}>
        <div className={styles.title} ><Link to={"/dataset/" + this.props.id}>{this.props.title}</Link></div>
        <ProgressBar
          datasetId={this.props.id} 
          numTweetIds={this.props.numTweetIds} 
          idsRead={this.props.idsRead} 
          tweetsHydrated={this.props.tweetsHydrated} 
          completed={this.props.completed} 
          csvExportStarted={this.props.csvExportStarted} />
        {button}
        <button className={styles.delete} onClick={(e) => this.props.deleteDataset(this.props.id)}>Delete</button>
      </item>
    )
  }
 } 
