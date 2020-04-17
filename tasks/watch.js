const { parallel, series, watch } = require('gulp')
const electron = require('./electron')
const hotreload = require('./hotreload')
const assets = require('./assets')
const scripts = require('./scripts')

function watchMainScripts() {
  return watch(['app/main/**/*.js'], series(scripts.developBuild, electron.stop, electron.start))
}

function watchRendererScripts() {
  return watch(['app/renderer/**/*.js'], series(scripts.developBuild, hotreload.reload))
}

function watchHtml() {
  return watch(
    ['app/renderer/index.html'],
    series(assets.copyHtml, hotreload.inject, hotreload.reload),
  )
}

function watchCss() {
  return watch(
    ['app/renderer/**/*.css'], 
    series(assets.copyCss, hotreload.reload)
  )
}

function watchImage() {
  return watch(
    ['app/renderer/**/*.{jpg,jpeg,png,icns}'],
    series(assets.copyImage, hotreload.reload)
  )
}

watchMainScripts.displayName = 'watch-main-scripts'
watchRendererScripts.displayName = 'watch-renderer-scripts'
watchHtml.displayName = 'watch-html'
watchCss.displayName = 'watch-css'
watchImage.displayName = 'watch-image'

exports.start = series(
  assets.copyHtml,
  assets.copyCss,
  assets.copyImage,
  scripts.developBuild,
  hotreload.start,
  electron.start,
  parallel(watchMainScripts, watchRendererScripts, watchHtml, watchCss, watchImage),
)
