<img width="800" src="https://raw.githubusercontent.com/docnow/hydrator/master/app/images/screencap.png"
/> 

Hydrator is an [Electron] based desktop application for [hydrating] Twitter ID
datasets. Twitter's Terms of Service do not allow the full JSON for datasets of
tweets to be distributed to third parties. However they do allow datasets of
tweet IDs to be shared. Hydrator helps you turn these tweet IDs back into JSON
from the comfort of your desktop.

If you are interested in learning more please join the DocNow community in
[Slack], or add an issue ticket here.

## Prebuilt Versions

v0.0.2 

* [OS X](https://s3.amazonaws.com/docnow-web/Hydrator-0.0.2.dmg)
* [Windows](https://s3.amazonaws.com/docnow-web/Hydrator-Setup-0.0.2.exe)
* [Linux](https://s3.amazonaws.com/docnow-web/Hydrator_0.0.2_amd64.deb)

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
