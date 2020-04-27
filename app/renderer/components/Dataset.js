import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const {dialog} = require('electron').remote

const Container = styled.article`
  font-size: 12pt;
  margin-bottom: 10px;

  a {
    font-size: 12pt;
    text-decoration: none;
    color: black;
  }
`

const Title = styled.div`
  font-weight: bold;
  padding-bottom: 5px;
`

const Bar = styled.div`
  line-height: 23px;
  width: 60%;
  margin-right: 10px;
  float: left;
  border: thin solid #aaa;
`

const Progress = styled.div`
  background-color: lightblue;
  font-size: 9pt;
  white-space: nowrap;
`

const Complete = styled.div`
  background-color: lightgreen;
  font-size: 9pt;
  white-space: nowrap;
`

const Button = styled.button`
  margin-left: 10px;
  line-height: 20px;
  font-weight: bold;
  background-color: #eee;
`

const StopButton = styled(Button)`
  background-color: pink;
`

const StartButton = styled(Button)`
  background-color: lightgreen;
`

const DeleteButton = styled(Button)`
  background-color: pink;
`

const CsvButton = styled(Button)`
  background-color: lightblue;
`


const ProgressBar = (props) => {
  const complete = Math.ceil((props.idsRead / props.numTweetIds) * 100)
  let ThisProgress = Progress
  if (props.completed) {
    ThisProgress = Complete
  }
  return(
    <Link to={"/dataset/" + props.datasetId}>
      <Bar>
        <ThisProgress style={{width: complete + '%'}}>
          <span>&nbsp; {props.idsRead.toLocaleString()} of {props.numTweetIds.toLocaleString()} ids read ({props.tweetsHydrated.toLocaleString()})</span>
        </ThisProgress>
      </Bar>
    </Link>
  )
}

export default class Dataset extends Component {
  render() {

    // figure out which button to display based on state: start, stop, csv
    let button = null

    if (this.props.completed) {
      const defaultCsvPath = this.props.path.replace(/\..+$/, '.csv')

      button = <CsvButton disabled={this.props.csvExportStarted === true} onClick={() => {
        dialog.showSaveDialog({
          title: "Export JSON as CSV to:", 
          defaultPath: defaultCsvPath
        })
          .then(selection => {
            if (! selection.canceled) {
              this.props.exportCsv(this.props.id, selection.filePath)
            }
          })
      }}>CSV</CsvButton>
    }  else if (this.props.hydrating) {
      button = <StopButton onClick={() => this.props.stopHydration(this.props.id)}>Stop</StopButton>
    } else {
      const defaultJsonPath = this.props.path.replace(/\..+$/, '.jsonl')
      button = <StartButton onClick={() => {
        if (! this.props.outputPath) {
          dialog.showSaveDialog({
            title: "Write Tweet JSON to:",
            defaultPath: defaultJsonPath
          })
            .then(selection => {
              if (! selection.canceled) {
                this.props.setOutputPath(this.props.id, selection.filePath)
                this.props.startHydration(this.props.id)
              }
            })
        } else {
          this.props.startHydration(this.props.id)
        }
      }}>Start</StartButton>
    }

    return (
      <Container>
        <Title>
          <Link to={"/dataset/" + this.props.id}>{this.props.title}</Link>
        </Title>
        <ProgressBar
          datasetId={this.props.id} 
          numTweetIds={this.props.numTweetIds} 
          idsRead={this.props.idsRead} 
          tweetsHydrated={this.props.tweetsHydrated} 
          completed={this.props.completed} 
          csvExportStarted={this.props.csvExportStarted} />
        <div>
          {button}
          <DeleteButton onClick={() => this.props.deleteDataset(this.props.id)}>Delete</DeleteButton>
        </div>
      </Container>
    )
  }
 } 
