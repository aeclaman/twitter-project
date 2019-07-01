function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of candidate names to populate the select options
  d3.json("/metadata", function(candidates) {
    candidates.forEach((candidate) => {
      selector
        .append("option")
        .text(candidate["name"])
        .property("value", candidate["screenName"]);
    });
  
    // Use the first sample from the list to build the initial plots
    const handle = candidates[0]["screenName"];
    buildCharts(handle);
    buildBarChart();
  });
}

function optionChanged(newCandidate) {
  // Fetch new data each time a new candidate is selected
  buildCharts(newCandidate);
}

init();