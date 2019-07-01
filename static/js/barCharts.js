function buildBarChart(){
    d3.json("/metadata", function(data){
      
      var retweetList = [];
      var favoriteList = [];
      var retweetDictionary = {};
      var favoritesDictionary = {};
      var trumpRetweetList = [];
      var trumpFavoriteList = [];
      var trumpRetweetDictionary = {};
      var trumpFavoritesDictionary = {};

      // building necessary structure for dvd3 graphs
      data.forEach((item)=>{
        // not including Trump as his numbers are way off scale with other candidates
        // he will have his own chart; see trumpBarChart.js
        if (item["name"] != "Donald J. Trump"){
          retweetDictionary = 
            {
              label: item["name"],
              value: item["retweets"]
            };
          favoritesDictionary = 
            {
              label: item["name"],
              value: item["favorites"]
            };
          retweetList.push(retweetDictionary);
          favoriteList.push(favoritesDictionary);
        } else {
          // build data for Trump only
          trumpRetweetDictionary = 
          {
            label: item["name"],
            value: item["retweets"]
          };
          trumpFavoritesDictionary = 
          {
            label: item["name"],
            value: item["favorites"]
          };
        trumpRetweetList.push(trumpRetweetDictionary);
        trumpFavoriteList.push(trumpFavoritesDictionary);
        }
      });

      var nonTrumpData = [
        {
          key: "Likes",
          color: "1f77b4",
          values: favoriteList
        },
        {
          key: "Retweets",
          color: "d62728",
          values: retweetList
        }
      ];

      var trumpData = [
        {
          key: "Likes",
          color: "1f77b4",
          values: trumpFavoriteList
        },
        {
          key: "Retweets",
          color: "d62728",
          values: trumpRetweetList
        }
      ];

      // build bar chart with all candidates except Trump
      nv.addGraph(function ()
      {
        var chart = nv.models.multiBarChart()
        .x(function (d) {
         return d.label; // Configure x axis to use the "label" within the json.
        })
        .y(function (d) {
          return d.value; // Configure y axis to use the "value" within the json.
        }).margin({top: 30, right: 20, bottom: 100, left: 85}) // Add some CSS Margin to the chart.
        .reduceXTicks(false)
        .showControls(false) // Turn of switchable control
        .stacked(false); // Force stacked mode.

      chart.yAxis.axisLabel('Average # of likes/retweets') // add label to the horizontal axis
                 .tickFormat(d3.format(',.0f')); // Round the yAxis values
 
      chart.rotateLabels(-45);

      d3.select('#chart_three svg') // Select the html element by ID
          .datum(nonTrumpData) // Pass in the data
          .transition().duration(10) // Set transition speed
          .call(chart); // Call & Render chart
      
      nv.utils.windowResize(chart.update); // Intitiate listener for window resize so the chart responds and changes width.
      return;
      });

       // build bar chart with Trump data only 
      nv.addGraph(function ()
      {
        var chart = nv.models.multiBarChart()
        .x(function (d) {
         return d.label; // Configure x axis to use the "label" within the json.
        })
        .y(function (d) {
          return d.value; // Configure y axis to use the "value" within the json.
        }).margin({top: 30, right: 20, bottom: 50, left: 50}) // Add some CSS Margin to the chart.
        .reduceXTicks(false)
        .showLegend(false)
        .showControls(false) // Turn of switchable control
        .stacked(false); // Force stacked mode.

      chart.yAxis.tickFormat(d3.format(',.0f')); // Round the yAxis values

      d3.select('#chart_four svg') // Select the html element by ID
          .datum(trumpData) // Pass in the data
          .transition().duration(10) // Set transition speed
          .call(chart); // Call & Render chart
      
      nv.utils.windowResize(chart.update); // Intitiate listener for window resize so the chart responds and changes width.
      return;
      });
      
    });
}