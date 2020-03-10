function buildMetadata(sample) {
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    d3.json(`metadata/${sample}`).then(function(data) {
      d3.select("#sample-metadata").html("")
      for (let [key, value] of Object.entries(data)) {
        d3.select("#sample-metadata").append("div").html(`${key}: ${value}`)
      }
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
