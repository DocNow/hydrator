import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import AddDataset from '../components/AddDataset'
import * as AddDatasetActions from '../actions/dataset'

function mapStateToProps(state) {
  return {
    selectedFile: state.newDataset.selectedFile,
    title: state.newDataset.title,
    creator: state.newDataset.creator,
    publisher: state.newDataset.publisher,
    url: state.newDataset.url,
    numTweetIds: state.newDataset.numTweetIds,
    checkingFile: state.newDataset.checkingFile,
    twitterAccessKey: state.settings.twitterAccessKey,
    twitterAccessSecret: state.settings.twitterAccessSecret
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AddDatasetActions, dispatch)
}

let DecoratedAddDataset = withRouter(AddDataset)

export default connect(mapStateToProps, mapDispatchToProps)(DecoratedAddDataset)
