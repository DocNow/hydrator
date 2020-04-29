import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Settings from '../components/Settings'
import * as SettingsActions from '../actions/settings'

function mapStateToProps(state) {
  return {
    settings: state.settings
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

let DecoratedSettings = withRouter(Settings)

export default connect(mapStateToProps, mapDispatchToProps)(DecoratedSettings)
