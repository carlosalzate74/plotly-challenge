function buildMetadata(sample) {
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    d3.json(`metadata/${sample}`).then(function(data) {
      d3.select("#sample-metadata").html("")
      for (let [key, value] of Object.entries(data))
        d3.select("#sample-metadata").append("div").html(`${key}: ${value}`)

      
      let level = parseInt(data["WFREQ"])
      // Trig to calc meter point
      let degrees = 180 - (level * 20),
           radius = .5;
      let radians = degrees * Math.PI / 180;
      let x = radius * Math.cos(radians);
      let y = radius * Math.sin(radians);
      let path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';

      let mainPath = path1,
           pathX = String(x),
           space = ' ',
           pathY = String(y),
           pathEnd = ' Z';
      let path = mainPath.concat(pathX,space,pathY,pathEnd);

      let gauge_data = [
        { type: 'scatter',
          x: [0], y:[0],
          marker: {size: 14, color:'850000'},
          showlegend: false,
          name: 'WFREQ',
          text: level,
          hoverinfo: 'text+name'},
        { values: [1,1,1,1,1,1,1,1,1,9],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {colors:['rgba(25, 77, 48, 0.5)', 'rgba(36, 117, 66, .5)', 'rgba(48, 156, 88, .5)', 
                         'rgba(60, 195, 109, .5)',   'rgba(99, 207, 139, 0.5)', 'rgba(138, 219, 168, .5)',
                         'rgba(177, 231, 197, .5)',   'rgba(196, 237, 211, 0.5)', 'rgba(236, 249, 241, .5)',
                         'rgba(0,0,0, 0.5'
                         ]},
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];

      let layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
              color: '850000'
            }
          }],
        width: 560, height: 500,
        title: { text: "Belly Button Washing Frequency<br><span style='font-size:0.8em;'>Scrubs Per Week</span>" },
        xaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                   showgrid: false, range: [-1, 1]}
      };

      Plotly.newPlot('gauge', gauge_data, layout);

    })
}

function buildCharts(sample) {

    d3.json(`samples/${sample}`).then(function(data) {
      
      let layout = {
        showlegend: false
      };

      bubble_data = [{
        y: data["sample_values"].slice(0,10,1),
        x: data["otu_ids"].slice(0,10,1),
        text: data["otu_labels"].slice(0,10,1),
        mode: "markers",
        marker: {
          size: data["sample_values"].slice(0,10,1),
          color: data["otu_ids"].slice(0,10,1)
        }
      }];

      Plotly.react("bubble", bubble_data, layout);

      pie_data = [{
        values: data["sample_values"].slice(0,10,1),
        labels: data["otu_ids"].slice(0,10,1),
        hovertext: data["otu_labels"].slice(0,10,1),
        type: "pie"
      }];

      Plotly.react("pie", pie_data);
    })
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
