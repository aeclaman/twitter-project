import tweepy
import pymongo
from pymongo import MongoClient
import time
import datetime

# Twitter developer API key
from config import consumer_key, consumer_secret, access_token, access_token_secret 
#comment out this line for local db load
# from config import MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_USER, MONGO_PASS


def get_all_tweets(screen_name):
    # following code needed to load local db, then comment out lines 17-19
    client = MongoClient()
    db = client.db_twitter_handle
    # con = pymongo.MongoClient(MONGO_HOST, MONGO_PORT)
    # db = con[MONGO_DB]
    # db.authenticate(MONGO_USER, MONGO_PASS)
    col = "Tweets_from_"+screen_name
    tweets = db[col]

    # Creating the authentication object
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    # Setting your access token and secret
    auth.set_access_token(access_token, access_token_secret)

    # Creating the API object while passing in auth information
    api = tweepy.API(auth, wait_on_rate_limit=True)

    # setting up name and count variables for metadata collection
    candidate_meta_dict = {}
    candidate_name = ""
    tweet_count = 0
    tweet_favorites = 0
    tweet_retweets = 0
    # utilized current year to grab tweets
    current_year = datetime.datetime.now().year
    # past_year = current_year - 4

    page_count = 0
    for page in tweepy.Cursor(api.user_timeline, screen_name=screen_name, tweet_mode='extended', count=200).pages(100):
        page_count += 1

        for tweet in page:
            if (tweet.created_at.year == current_year):
                # add tweet to this candidate collection
                tweets.insert_one(tweet._json)
                # collect stats for this candidate to be added to a metadata collection
                candidate_name = tweet.user.name
                followers = tweet.user.followers_count
                tweet_count += 1
                tweet_favorites += tweet.favorite_count
                tweet_retweets += tweet.retweet_count

        time.sleep(1)
        print("    ...%s tweets evaluated on page %s" % (len(page), page_count))
    candidate_meta_dict["candidate"] = candidate_name
    candidate_meta_dict["screenName"] = screen_name
    candidate_meta_dict["retweetAvg"] = tweet_retweets/tweet_count
    candidate_meta_dict["favoriteAvg"] = tweet_favorites/tweet_count
    candidate_meta_dict["followers"] = followers
    print("    ...%s actual tweet count included %s retweets and %s favorites and %s followers for %s" % (tweet_count, tweet_retweets, tweet_favorites, followers, candidate_name))
    return candidate_meta_dict


def add_to_metadata(candidateDictionary):
    # the following code needed to load local db, then comment out lines 68-70
    client = MongoClient()
    db = client.db_twitter_handle
    # con = pymongo.MongoClient(MONGO_HOST, MONGO_PORT)
    # db = con[MONGO_DB]
    # db.authenticate(MONGO_USER, MONGO_PASS)
    col = "metadata"
    meta = db[col]

    # Update the Mongo database using update and upsert=True
    meta.insert_one(candidateDictionary)


# The Twitter users who we want to get tweets from
candidates = ["@MichaelBennet", "@JoeBiden", "@BilldeBlasio", "@CoryBooker", "@GovernorBullock", "@PeteButtigieg",
              "@JulianCastro", "@JohnDelaney", "@TulsiGabbard", "@SenGillibrand", "@MikeGravel", "@KamalaHarris", "@Hickenlooper",
              "@JayInslee", "@amyklobuchar", "@WayneMessam", "@sethmoulton", "@BetoORourke", "@TimRyan", "@BernieSanders", "@ericswalwell",
              "@realDonaldTrump", "@ewarren", "@GovBillWeld", "@marwilliamson", "@AndrewYang"]

for name in candidates:
    try:
        meta_dict = get_all_tweets(name)
        add_to_metadata(meta_dict)
    except pymongo.errors.DuplicateKeyError:
        print("DuplicateKeyError")
        continue
