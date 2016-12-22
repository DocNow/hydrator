import fs from 'fs'
import Twit from 'twit' 
import {createInterface} from 'readline'
import csvWriter from 'csv-write-stream'
import { ipcRenderer } from 'electron'

export function checkTweetIdFile(path) {
  return new Promise(
    function(resolve, reject) {
      var linereader = createInterface({input: fs.createReadStream(path)}) 
      var count = 0
      linereader.on('line', function(line) {
        count += 1
        if (! line.match(/^[0-9]+$/)) {
          reject("invalid tweet id on line " + count + ' in ' + path)
        }
      })
      linereader.on('close', function() {
        resolve(count)
      })
    })
}

export function hydrateTweets(inputPath, outputPath, auth, startLine=0, endLine=100) {
  return readTweetIds(inputPath, startLine, endLine)
    .then(function(tweetIds) {
      return fetchTweets(tweetIds, auth)
    })
    .then(function(result) {
      return writeTweets(result.tweetIds, result.tweets, outputPath)
    })
    .catch(error => {
      console.log("hydrateTweets error", error)
    })
}

function readTweetIds(inputPath, startLine, endLine) {
  return new Promise(
    function(resolve, reject) {
      var pos = 0
      var lines = []
      var input = fs.createReadStream(inputPath)
      var linereader = createInterface({input: input})
      linereader.on('line', function(line) {
        if (pos >= startLine && pos < endLine) {
          lines.push(line.toString())
        } 
        if (pos == endLine) {
          linereader.close()
        }
        pos += 1
      })
      linereader.on('close', function() {
        resolve(lines)
        input.close()
        lines = linereader = null
      })
    }
  )
}

function fetchTweets(tweetIds, auth) {
  var twitter = Twit({
    consumer_key: auth.consumer_key,
    consumer_secret: auth.consumer_secret,
    access_token: auth.access_token,
    access_token_secret: auth.access_token_secret
  })
  var ids = tweetIds.join(',')
  return new Promise(
    function(resolve, reject) {
      twitter.post('/statuses/lookup', {id: ids})
        .then(function(response) {
          var headers = response.resp.headers
          if (headers['x-rate-limit-remaining'] < 1) {
            var error = {
              message: "Rate limit exceeded",
              reset: headers['x-rate-limit-reset']
            }
            reject(error)
          }
          else if (response.data.errors) {
            var error = response.data.errors[0]
            error.reset = headers['x-rate-limit-reset']
            reject(error)
          } else {
            resolve({tweetIds: tweetIds, tweets: response.data})
          }
          response = null
          tweetIds = null
          ids = null
          twitter = null
        })
        .catch(function(err) {
          reject(err)
        })
    }
  )
}

function writeTweets(tweetIds, tweets, outputPath) {
  return new Promise(
    function (resolve, reject) {
      ipcRenderer.on('savedTweets', (event, arg) => {
        resolve({
          idsRead: arg.tweetIds.length,
          tweetsHydrated: arg.tweets.length
        })
      })
      ipcRenderer.send('saveTweets', {
        tweetIds: tweetIds,
        tweets: tweets,
        outputPath: outputPath
      })
      tweetIds = null
      tweets = null
    }
  )
}

export function toCsv(jsonPath, csvPath) {
  return new Promise(
    function (resolve, reject) {
      var input = fs.createReadStream(jsonPath)
      var linereader = createInterface({input: input})

      var csv = csvWriter({headers: [
        'coordinates',
        'created_at',
        'hashtags',
        'media',
        'urls',
        'favorite_count',
        'id',
        'in_reply_to_screen_name',
        'in_reply_to_status_id',
        'in_reply_to_user_id',
        'lang',
        'place',
        'possibly_sensitive',
        'retweet_count',
        'reweet_id',
        'retweet_screen_name',
        'source',
        'text',
        'tweet_url',
        'user_created_at',
        'user_screen_name',
        'user_default_profile_image',
        'user_description',
        'user_favourites_count',
        'user_followers_count',
        'user_friends_count',
        'user_listed_count',
        'user_location',
        'user_name',
        'user_screen_name',
        'user_statuses_count',
        'user_time_zone',
        'user_urls',
        'user_verified'
      ]})
      csv.pipe(fs.createWriteStream(csvPath))

      var count = 0

      linereader.on('line', function(line) {
        count += 1
        var tweet = JSON.parse(line)
        csv.write(csvRow(tweet))
      })

      linereader.on('close', function() {
        csv.end()
        resolve(count)
      })
    }
  )
}

function csvRow(t) {
  var u = t.user
  return [
    coordinates(t),
    t.created_at,
    hashtags(t),
    media(t),
    urls(t),
    t.favorite_count,
    t.id_str,
    t.in_reply_to_screen_name,
    t.in_reply_to_status_id,
    t.in_reply_to_user_id,
    t.lang,
    place(t),
    t.possibly_sensitive,
    t.retweet_count,
    retweetId(t),
    retweetScreenName(t),
    t.source,
    t.text,
    tweetUrl(t),
    u.created_at,
    u.screen_name,
    u.default_profile_image,
    u.description,
    u.favourites_count,
    u.followers_count,
    u.friends_count,
    u.listed_count,
    u.location,
    u.name,
    u.screen_name,
    u.statuses_count,
    u.time_zone,
    userUrls(t),
    u.verified
  ]
}

function coordinates(t) {
  if (t.coordinates) {
    return t.coordinates.coordinates
  }
  return null
}

function hashtags(t) {
  if (t.entities.hashtags) {
    return t.entities.hashtags.map((ht) => ht.text).join(' ')
  } 
  return null
}

function media(t) {
  if (t.entities.media) {
    return t.entities.media.map((m) => m.expanded_url).join(' ')
  } 
  return null
}

function urls(t) {
  if (t.entities.urls) {
    return t.entities.urls.map((u) => u.expanded_url).join(' ')
  }
  return null
}

function place(t) {
  if (t.place) {
    return t.place.full_name
  }
  return null
}

function retweetId(t) {
  if (t.retweeted_status) {
    return t.retweeted_status.id_str
  }
  return null
}

function retweetScreenName(t) {
  if (t.retweeted_status) {
    return t.retweeted_status.user.screen_name
  }
  return null
}

function tweetUrl(t) {
  return "https://twitter.com/" + t.user.screen_name + "/status/" + t.id_str
}

function userUrls(t) {
  if (t.user && t.user.entities.url && t.user.entities.url.urls) {
    return t.user.entities.url.urls.map((u) => u.expanded_url).join(' ')
  }
  return null
}
