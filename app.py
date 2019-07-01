from flask import Flask, jsonify, render_template
from flask_pymongo import PyMongo
import os

app = Flask(__name__)

app.config['MONGO_URI'] = os.environ.get('MONGODB_URI') or "mongodb://localhost:27017/db_twitter_handle"
mongo = PyMongo(app)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/data/<chosenCandidate>", methods=['GET'])
def data(chosenCandidate):
    tweet = mongo.db["Tweets_from_" + chosenCandidate]
    output = []
    for t in tweet.find():
        output.append({'created_at': t['created_at'], 'text': t['full_text'], 'favourite_count': t['favorite_count'],
                       'retweet_count': t['retweet_count'], 'followers': t['user']['followers_count']})
    return jsonify({'result': output})


@app.route("/metadata", methods=['GET'])
def metadata():
    favorites = mongo.db["metadata"]

    output = []
    for f in favorites.find():
        output.append({'name': f['candidate'], 'screenName': f['screenName'], 'followers': f['followers'],
                       'retweets': f['retweetAvg'], 'favorites': f['favoriteAvg']})
    return jsonify(output)


@app.route("/followercount/<chosenCandidate>", methods=['GET'])
def followercount(chosenCandidate):
    metadata = mongo.db["metadata"]
    candidateMeta = metadata.find_one( {"screenName": chosenCandidate} )
    return jsonify({'result': [candidateMeta['followers']]})


if __name__ == "__main__":
    app.run()
