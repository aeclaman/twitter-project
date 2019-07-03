# A look at 2020 Presidential Candidate Twitter accounts

https://aeclaman-twitter-project.herokuapp.com/

This is a data visualization project which takes a look at the current 2020 presidential  
candidates presence on twitter in terms of followers, retweets and 'liked' tweets (favorites).  
It also looks at certain (pre-defined) terms to see how often the candidates are mentioning  
them in their tweets.  

The Twitter API is utilized with the python tweepy wrapper to get data from each  
candidate's twitter account and populate a mongo database. MongoDB, Flask and javascript (nvd3) are used  
to build a dashboard plotting all findings. The app has been uploaded to Heroku and can be accessed at the  
above link.


Database currently contains tweets from Jan 1, 2019 - June 19, 2019.

