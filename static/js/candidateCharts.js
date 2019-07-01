function buildCharts(chosenCandidate) {

  var url = `/data/${chosenCandidate}`;

  // create an empty array to hold all tweets strung together (for pie chart)
  tweet_string = [];
  // create empty arrats to hold line graph data
  likesData = [];
  retweetData = [];

  d3.json(url,function(data){

    // call function to build the bullet chart passing the candidates' followers from 1st record (consistent value for all tweets)
    buildBulletChart(data.result[0]['followers']);

    // parse and sort data for pie and line charts
    data.result.forEach((tweet)=>{

      //build a string of all tweet text for this chosen candidate
      tweet_string.push(tweet['text']);

      //build data for line graph collecting tweet data, favorite count and retweet count for each tweet
      // var date1 = Date.parse(tweet['created_at']);
      likesData.push({
        x : Date.parse(tweet['created_at']),
        y : tweet['favourite_count']
      });
      retweetData.push({
        x : Date.parse(tweet['created_at']),
        y : tweet['retweet_count']
      });

    });

    // create an empty array to hold topic word count dictionaries
    topic_data = [];

    // define, search, and count words; add entry to dictionary
    const search_words = ['Healthcare', 'Jobs', 'Immigration','Taxes', 'Gun', 'Income', 'Foreign', 'Climate'];
    // create an array of custom colors for pie chart
    const colors = ["darkorange", "tomato", "forestgreen", "mediumseagreen", "chartreuse", "gold", "skyblue", "firebrick"];
    // build pie chart data
    search_words.forEach((topic, index)=>{
      word_count = countwords(topic, tweet_string);
      topic_data.push({
        key:   topic,
        value: word_count,
        color: colors[index]
      });
    
    });
    
    // BUILD PIE CHART
    var height = 400;
    var width = 400;

    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.key })
          .y(function(d) { return d.value })
          .showLabels(true)
          .width(width)
          .height(height)
          .growOnHover(false)
          .labelThreshold(.05)
          .labelType('percent')
          .showTooltipPercent(true);

        d3.select("#chart_one svg")
          .datum(topic_data)
          .transition().duration(10)
          .call(chart);
        return chart;
      });

      // BUILD LINE CHART
      var retweetsAndLikesData = [
        {
          key : "Likes" ,
          values : likesData,
          color : "1f77b4"
  
        },
        {
          key : "Retweets" ,
          values : retweetData,
          color : "d62728"
        }
      ];
  
    nv.addGraph(function() {
        var chart = nv.models.lineChart()
        .showLegend(true)       
        .showYAxis(true)        
        .showXAxis(true);       
    
        chart.xAxis
          .axisLabel('Date')
          .ticks(d3.time.months) // <-- add formatter for the ticks
          .tickFormat(function(d) {
                    return d3.time.format('%m-%y')(new Date(d))});
      
        chart.yAxis
          .axisLabel('# of likes/retweets')
          .tickFormat(d3.format(',.0f')); // Round the yAxis values
      
        d3.select('#chart_two svg')
          .datum(retweetsAndLikesData)
          .transition().duration(10)
          .call(chart);
      
        nv.utils.windowResize(chart.update);
      
        return chart;
    });

  });

}

function buildBulletChart(followers_count) {

  // remove the bullet chart as the y axis label won't reset with new values unless removed first
  d3.selectAll(".nv-bulletChart").remove();

  // define an empty dictionary
  var bulletData = {};

  // set up data parameters for bullet chart based on how many followers the candidate has
  if (followers_count <= 100000){
      min_value = 0;
      mean_value = 50000;
      max_value = 100000;
      scale_type = "thousands";
  } else {
      if (followers_count <= 1000000){
          min_value = 100000;
          mean_value = 550000;
          max_value = 1000000;
          scale_type = "thousands";
      } else {
          if (followers_count <= 62000000){
              followers_count = followers_count/1000000;
              scale_type = "millions";
              min_value = 1;
              mean_value = 30.5;
              max_value = 62;
          }
      }
  }

  bulletData = {
      "title": "Followers",		//Label the bullet chart
      "subtitle": "(in " + scale_type + ")",		        //sub-label for bullet chart
      "ranges": [min_value, mean_value, max_value],
      "measures":[followers_count]		 //Value representing current measurement (the thick blue line in the example)
  };


  nv.addGraph(function() {  
      var chart = nv.models.bulletChart();
          
      d3.select('#bullet-chart svg')
          .datum(bulletData)
          .transition().duration(10)
          .call(chart);
          
          return chart;
      });
}

function countwords(word, tweet_string){
  // use regular expression and match to search for word matches
  var re = new RegExp(word.toLowerCase(), 'g');
  var result = tweet_string.join().match(re);
  if (result !== null){
    return result.length;
  } else {
    return 0;
  }
}