import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Settings.css';


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
      <div>
        <div className={styles.container}>
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
          <div className={styles.keys}>{ this.props.settings.twitterAccessKey }</div>
          <br />
          <label htmlFor="accessKeySecret">Access Key Secret:</label>
          <div className={styles.keys}>{ this.props.settings.twitterAccessSecret }</div>
          <br />
          <br />
          <br />
          <button className={styles.reset} onClick={(e) => this.reset()}>Reset Settings</button>
        </div>
      </div>
    );
  }
}
