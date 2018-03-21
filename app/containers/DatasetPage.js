import React, { Component } from 'react'
import DatasetDetail from '../components/DatasetDetail'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import * as DatasetActions from '../actions/dataset'

function mapStateToProps(state, routeState) {
  var props = {
    dataset: null
  }
  var datasetId = routeState.match.params.datasetId
  for (var d of state.datasets) {
    if (d.id == datasetId) {
      props.dataset = d
    }
  }
  return props
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DatasetActions, dispatch)
}

let DecoratedDatasetDetail = withRouter(DatasetDetail)

export default connect(mapStateToProps, mapDispatchToProps)(DecoratedDatasetDetail)
