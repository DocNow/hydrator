<img width="100" src="https://raw.githubusercontent.com/docnow/hydrator/master/app/app.png" /> 

Hydrator is an [Electron] based desktop application for [hydrating] a
Twitter ID dataset. Twitter's Terms of Service do not allow the full JSON
for tweets to be distributed to third parties. However they do allow datasets
of tweet IDs to be distributed. Hydrator helps you turn these tweet IDs 
back into JSON from the comfort of your desktop.

This is (obviously) a work in progress. If you are interested in learning more please join us in [Slack].

## Prebuilt Versions

These are very early versions. Be prepared for clunkiness and bugs.

* [OS X]
* Windows (soon)
* Linux (soon)

## Develop

Get it:

    git clone https://github.com/docnow/hydrator
    cd hydrator

Install:

    npm install

Start a hot-swappable development server:

    npm run dev

Or package it all up as a desktop app:

    npm run package 

And create an OS X installer:

    npm run build-dmg

Hydrator was created using [electron-react-boilerplate] so check out that 
documentation for more information about commands that are available.

[Electron]: http://electron.atom.io/
[Slack]: https://docnowteam.slack.com
[electron-react-boilerplate]: https://github.com/chentsulin/electron-react-boilerplate
[hydrating]: https://medium.com/on-archivy/on-forgetting-e01a2b95272#.lrkof12q5
[OS X]: https://s3.amazonaws.com/docnow-web/Hydrator.dmg
