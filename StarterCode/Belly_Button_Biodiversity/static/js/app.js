function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
   var url = "/metadata/" + sample;
   
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(url).then(function(sam_metadata){
      console.log(sam_metadata);
      var metadata = d3.select("#sample-metadata");
      metadata.html("");
      Object.entries(sam_metadata).forEach(([key,value])=> {
        metadata.append("text").html(key+":" + value).append("br");
         });
        });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    buildGauge(sample);

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let bubblePlot = document.getElementById("bubble");
  var url = "/samples/" + sample;

    // @TODO: Build a Bubble Chart using the sample data
    d3.json(url).then(function(sampleData){
      var trace1 = {
        type: "scatter",
        mode: "markers",
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.out_labels,
        marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids
        }
      };

    var data = [trace1];
    var layout = {
      title: "A Belly Button Bubble Chart"
    };
    Plotly.plot(bubblePlot, data, layout);
  });

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    builtPie(sample);
}

function builtPie(sample){
    let pieDiv = document.getElementById("pie");
    var url = "/samples/" + sample;
    d3.json(url).then(function(sampleData){
      var labelSlice = sampleData.otu_labels.slice(0,10);
      var idSlice = sampleData.otu_ids.slice(0,10);
      var trace2 = {
        type : "pie",
        values : sampleData.sample_values.slice(0,10),
        labels: idSlice,
        text : labelSlice,
        textinfo: "percent"

      }
      var data = [trace2];
      var layout = {
        title: "Belly Button Pie Chart Top Ten"
      };
      Plotly.plot(pieDiv, data, layout);
    });

}


//built a gauge chart
function buildGauge(wfreq){

  var gaugeDiv = document.getElementById("gauge");
  meter_chart = {
    "values": [50, 10, 10, 10, 10, 10],
    "labels": ["Log Level", "Debug", "Info", "Warn", "Error", "Fatal"],
    "marker": {
        'colors': [
            'rgb(255, 255, 255)',
            'rgb(232,226,202)',
            'rgb(226,210,172)',
            'rgb(223,189,139)',
            'rgb(223,162,103)',
            'rgb(226,126,64)'
        ]
    },
    "domain": {"x": [0, 0.48]},
    "name": "Gauge",
    "hole": .3,
    "type": "pie",
    "direction": "clockwise",
    "rotation": 90,
    "showlegend": False,
    "textinfo": "label",
    "textposition": "inside",
    "hoverinfo": "none"
}
  Plotly.plot('gaugeDiv',meter_chart);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
