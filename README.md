<img width="800" src="https://raw.githubusercontent.com/docnow/hydrator/master/images/screencap.png"
/> 

Hydrator is an [Electron] based desktop application for [hydrating] Twitter ID
datasets. Twitter's Terms of Service do not allow the full JSON for datasets of
tweets to be distributed to third parties. However they do allow datasets of
tweet IDs to be shared. Hydrator helps you turn these tweet IDs back into JSON
and also CSV from the comfort of your desktop.

If you are interested in learning more please join the DocNow community in
[Slack], or add an issue ticket here. If you would like to explore tweet
identifier datasets please see the [DocNow
Catalog](https://www.docnow.io/catalog/) and GWU's
[TweetSets](https://tweetsets.library.gwu.edu/).

## Install

Please see the list of available 
[releases](https://github.com/DocNow/hydrator/releases) for OS X, Windows and
Linux installers.

**Note for OS X users**

Since the Hydrator has not been
[signed](https://developer.apple.com/developer-id/) the first time you attempt
to open the Hydrator the start up will be prevented because it's not from a
Apple developer. To get around this find the Hydrator app in your Applications
folder, control-click on it, select and then click Open. From this point on your
application should start normally.

<img width="800" src="https://raw.githubusercontent.com/docnow/hydrator/master/images/osx-open.png">

## Develop

Get it:

    git clone https://github.com/docnow/hydrator
    cd hydrator

Install:

    npm install

Start a hot-swappable development server:

    npm run dev

Create an installer for your current OS:

    npm run package

Alternatively, create installers for OS X, Windows and Linux:

    npm run package-all

Hydrator was created using [electron-react-boilerplate] so check out that
documentation for more information about commands that are available.

[Electron]: http://electron.atom.io/
[Slack]: https://docnowteam.slack.com
[electron-react-boilerplate]: https://github.com/chentsulin/electron-react-boilerplate
[hydrating]: https://medium.com/on-archivy/on-forgetting-e01a2b95272#.lrkof12q5
