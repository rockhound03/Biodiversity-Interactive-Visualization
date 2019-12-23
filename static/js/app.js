var metaData;
var allSampleData;
var currentOtuIds;
var currentSampleValues;
var currentOtuLabels;

d3.json("./samples.json").then((data) => {
  //console.log(data);
  //var name = data.names;
  var idlist = Object.values(data.names);
  var mData = data.metadata;
  metaData = mData;
  var sampleData = data.samples;
  allSampleData = sampleData;
  //console.log(mData);
  //console.log(idlist);
  buildMenu(idlist);
  console.log(sampleData);
  updateInfo
})

d3.selectAll("#selDataset").on("change", updateInfo);

function buildMenu(ids){
var menu = d3.select("#selDataset");

  //var newItem = document.createElement("option");
  //var tmenu = menu.append("option");
var options = menu.selectAll("option")
  .data(ids)
  .enter()
  .append("option");
options.text(function(d) {
  return d;
   })
     .attr("value", function(d) {
  return d;
  });

}
// On change to the DOM, call getData()

function updateInfo(){
var dropdownMenu = d3.select("#selDataset");
var selectedOption = dropdownMenu.property("value");
var patientData = metaData.filter(patient => patient.id == selectedOption);
var patientSample = allSampleData.filter(sample => sample.id == selectedOption);
var patientSorted = patientSample.sort(function sortFunction(a, b){
  return b.sample_values - a.sample_values;
});
// Bar Plot **************************
currentOtuIds = patientSorted[0].otu_ids.slice(0, 10);
currentSampleValues = patientSorted[0].sample_values.slice(0, 10);
currentOtuLabels = patientSorted[0].otu_labels.slice(0, 10);
var barLabels = currentOtuIds.map(function(label) {
  return `OTU ${label}`;
});
var barData = [{
  type: 'bar',
  x: currentSampleValues,
  y: barLabels,
  orientation: 'h'
}];
var layout ={
  title: 'Top Ten Samples',
  annotations: [
    {text:patientSorted[0].otu_labels}]
}
Plotly.newPlot('bar', barData);

// Bubble Plot ***************************
//var largestSampleSize = Math.max(patientSorted[0].sample_values);
var bubbleSize = patientSorted[0].sample_values.map((sample) => {
  return sample;
});
var maxID = Math.max(patientSorted[0].otu_ids);
var altBubbleColors = patientSorted[0].otu_ids.map((id) =>{
  return d3.interpolateYlGn(id / maxID);
});
var sampleSize = patientSorted[0].sample_values.length;
var bubbleColors = patientSorted[0].otu_ids.map((sample) =>{
  return d3.interpolateSinebow((sample + 1)/ sampleSize);
})
var trace1 = {
  x: patientSorted[0].otu_ids,
  y: patientSorted[0].sample_values,
  text: patientSorted[0].otu_labels,
  mode: 'markers',
  marker: {
    color:bubbleColors,
    size: bubbleSize
  }
};

var data = [trace1];

var layout = {
  title: 'OTU Bubble Plot',
  showlegend: false,
  height: 600,
  width: 900
};

Plotly.newPlot('bubble', data, layout);
console.log(currentSampleValues);
console.log(currentOtuIds);
console.log(barLabels);
//sample-metadata

var tempArr = [];
tempArr.push(`id: ${patientData[0].id}`);
tempArr.push(`ethnicity: ${patientData[0].ethnicity}`);
tempArr.push(`gender: ${patientData[0].gender}`);
tempArr.push(`age: ${patientData[0].age}`);
tempArr.push(`location: ${patientData[0].location}`);
tempArr.push(`bbtype: ${patientData[0].bbtype}`);
tempArr.push(`wfreq: ${patientData[0].wfreq}`);
fillMetaData(tempArr);
//console.log(tempArr);
//console.log(patientData);

}

function fillMetaData(pData){
  var metaPanel = d3.select("#sample-metadata");
  var pData = metaPanel.selectAll("p")
    .data(pData)
    .enter()
    .append("p");
  pData.text(function(d){
    return d;
  })

}