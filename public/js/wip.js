(function(d3) {
  "use strict";

  d3.json("/mood/race", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeRaceChart(data);
  });

  d3.json("/race", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeRaceGeographyChart(data);
  });

  d3.json("/mood/total", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    // console.log(data);
    makeHospitalizationArc(data);
  });

})(d3);


getColor = function(d) {
  var c20 = d3.scale.category20().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  if(d.race == "API"){
    return c20(0);
  }
  if(d.race == "White"){
    return c20(2);
  }
  if(d.race == "Black"){
    return c20(4);
  }
  if(d.race == "Hispanic"){
    return c20(6);
  }

  return c20(8);
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

  var svg = d3.select("#link3info").append("svg")
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

makeHospitalizationArc = function(data) {
  var margin = {top:0, right: 20, bottom: 20, left: 20},
    outerWidth = window.innerWidth - margin.left - margin.right,
    outerHeight = 1000 - margin.top - margin.bottom;

  var rMin;
  var rMax;
  var xCol;

  var svg = d3.select("#link3info").append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", " 0 0 ");

}


makeRaceGeographyChart = function(data) {
  var margin = {top: 20, right: 30, bottom: 150, left: 70},
    width = window.innerWidth - margin.left - margin.right - 30,
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

  var svg = d3.select("#link3info").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function(d) { return d.area; }));
  y.domain([0, d3.max(data, function(d) { return d.population/1; })]);

  console.log(y(10000));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) {
              return "rotate(-65)"
              });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");

  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {return x(d.area); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.population/1); })
      .attr("height", function(d) {return height - y(d.population/1); })
      .style("fill", function(d) { return getColor(d); });

}



makeHospitalizationArc = function(data) {
  var margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = window.innerWidth - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom;

  // var width = 1400,
  //     height = 600,
  //     radius = Math.min(width, height);
  var dataset = [
          { label: 'Mood Disorders', total: 2},
          { label: 'Schizophrenia', total: 2 },
          { label: 'Anxiety Disorders', total: 2 }
        ]; // ADD IN data.whatever later

  var max = d3.max( data.map(function(d){ return parseInt(d.total); }) );
  var sum = d3.sum( data.map(function(d){ return parseInt(d.total); }) );

  var color = d3.scale.category20b();

/*
  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
*/
  

  

  var chart = d3.select("#finalChart")
    .append("svg")
    .data([dataset])
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + ")");

  var arc = d3.svg.arc()
    .innerRadius(radius + 50)
    .outerRadius(radius + 300);

  var pie = d3.layout.pie()
    .sort(null)
    .startAngle(0.5 * Math.PI)
    .endAngle(1.5 * Math.PI)
    .value(function(d) { return d.total; });

  var arcs = chart.selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class","slice");

  arcs.append("path")
  .attr("d",arc)
  .style("fill", function(d, i) { return color(i); })
    .on("click", function(d,i){return arcExpand(d,i);})
    .transition()
      .ease("exp")
      .duration(1800)
      .attrTween("d", tweenPie);

  arcs.append("svg:text")
      .attr("transform", function(d) { //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
        d.outerRadius = radius + 30; // Set Outer Coordinate
        d.innerRadius = radius + 45; // Set Inner Coordinate
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .style("fill", "White")
      .style("font", "bold 30px Arial")
      .text(function(d,i){ return dataset[i].label; });
    

  // var g = chart
  //   .selectAll(".arc")
  //   .data( pie(dataset) )
  //   .enter()
  //   .append("g")
  //   .attr("class", "arc");

  // g.append("path")
  //   .attr("d", arc)
  //   .style("fill", function(d, i) { return color(i); })
  //   .on("click", function(d,i){return arcExpand(d,i);})
  //   .transition()
  //     .ease("exp")
  //     .duration(1000)
  //     .attrTween("d", tweenPie);

  function tweenPie(b) {
    var i = d3.interpolate({startAngle: 1 * Math.PI, endAngle: 1 * Math.PI}, b);
    return function(t) { return arc(i(t));};
  }

  function arcExpand(d,i) {
    console.log("ArchExpand");
    console.log(d);

    var chart = d3.select("#expandedChart")
      .select("svg")
      .remove("svg");

    var margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = window.innerWidth - margin.left - margin.right,
    height = 1300 - margin.top - margin.bottom;

    // var max = d3.max( data.map(function(d){ return parseInt(d.total); }) );
    // var sum = d3.sum( data.map(function(d){ return parseInt(d.total); }) );

    var color = d3.scale.category20c();
    var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(250)
      .startAngle(0)
      .endAngle(2*Math.PI);

    // var pie = d3.layout.pie()
    //   .sort(null)
    //   .startAngle(0 * Math.PI)
    //   .endAngle(2 * Math.PI)
    //   .value(function(d) { return d.total; });

    

    svg = d3.select("#expandedChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + ", " + height / 5 + ")");

    // var g = svg
    //   .selectAll(".arc")
    //   .data( pie(dataset) )
    //   .enter()
    //   .append("g")
    //   .attr("class", "arc");

    svg.append("path")
      .attr("d", arc)
      .style("fill", function(d, i) { return color(i); })
     //  .transition().delay(function(d, i) { return i * 500; }).duration(500)
     //  .attrTween('d', function(d) {
     //   var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
     //    return function(t) {
     //       d.endAngle = i(t);
     //     return arc(d);
     //   }
     // });



      // .transition()
      //   .ease("exp")
      //   .duration(1000)
      //   .attrTween("d", tweenPie);

  }




}
