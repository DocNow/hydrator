import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  input {
    width: auto;
  }
`

const Key = styled.div`
  overflow-wrap: nowrap; 
  font-size: smaller;
`

const Reset = styled.button`
  color: red;
`

export default class Settings extends Component {

  componentWillReceiveProps() {
    // if they've got their settings ready send them over to add a dataset
    if (this.props.settings.ready) {
      this.props.history.push("/add")
      this.props.unsetSettingsReady()
    }
  }

  reset() {
    this.props.factoryReset()
  }

  render() {

    let pin = null

    if (this.props.settings.twitterAuthUrl) {
      var form = 
        <form onSubmit = {(e) => {
          e.preventDefault()
          this.props.getTwitterCredentials(pin.value)
          }}>
          <input ref={node => pin = node} name="twitterPin" id="twitterPin" placeholder="PIN" maxLength="7" size="8" type="text" />
          &nbsp; &nbsp; &nbsp;
          <button>Submit PIN</button>
          &nbsp; &nbsp; &nbsp;
          <button>Reset</button>
        </form>
    } else {
      var form = 
        <form onSubmit = {(e) => {
          e.preventDefault()
          this.props.getTwitterAuthUrl()
          }}>
          <button>Link Twitter Account</button>
        </form>
    }

    return (
      <Container>
        <details open>
          <summary>Settings</summary>
          <p>
          These are your settings that control who you connect
          to the Twitter API as. You will be directed over to 
          Twitter to grant your Hydrator application permission to 
          use your account to retrieve Twitter data.
          </p>
        </details>
        { form }
        <br />
        <label htmlFor="accessKey">Access Key:</label>
        <Key>{ this.props.settings.twitterAccessKey }</Key>
        <br />
        <label htmlFor="accessKeySecret">Access Key Secret:</label>
        <Key>{ this.props.settings.twitterAccessSecret }</Key>
        <br />
        <br />
        <br />
        <Reset onClick={(e) => this.reset()}>Reset Settings</Reset>
      </Container>
    )
  }
}
