import DatasetList from '../components/DatasetList'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import * as DatasetActions from '../actions/dataset'

function mapStateToProps(state) {
  return {
    datasets: state.datasets,
    resetTime: state.settings.resetTime
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DatasetActions, dispatch)
}

const DecoratedDatasetList = withRouter(DatasetList)

export default connect(mapStateToProps, mapDispatchToProps)(DecoratedDatasetList)
