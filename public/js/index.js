(function(d3) {
  "use strict";

  d3.json("/mood/race", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeRaceChart(data);
  });

  // d3.json("/race", function(err, data) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   makeRaceGeographyChart(data);
  // });

})(d3);


getColor = function(d) {

  if(d.race == "API"){
    return "Yellow";
  }
  if(d.race == "White"){
    return "Grey";
  }
  if(d.race == "Black"){
    return "Black";
  }
  if(d.race == "Hispanic"){
    return "Red";
  }

  return "Blue";
}

makeRaceChart = function(data) {
  var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = window.innerWidth - margin.left - margin.right - 50,
    height = 700 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");
      // .ticks(10, "%");

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function(d) { return d.year + ", " + d.race; }));
  y.domain([0, d3.max(data, function(d) { return d.rate; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Hospitalization Rate");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {return x(d.year + ", " + d.race); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.rate); })
      .attr("height", function(d) { return height - y(d.rate); })
      .style("fill", function(d) { return getColor(d); });

}

getGeographyColor = function(d) {

  if(d.race == "API"){
    return "Yellow";
  }
  if(d.race == "White"){
    return "Grey";
  }
  if(d.race == "Black"){
    return "Black";
  }
  if(d.race == "Hispanic"){
    return "Red";
  }

  return "Blue";
}

makeRaceGeographyChart = function(data) {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function(d) { return d.area + ", " + d.race; }));
  y.domain([0, d3.max(data, function(d) { return d.population; })]);

  console.log(y(10000));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Hospitalization Rate");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {return x(d.area + ", " + d.race); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.population); })
      .attr("height", function(d) {return height - y(d.population); })
      .style("fill", function(d) { return getGeographyColor(d); });

}
