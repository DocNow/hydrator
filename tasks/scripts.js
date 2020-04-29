const dotenv = require('dotenv')
const { src, dest } = require('gulp')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const inject = require('gulp-inject-string')

// get keys from environment or .env
dotenv.config()

function build() {
  return src('app/**/*.js')
    .pipe(inject.replace('TWITTER_CONSUMER_KEY', process.env.TWITTER_CONSUMER_KEY))
    .pipe(inject.replace('TWITTER_CONSUMER_SECRET', process.env.TWITTER_CONSUMER_SECRET))
    .pipe(babel())
    .pipe(inject.replace('process.env.NODE_ENV', '"production"'))
    .pipe(dest('build'))
}

function developBuild() {
  return src('app/**/*.js')
    .pipe(inject.replace('TWITTER_CONSUMER_KEY', process.env.TWITTER_CONSUMER_KEY))
    .pipe(inject.replace('TWITTER_CONSUMER_SECRET', process.env.TWITTER_CONSUMER_SECRET))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(dest('build'))
}

build.displayName = 'build-scripts'
developBuild.displayName = 'dev-build-scripts'

exports.build = build
exports.developBuild = developBuild