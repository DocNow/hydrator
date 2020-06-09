<img width="800" src="https://raw.githubusercontent.com/docnow/hydrator/master/images/screencap.png"
/> 

[![Build & Release](https://github.com/docnow/hydrator/workflows/Build%20&%20Release/badge.svg)](https://github.com/DocNow/hydrator/actions?query=workflow%3A%22Build+%26+Release%22)

Hydrator is an [Electron] based desktop application for [hydrating] Twitter ID
datasets. Twitter's Terms of Service do not allow the full JSON for datasets of
tweets to be distributed to third parties. However they do allow datasets of
tweet IDs to be shared. Hydrator helps you turn these tweet IDs back into JSON
and also CSV from the comfort of your desktop.

If you are interested in learning more please join the DocNow community in
[Slack], or add an issue ticket here. If you would like to explore tweet
identifier datasets please see the [DocNow Catalog](https://catalog.docnow.io)
and GWU's [TweetSets](https://tweetsets.library.gwu.edu/).



## Install

### Important!

It is easiest to download a pre-built version of the Hydrator instead of
building it from source. Please see the list of available
[releases](https://github.com/DocNow/hydrator/releases) for OS X, Windows and
Linux installers.

### Note for OS X Users

Since the Hydrator has not been
[signed](https://developer.apple.com/developer-id/) (which requires us to pay
Apple in order to register as a developer) your initial start up of the Hydrator
will be prevented. You can convince OS X to open it anyway by locating the
Hydrator app in your *Applications* folder, control-clicking on it, selecting
and then clicking *Open* (see the screenshot below). From this point on your
Hydrator should start normally.

<img width="800" src="https://raw.githubusercontent.com/docnow/hydrator/master/images/osx-open.png">

## Develop


Get it:

    git clone https://github.com/docnow/hydrator
    cd hydrator

Configure:

In order to build the Hydrator you will need to get app keys from Twitter and
put them in a `.env` file in your project directory. It should look something
like this:

    TWITTER_CONSUMER_KEY=CHANGEME
    TWITTER_CONSUMER_SECRET=CHANGEMETOO

Next install the dependencies:

    yarn install

Start a hot-swappable development server:

    yarn run develop

Alternatively, create installers for OS X, Windows and Linux:

    yarn run pack:mac
    yarn run pack:win
    yarn run pack:linux

Hydrator was created using [electron-react-redux-boilerplate] so check out that
documentation for more information about commands that are available.

## How to Cite

If you would like to cite this software please use something like the following:

    Documenting the Now. (2020). Hydrator [Computer Software]. Retrieved from https://github.com/docnow/hydrator

[Electron]: http://electron.atom.io/
[Slack]: https://docnowteam.slack.com
[electron-react-redux-boilerplate]: https://github.com/jschr/electron-react-redux-boilerplate
[hydrating]: https://medium.com/on-archivy/on-forgetting-e01a2b95272#.lrkof12q5
