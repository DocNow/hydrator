import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  input {
    width: auto;
  }
  form {
    padding: 0px;
  }
`

const Key = styled.div`
  overflow-wrap: nowrap; 
  font-size: smaller;
`

const ScreenName = styled.div`
  font-size: smaller;
  color: blue;
`

const Reset = styled.button`
  color: red;
`

const Error = styled.div`
  color: red;
`

const TwitterAuthUrl = styled.div`
  font-style: italic;
  font-size: smaller;
`

export default class Settings extends Component {

  reset() {
    this.props.factoryReset()
  }

  render() {

    let pin = null
    let form = null
    const error = this.props.settings.invalidPin ? 'Invalid PIN' : ''

    if (this.props.settings.authorize) {
      form = 
        <form onSubmit = {(e) => {
          e.preventDefault()
          this.props.getTwitterCredentials(pin.value)
          }}>
          <p>
            Note: If a browser window did not open for you please open this URL in your browser 
            and follow the instructions to obtain your PIN:
            <br />
            <br />
            <TwitterAuthUrl>{this.props.settings.authorize}</TwitterAuthUrl>
          </p>
          <input 
            ref={node => pin = node} 
            name="twitterPin" 
            id="twitterPin" 
            placeholder="PIN" 
            maxLength="7" 
            size="8" 
            type="text" />
          &nbsp; &nbsp; &nbsp;
          <button>Submit PIN</button>
          <br />
        </form>
    } else {
      form = 
        <form onSubmit = {(e) => {
          e.preventDefault()
          this.props.authorize()
        }}>
          <button>Link Twitter Account</button>
        </form>
    }

    let screenName = ""
    if (this.props.settings.twitterScreenName) {
      screenName = <>
        <label htmlFor="screenName">Twitter Account</label>
        <ScreenName>@{this.props.settings.twitterScreenName}</ScreenName>
        <br />
      </>
    }

    let settings = ""
    if (this.props.settings.twitterAccessKey) {
      settings = <>
        {screenName}
        <label htmlFor="accessKey">Access Key</label>
        <Key>{ this.props.settings.twitterAccessKey }</Key>
        <br />
        <label htmlFor="accessKeySecret">Access Key Secret</label>
        <Key>{ this.props.settings.twitterAccessSecret }</Key>
        <br />
      </>
    }

    return (
      <Container>
        <details open>
          <summary>Settings</summary>
          <p>
          These settings that control who you connect
          to the Twitter API as. When you click Link Your Twitter Account
          you will be directed to Twitter to grant your Hydrator 
          application permission to use your account to retrieve Twitter 
          data.
          </p>
        </details>
        { form }
        <br />
        { settings }
        <br />
        <Reset onClick={(e) => this.reset()}>Reset</Reset>
        <br />
        <Error>{ error }</Error>
      </Container>
    )
  }
}
