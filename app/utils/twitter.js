import fs from 'fs'
import Twit from 'twit' 
import {createInterface} from 'readline'
import csvWriter from 'csv-write-stream'
import { UPDATE_PROGRESS, SET_RESET_TIME } from '../renderer/actions/dataset'

/**
 * Verify a tweet id file contains numbers, and count the rows.
 * @param {*} path 
 */
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

/**
 * Returns the Twitter account settings for the supplied keys.
 * @param {*} auth an object containing Twitter API authentication keys
 */

export async function getUserSettings(auth) {
  var twitter = Twit({
    consumer_key: auth.consumer_key,
    consumer_secret: auth.consumer_secret,
    access_token: auth.access_token,
    access_token_secret: auth.access_token_secret
  })
  const resp = await twitter.get('account/settings')
  return resp.data
}

/**
 * This is kind of an awful function with tons of side effects which 
 * will write hdyrated tweets for a set of tweet ids to an output stream 
 * and send messages to the renderer process about its progress or if
 * it has been rate limited.
 * @param {*} ids a list of tweet ids
 * @param {*} out an ouptut stream to write hydrated tweets to
 * @param {*} auth an object containing twitter api credentials
 * @param {*} event an IPC event object to use to communicate
 * @param {*} datasetId the datasetId to 
 * @param {*} tries the number of times the request has been tried 
 */
export async function hydrateToStream(ids, out, auth, event, datasetId, tries=0) {
  try {
    const tweets = await fetchTweets(ids, auth)
    if (tweets.length > 0) {
      const text = tweets.map(t => JSON.stringify(t)).join('\n')
      out.write(text + "\n")
    }
    event.sender.send(UPDATE_PROGRESS, {
      datasetId: datasetId,
      idsRead: ids.length, 
      tweetsHydrated: tweets.length
    })
    return tweets.length
  } catch(err) {
    if (err.reset) {
      const millis = err.reset * 1000 - Date.now()
      const resetTime = new Date(0)
      resetTime.setUTCSeconds(err.reset)
      event.sender.send(SET_RESET_TIME, {resetTime: resetTime})
      console.log(`rate limited, sleeping for ${millis} milliseconds until ${resetTime}`)
      await sleep(millis)
      console.log(`woke up to hydrate dataset ${datasetId} some more`)
      event.sender.send(SET_RESET_TIME, {resetTime: null})
      return hydrateToStream(ids, out, auth, event, datasetId)
    } else {
      console.log(JSON.stringify(err))
      const maxTries = 12
      // this hopefully should only happen when we hit a network error
      if (tries < maxTries) {
        // the last try should wait almost an hour
        const millis = (2 ** tries) * 10000
        console.error(`unexpected error during hydration: ${err}, sleeping ${millis}`)
        await sleep(millis)
        return hydrateToStream(ids, out, auth, event, datasetId, tries + 1)
      } else {
        console.log(`unexpected error after ${maxTries} tries`)
        console.log(JSON.stringify(err))
        throw err
      }
    }
  }
}

export function fetchTweets(tweetIds, auth) {
  var twitter = Twit({
    consumer_key: auth.consumer_key,
    consumer_secret: auth.consumer_secret,
    access_token: auth.access_token,
    access_token_secret: auth.access_token_secret
  })
  var ids = tweetIds.join(',')
  return new Promise(
    function(resolve, reject) {
      twitter.post('statuses/lookup', {id: ids, tweet_mode: 'extended'})
        .then(function(response) {

          // if we are on our last request stop now
          var headers = response.resp.headers
          if (headers['x-rate-limit-remaining'] < 1 && headers['x-rate-limit-reset']) {
            const error = {
              message: "Rate limit exceeded",
              reset: headers['x-rate-limit-reset']
            }
            reject(error)
          }

          // return the tweets!
          else {
            resolve(response.data)
          }
        })

        // uhoh something went wrong when looking up ids
        .catch(err => {

          // are we rate limited? look up the reset time
          if (err.code === 88) {
            console.log('we have been rate limited, asking Twitter for reset time')
            twitter.get('application/rate_limit_status', {resources: 'statuses'})
              .then(response => {
                reject({
                  message: "Rate limit exceeded",
                  reset: response.data.resources.statuses['/statuses/lookup'].reset
                })
              })
              .catch(err => {
                console.error(`unable to check rate limit: ${err}`)
                reject({
                  message: "Error when checking rate limit status",
                  detail: err
                })
            })
          } else {
            reject(err)
          }
        })
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
        'retweet_id',
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
    t.full_text,
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 
