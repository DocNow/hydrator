import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from './AddDataset.css'
import CommaNumber from './CommaNumber'

const {dialog} = require('electron').remote

var FileStats = (props) => {
  if (props.numTweetIds && props.selectedFile) {
    return(
      <div>
        <br />
        <label>Path:</label>
        <div>{ props.selectedFile }</div>
        <br />
        <label>Number of Tweet IDs:</label>
        <div><CommaNumber value={ props.numTweetIds } /></div>
      </div>
    )
  } else if (props.selectedFile) {
    return(
      <div>
        <br />
        <div><em>Verifying { props.selectedFile } ... </em></div>
      </div>
    )
  } else {
    return <span></span>
  }
}


export default class AddDataset extends Component {

  static propTypes = {
    chooseFile: PropTypes.func.isRequired,
    checkFile: PropTypes.func.isRequired,
    addDataset: PropTypes.func.isRequired,
    prepDataset: PropTypes.func.isRequired,
  }

  componentWillMount() { 
   if (! this.props.twitterAccessKey) {
      this.props.router.push("/settings") 
    }
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
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
            this.props.addDataset(this.props.selectedFile, this.props.numTweetIds, title.value, creator.value, publisher.value, url.value)
            this.props.router.push("/datasets") 
          }}> 
            <button onClick={ (e) => {
              this.props.unchooseFile()
              let files = dialog.showOpenDialog()
              if (files && files.length == 1) {
                this.props.chooseFile(files[0])
                this.props.checkFile(files[0])
              }
            }}>Select Tweet ID file</button>
            <br />
            <FileStats numTweetIds={this.props.numTweetIds} selectedFile={this.props.selectedFile} />
            <br />
            <label htmlFor="title">Title:</label>
            <input id="title" name="title" type="text" onChange={ this.props.prepDataset } value={ this.props.title } required></input>
            <label htmlFor="creator">Creator:</label>
            <input id="creator" name="creator" type="text" onChange={ this.props.prepDataset } value={ this.props.creator }></input>
            <label htmlFor="publisher">Publisher:</label>
            <input id="publisher" name="publisher" type="text" onChange={ this.props.prepDataset } value={ this.props.publisher }></input>
            <label htmlFor="url">URL:</label>
            <input id="url" name="url" type="url" onChange={ this.props.prepDataset } value={ this.props.url }></input>
            <br />
            <br />
            <button>Add Dataset</button>
          </form>
        </div>
      </div>
    );
  }
}
