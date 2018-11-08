function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
   //var url = `/metadata/${sample}`;
   var url = "/metadata/" + sample;
   console.log("sample", sample);
   

    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(url).then(function(sam_metadata){
      var selector = d3.select("#sample-metadata");
      selector.html("");
      
      Object.entries(sam_metadata).forEach(([key, value]) => {
          
          // Append table row with cell data
          // for each key, value pair 
          // var row = metaData.append("tr");
          // var cell1 = row.append("td");
          // var cell2 = row.append("td");
          // cell1.text(`${key}:`);
          // cell2.text(`${value}`);
          var row = selector.append("p");
          row.text(`${key}: ${value}`);
          //selector.append("li").text(`${key} : ${value}`);
          //selector.exit().remove();
        });
      });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    buildGauge(sample.wfreq);

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let bubblePlot = document.getElementById("bubble");
  //var url = `/samples/${sample}`;
  var url = "/samples/" + sample;
  //bubblePlot.html("");
  console.log("inside buildchar", bubblePlot);
  //bubblePlot.html("");
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(url).then(function(sampleData){
      var trace1 = {
        type: "scatter",
        mode: "markers",
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        marker: {
          size: sampleData.sample_values,
          color: sampleData.otu_ids,
          colorscale : 'Earth'
        }
      };

    var data = [trace1];
    var layout = {
      title: "A Belly Button Bubble Chart"
    };
    //Plotly.exit().remove();
    Plotly.newPlot(bubblePlot, data, layout,0);
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
      Plotly.newPlot(pieDiv, data, layout);
    });
    console.log("sample inside char", sample);
    
}


//built a gauge chart
function buildGauge(wfreq){

  var gauge = d3.select("#gauge");
  ///////////////  BONUS: Gauge Chart  ///////////////
   // d3.json("/wfreq/${sample}", function(response){
    // Enter a speed between 0 and 180
    var washLevel = wfreq;
    console.log(`Washing is ${washLevel}`);

        
    // Convert washLevel to appropriate gauge level
    var level = washLevel * 20;

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ 
      type: 'scatter',
      x: [0], 
      y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'scrubs per week',
      text: washLevel,
      hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:  
        ['rgba(30, 125, 0, .5)', 'rgba(75, 135, 15, .5)', 'rgba(110, 150, 30, .5)',
        'rgba(145, 170, 45, .5)', 'rgba(180, 195, 60, .5)', 'rgba(215, 225, 75, .5)',
        'rgba(230, 240, 100, .5)', 'rgba(240, 250, 150, .5)', 'rgba(250, 250, 200, .5)',
        'rgba(255, 255, 255, 0)']},  // white for bottom half of gauge
      labels: ['8-9 often', '7-8 daily', '6-7 most days', '5-6 semi-daily', '4-5 regularly', '3-4 every other day', '2-3 occasionally', '1-2 infrequently', '0-1 rarely', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        } 
      }],
      title: 'Scrubs per Week',
      height: 500,
      width: 500,
      xaxis: {
        zeroline:false, 
        showticklabels:false,
        showgrid: false, 
        range: [-1, 1]
      },
      yaxis: {
        zeroline:false, 
        showticklabels:false,
        showgrid: false, 
        range: [-1, 1]
      }
    };

    //Plotly.newPlot(gauge, data, layout, {displayModeBar: false}, {responsive: true});
    Plotly.newPlot(gauge, data, layout);
  

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
  buildGauge(newSample);
}

// Initialize the dashboard
init();
// Add event listener for submit button
d3.select("#selDataset").on("onchange", optionChanged);
