const { src, dest } = require('gulp')

function copyHtml() {
  return src('app/renderer/index.html').pipe(dest('build/renderer'))
}

function copyCss() {
  return src('app/renderer/**/*.css').pipe(dest('build/renderer'))
}

function copyImage() {
  return src('app/renderer/**/*.{jpg,jpeg,png,icns}').pipe(dest('build/renderer'))
}

copyHtml.displayName = 'copy-html'
copyCss.displayName = 'copy-css'
copyImage.displayName = 'copy-image'

exports.copyHtml = copyHtml
exports.copyCss = copyCss
exports.copyImage = copyImage