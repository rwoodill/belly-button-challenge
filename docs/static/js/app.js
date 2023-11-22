// Rachel Woodill 2023-11-22

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    //console.log(data);
  });

// ------------------------------------------------------------------------------
// initialization function 
// ------------------------------------------------------------------------------
function init(){
    // select the dropdown menu and store it in a variable
    let dropDownMenu = d3.select("#selDataset");

    //get the data to populate the dropdown menu
    d3.json(url).then((data) => {
        // variable to store the sample names
        let names = data.names;
        //add the samples to the dropdown menu
        names.forEach(id => {
            //console.log(element);
            dropDownMenu.append("option").text(id).property("value", id);
        });

        // set the first sample from the list
        let sampleOne = names[0];
        //console.log(sampleOne);

        // build the plots
        getData(sampleOne);
        createBarChart(sampleOne);
    });
}; // end of function "init" 

// ------------------------------------------------------------------------------
// function the populates the metadata info
// ------------------------------------------------------------------------------
function getData(sample){
    // retrieve the data
    d3.json(url).then((data) => {
        // retrieve all metadata
        let metadata = data.metadata;
        // filter based on value
        let value = metadata.filter(result => result.id == sample);
        //console.log(`value: ${value}`);
        // get the first index of the array
        let valueData = value[0];
        //console.log(valueData);

        // clear out metadata
        d3.select("#sample-metadata").html("");

        // use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {
            // log the key/value pairs as they are being appended
            //console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
}; // end of function "getData"

// ------------------------------------------------------------------------------
// function that builds the bar chart
// ------------------------------------------------------------------------------
function createBarChart(sample){
    // retrieve the data
    d3.json(url).then((data) => {
        // retrieve all sample data
        let sampleInfo = data.samples;
        // filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);
        // get the first index from the array
        let valueData = value[0];

        // get the otu_ids, lables, and sample values
        let otuIds = valueData.otu_ids;
        let otuLabels = valueData.otu_labels;
        let sampleValues = valueData.sample_values;

        //console.log(otuIds,otuLabels,sampleValues);

        // set top ten items to display in descending order
        let yVals = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xVals = sampleValues.slice(0,10).reverse();
        let labels = otuLabels.slice(0,10).reverse();

        // set up the trace for the bar chart
        let trace1 = {
        x: xVals,
        y: yVals,
        text: labels,
        type: "bar",
        orientation: "h"
        };  
        
        // setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // use plotly to plot the bar chart
        Plotly.newPlot("bar", [trace1], layout)

    });
}; // end of function "createBarChart"


// ------------------------------------------------------------------------------
// function that updates the page when the dropdown menu is changed
// ------------------------------------------------------------------------------
function optionChanged(value){
    //console.log(value);
    getData(value);
    createBarChart(value);
}; // end of function "optionChanged"


init();