import React, { Component } from 'react'
import { basename } from 'path'
import styled from 'styled-components'
const {dialog} = require('electron').remote

const Verifying = styled.div`
  margin-top: 10px;
  font-style: italic;
  animation: flickerAnimation 2s infinite;

  @keyframes flickerAnimation {
    0%   { opacity:1; }
    50%  { opacity:0; }
    100% { opacity:1; }
  }
`

var FileStats = (props) => {
  if (props.numTweetIds && props.selectedFile) {
    return(
      <div>
        <br />
        <label>Path:</label>
        <div>{ props.selectedFile }</div>
        <br />
        <label>Number of Tweet IDs:</label>
        <div>{ props.numTweetIds.toLocaleString() }</div>
      </div>
    )
  } else if (props.checkingFile) {
    var filename = basename(props.selectedFile)
    return(
      <Verifying>
        Verifying { filename } ...
      </Verifying>
    )
  } else {
    return <span></span>
  }
}


export default class AddDataset extends Component {

  componentDidMount() { 
   if (! this.props.twitterAccessKey) {
      this.props.history.push("/settings") 
    }
  }

  render() {

    // can't add dataset while it is being checked
    var addDisabled =  this.props.checkingFile == true || ! this.props.selectedFile
    var selectDisabled = this.props.checkingFile == true

    return (
      <div>

        <details open>
          <summary>Add a New Dataset</summary>
          <p>
            <em>Hydrate</em> a new dataset by selecting a file of tweet 
            identifiers and entering some descriptive information about 
            your new dataset.
          </p>
        </details>

        <form onSubmit={(e) => {
          e.preventDefault()
          this.props.addDataset(
            this.props.selectedFile,
            this.props.numTweetIds,
            title.value,
            creator.value,
            publisher.value,
            url.value)
          this.props.history.push("/datasets") 
        }}> 

          <button disabled={selectDisabled} onClick={(e) => {
            e.preventDefault()
            this.props.unchooseFile()
            dialog.showOpenDialog()
              .then(choice => {
                if (! choice.canceled) {
                  this.props.chooseFile(choice.filePaths[0])
                  this.props.checkFile(choice.filePaths[0])
                }
              })
          }}>Select Tweet ID file</button>

          <br />

          <FileStats
            checkingFile={this.props.checkingFile} 
            numTweetIds={this.props.numTweetIds}
            selectedFile={this.props.selectedFile} />
          
          <br />

          <label htmlFor="title">Title:</label>
          <input
            required={true}
            id="title"
            name="title"
            type="text"
            onChange={ this.props.prepDataset }
            value={ this.props.title }>
          </input>

          <label htmlFor="creator">Creator:</label>
          <input
            id="creator" 
            name="creator" 
            type="text" 
            onChange={ this.props.prepDataset } 
            value={ this.props.creator }>
          </input>

          <label htmlFor="publisher">Publisher:</label>
          <input 
            id="publisher"
            name="publisher"
            type="text"
            onChange={ this.props.prepDataset }
            value={ this.props.publisher }>
          </input>

          <label htmlFor="url">URL:</label>
          <input
            id="url"
            name="url"
            type="url"
            onChange={ this.props.prepDataset }
            value={ this.props.url }>
          </input>

          <br />
          <br />

          <button disabled={addDisabled}>Add Dataset</button>
        </form>
      </div>
    );
  }
}
