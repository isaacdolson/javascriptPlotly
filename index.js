//I plan to try to write this without the server, which doesn't seem to be working for me, 
//and then if that can be figured out put that in later.
d3.json("data/samples.json").then((data) => {
    console.log(data)
// })

console.log(data)
var xVar = data.samples[0].sample_values.map(x=>x)
var xVar10 = xVar.slice(0,10).reverse()
// console.log(xVar10)
var sortBub = data.samples[0].otu_ids.map(x=>x)
// sortBub.sort(function compareFunction(firstNum, secondNum){
//     return firstNum - secondNum;
// }) // I guess I don't have to sort this, which is nice.
var yVar = data.samples[0].otu_ids.map(x=>`UTO ${x}`);
var yVar10 = yVar.slice(0,10).reverse()
// console.log(yVar10)
var text = data.samples[0].otu_labels.map(x=>x)
var text10 = text.slice(0,10).reverse();
// console.log(text)
var hBar = {
    x: xVar10,
    y: yVar10,
    text : text10,
    type: 'bar',
    orientation: 'h'
}

Plotly.newPlot("barPlot", [hBar])

var bChart = {
    x: sortBub,
    y: xVar,
    text: text,
    mode: 'markers',
    marker: {
        size:xVar,
        color:sortBub
    }
}

bcLayout = {
    xaxis :{
        title:{
            text: "OTU ID"
        }
        // ,label: 'OTU ID'
    }
}

Plotly.newPlot('bubblePlot', [bChart], bcLayout)

var names = data.names.map(x=>x)
var item = d3.select('#selDataset')
item.selectAll('option').data(names).enter().append('option').text(function(d){
    return d
    }) // I know, using methods from classes not in the scope, but it works!

var metadata = Object.entries(data.metadata[0])
d3.select('.demo-info').selectAll('div').data(metadata).enter().append('div')
.text(function(d){
    return d[0] + ': ' + d[1]
})

})

d3.selectAll("#selDataset").on("change", updatePlotly);

function updatePlotly() {
    var dropdownMenu = d3.select("#selDataset");
    var dataset = dropdownMenu.property("value");
    d3.json("data/samples.json").then((data) => {
        console.log(data)
        // }) // again not sure if this'll work, just getting it done before dealing witht this.
        console.log("dataset " + dataset)
        var dataIndex = data.names.indexOf(dataset);
        console.log("index "+dataIndex);
        console.log("MetaData Of the index: "+ data.metadata[dataIndex].id)
        //clearing and rewriting the demographic area
        //How I cleared before:     d3.select('tbody').selectAll('tr').remove()
        d3.select('.demo-info').selectAll('div').remove()
        var metadata = Object.entries(data.metadata[dataIndex])
        d3.select('.demo-info').selectAll('div').data(metadata).enter().append('div')
        .text(function(d){
            return d[0] + ': ' + d[1]
        })
        //Now to update the charts.
        var xVar = data.samples[dataIndex].sample_values.map(x=>x)
        var xVar10 = xVar.slice(0,10).reverse()
        var sortBub = data.samples[dataIndex].otu_ids.map(x=>x)
        var yVar = data.samples[dataIndex].otu_ids.map(x=>`UTO ${x}`);
        var yVar10 = yVar.slice(0,10).reverse()
        var text = data.samples[dataIndex].otu_labels.map(x=>x)
        var text10 = text.slice(0,10).reverse();
        //Should have done these in a function...
        //Plotly.restyle("plot", "x", [x]);
        Plotly.restyle("barPlot", "x", [xVar10]);
        Plotly.restyle("barPlot", "y", [yVar10]);
        Plotly.restyle("barPlot", "text", [text10]);

        Plotly.restyle("bubblePlot", "x", [sortBub]);
        Plotly.restyle("bubblePlot", "y", [xVar]);
        Plotly.restyle("bubblePlot", "text", [text]);
    })
}