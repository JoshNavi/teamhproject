(function(d3) {
  "use strict";

  d3.json("/mood/race/black", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeRaceChart(data);
  });

/*
  d3.json("/race", function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    makeRaceGeographyChart(data);
  });*/

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

/*
 * This function creates the stacked bar chart (chart1)
 *
 */

makeRaceGeographyChart = function(data) {

  //console.log("fuck you");
  var margin = {top: 20, right: 30, bottom: 150, left: 40},
    width = window.innerWidth - margin.left - margin.right - 180,
    height = 500 - margin.top - margin.bottom;

    //console.log(data);

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select(".chart1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var csvData = [];
  var areaDict = {};
  data.map(function (elem) {
    if (elem.race.indexOf('Any') == 0) return;

    if (!areaDict[elem.area]) {
      areaDict[elem.area] = {};
      // areaDict = {
      //   'alpine': {}
      // }
    }
    areaDict[elem.area][elem.race] = elem.population;
    // areaDict = {
    //   'alpine': {
    //     'black': 999
    //   }
    // }

    return;
  });
  for (key in areaDict) {
    var row = {}
    row.Area = key; // name whatever that column
    for (race in areaDict[key]) {
      row[race] = areaDict[key][race];
    }
    csvData.push(row);
  }

  color.domain(d3.keys(csvData[0]).filter(function(key) { return key !== "Area"; }));
  csvData.forEach(function(d) {
    var y0 = 0;
    d.races = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.races[d.races.length - 1].y1;
  });
  csvData.sort(function(a, b) { return b.total - a.total; });
  x.domain(csvData.map(function(d) { return d.Area; }));
  y.domain([0, d3.max(csvData, function(d) { return d.total; })]);
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

  var state = svg.selectAll(".state")
      .data(csvData)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.Area) + ",0)"; });

  var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");

  state.selectAll("rect")
      .data(function(d) { return d.races; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); })
      .on('mouseover', function(d) {
        return tooltip.style("visibility", "visible").text("Number");
      })
      .on('mouseout', function() {
        return tooltip.style("visibility", "hidden");
      });

//+ (Number(d.y1).toFixed(2))


  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  legend.append("rect")
      .attr("x", width - 98)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
  legend.append("text")
      .attr("x", width - 104)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

    }

/* MOOD BAR CHART:
 * This fucntion creates the grouped bar chart (chart2)
*/


makeRaceChart = function(data) {

  var margin = {top: 20, right: 20, bottom: 180, left: 80},
  width = window.innerWidth - margin.left - margin.right - 180,
  height = 500 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "%");

  var svg = d3.select("#chart2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var csvData = [];
      var areaDict = {};
      data.map(function (elem) {
        if (!areaDict[elem.geography]) {
          areaDict[elem.geography] = {};
        }
        areaDict[elem.geography][elem.year] = elem.rate;
        return;
      });
      for (key in areaDict) {
        var row = {}
        row.Geography = key;
        for (year in areaDict[key]) {
          row[year] = areaDict[key][year];
        }
        csvData.push(row);
      }

  console.log("hello world");
  console.log(csvData);

  var yearNames = d3.keys(csvData
    [0]).filter(function(key) { return key !== "Geography"; });
  console.log(yearNames);



  csvData.forEach(function(d) {
    d.rates = yearNames.map(function(name) { return {name: name, value: +d[name]}; });
    console.log(d.rates);
  });

  x0.domain(csvData.map(function(d) { return d.Geography; }));
  x1.domain(yearNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(csvData, function(d) { return d3.max(d.rates, function(d) { return d.value; }); })]);

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

  var state = svg.selectAll(".state")
      .data(csvData)
    .enter().append("g")
      .attr("class", "state")
      .attr("transform", function(d) { return "translate(" + x0(d.Geography) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.rates; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(yearNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 98)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 104)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

}

/**********************************/

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




makeHospitalizationArc = function(data) {
  var margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = window.innerWidth - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

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
    .on("click", function(d,i){return expandGraph(d);})
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
      .style("font", "bold 30px Dosis")
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




}

/*
 * When this function is called, a particular pie chart will appear that
 * corresponds to the selected mental disorder (schizophrenia, mood disorder,
 * anxiety disorder)
 */

expandGraph = function(d, i) {

  if(d.data.label == "Anxiety Disorders")
  {
    d3.json("/anxiety/race", function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      makeAnxietyPie(data);
    });
  }

  if(d.data.label == "Mood Disorders")
  {
    d3.json("/mood/race", function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      makeMoodPie(data);
    });
  }

  if(d.data.label == "Schizophrenia")
  {
    d3.json("/schizophrenia/race", function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      makeSchizPie(data);
    });
  }
}





makeMoodPie = function(data) {
    // console.log("ArchExpand blah blah blah");
    // console.log(data);

    // console.log("Mood Pie Working");


    var totalRace = {
      API: 0,
      Hispanic: 0,
      Black: 0,
      White: 0,
      Other: 0
    };

    for(var i = 0; i < data.length; i++)
    {
      // console.log("test");
      // console.log(data[i].race);
      if(data[i].race == "API")
      {
        totalRace.API += data[i].rate;
      }

      if(data[i].race == "Hispanic")
      {
        totalRace.Hispanic += data[i].rate;
      }

      if(data[i].race == "Black")
      {
        totalRace.Black += data[i].rate;
      }

      if(data[i].race == "White")
      {
        totalRace.White += data[i].rate;
      }

      if(data[i].race == "Other")
      {
        totalRace.Other += data[i].rate;
      }

    }

    // console.log(totalRace.API);


    var pieData = [
      {
        race: "API",
        value: totalRace.API
      },

      {
        race: "Hispanic",
        value: totalRace.Hispanic
      },

      {
        race: "Black",
        value: totalRace.Black

      },

      {
        race: "White",
        value: totalRace.White
      },

      {
        race: "Other",
        value: totalRace.Other
      }
    ];

    var line1 = d3.select("#line1")
      .select("svg")
      .remove("svg");

    var w = 1000;
    var h = 100;

    var lsvg = d3.select("#line1")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("id", "theLine");

    var line1 = lsvg.append("line")
      .style("stroke", "steelblue")
      .attr("stroke-width", "5");

    line1
      .attr("x1", 500)
      .attr("y1", 0)
      .attr("x2", 500)
      .attr("y2", 300)
      .transition()
        .duration(3000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

    var chart = d3.select("#expandedChart")
      .select("svg")
      .remove("svg");

    var margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = window.innerWidth - margin.left - margin.right,
    height = 1300 - margin.top - margin.bottom;

    var max = d3.max( data.map(function(d){ return parseInt(d.total); }) );
    var sum = d3.sum( data.map(function(d){ return parseInt(d.total); }) );

    var pie = d3.layout.pie()
      .value(function(d) {
        return d.value;
      });

    var arc = d3.svg.arc()
      .outerRadius(250);



    var colors = d3.scale.category20c();

    var chart = d3.select("#expandedChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + ", " + height / 4 + ")");

    var arc = d3.svg.arc()
      .outerRadius(250);

    var pie = d3.layout.pie()
      .value(function(d) {
        return d.value;
      });

    var arcs = chart.selectAll('g.slice').data(pie(pieData))
        .enter().append('g')
        .attr("class", "booty");

    arcs.append("path")
      .attr('d', arc)
      .style('fill', function(d, i){ return colors(i); })
        .on("click", function(d, i) { return makeRaceChart(d) });



   //console.log(pieData[1].value);
   arcs.append("svg:text")
       .attr("transform", function(d) { //set the label's origin to the center of the arc
         d.outerRadius = radius - 50; // Set Outer Coordinate
         d.innerRadius = radius + 125; // Set Inner Coordinate
         return "translate(" + (arc.centroid(d)[0] + 10) + ", " + (arc.centroid(d)[1] + 20) + ")";
       })
       .attr("text-anchor", "middle") //center the text on it's origin
       .style("fill", "Black")
       .style("font", "bold 30px Arial")
       .text(function(d, i){
        return pieData[i].value; });



    // Computes the angle of an arc, converting from radians to degrees.
    function angle(d) {
      var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
      return a > 90 ? a - 180 : a;
    }

  var xCoor = -60;
  var yCoor = 20;

  var legendRectSize = 50;
  var legendSpacing = 4;

  var legend = chart.selectAll('.legend')
    .data( pieData )
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = 6 * legendRectSize + 20;
      var vert = i * height - offset - 75;
      return 'translate(' + horz + ',' + vert + ')';
    })
    .style('float', 'right');


    legend.append('rect')                                     // NEW
      .attr('width', legendRectSize)                          // NEW
      .attr('height', legendRectSize)                         // NEW
      .style('fill', function(d, i) { return colors(i); })                                   // NEW
      .style('stroke', color);                               // NEW

    legend.append('text')                                     // NEW
      .attr('x', legendRectSize + legendSpacing)              // NEW
      .attr('y', legendRectSize - legendSpacing)              // NEW
      .text(function(d,i) { return d.race; })
      .attr("transform", "translate(" + 10 + "," + -15  + ")")
      .style("font", "18px Arial");

  }

<<<<<<< HEAD
/*
 * When this functino is called, the grouped bar graph will appear depending
 * on which race on the pie graph is clicked
 */
=======
  makeAnxietyPie = function(data) {
      // console.log("ArchExpand blah blah blah");
      // console.log(data);

      // console.log("Mood Pie Working");


      var totalRace = {
        API: 0,
        Hispanic: 0,
        Black: 0,
        White: 0,
        Other: 0
      };

      for(var i = 0; i < data.length; i++)
      {
        // console.log("test");
        // console.log(data[i].race);
        if(data[i].race == "API")
        {
          totalRace.API += data[i].rate;
        }

        if(data[i].race == "Hispanic")
        {
          totalRace.Hispanic += data[i].rate;
        }

        if(data[i].race == "Black")
        {
          totalRace.Black += data[i].rate;
        }

        if(data[i].race == "White")
        {
          totalRace.White += data[i].rate;
        }

        if(data[i].race == "Other")
        {
          totalRace.Other += data[i].rate;
        }

      }

      // console.log(totalRace.API);


      var pieData = [
        {
          race: "API",
          value: totalRace.API
        },

        {
          race: "Hispanic",
          value: totalRace.Hispanic
        },

        {
          race: "Black",
          value: totalRace.Black

        },

        {
          race: "White",
          value: totalRace.White
        },

        {
          race: "Other",
          value: totalRace.Other
        }
      ];

      var line1 = d3.select("#line1")
        .select("svg")
        .remove("svg");

      var w = 1000;
      var h = 300;

      var lsvg = d3.select("#line1")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("id", "theLine");

      var line1 = lsvg.append("line")
        .style("stroke", "steelblue")
        .attr("stroke-width", "5");

      line1
        .attr("x1", 500)
        .attr("y1", 0)
        .attr("x2", 500)
        .attr("y2", 300)
        .transition()
          .duration(3000)
          .ease("linear")
          .attr("stroke-dashoffset", 0);

      var chart = d3.select("#expandedChart")
        .select("svg")
        .remove("svg");

      var margin = {top: 0, right: 20, bottom: 0, left: 20},
      width = window.innerWidth - margin.left - margin.right,
      height = 1300 - margin.top - margin.bottom;

      var max = d3.max( data.map(function(d){ return parseInt(d.total); }) );
      var sum = d3.sum( data.map(function(d){ return parseInt(d.total); }) );

      var pie = d3.layout.pie()
        .value(function(d) {
          return d.value;
        });

      var arc = d3.svg.arc()
        .outerRadius(250);



      var colors = d3.scale.category20c();

      var chart = d3.select("#expandedChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + ", " + height / 4 + ")");

      var arc = d3.svg.arc()
        .outerRadius(250);

      var pie = d3.layout.pie()
        .value(function(d) {
          return d.value;
        });

      var arcs = chart.selectAll('g.slice').data(pie(pieData))
          .enter().append('g')
          .attr("class", "booty");

      arcs.append("path")
        .attr('d', arc)
        .style('fill', function(d, i){ return colors(i); })
          .on("click", function(d, i) { return expandRaceA(d) });



     //console.log(pieData[1].value);
     arcs.append("svg:text")
         .attr("transform", function(d) { //set the label's origin to the center of the arc
           d.outerRadius = radius - 50; // Set Outer Coordinate
           d.innerRadius = radius + 125; // Set Inner Coordinate
           return "translate(" + (arc.centroid(d)[0] + 10) + ", " + (arc.centroid(d)[1] + 20) + ")";
         })
         .attr("text-anchor", "middle") //center the text on it's origin
         .style("fill", "Black")
         .style("font", "bold 30px Arial")
         .text(function(d, i){
          return pieData[i].value; });



      // Computes the angle of an arc, converting from radians to degrees.
      function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
      }

    var xCoor = -60;
    var yCoor = 20;

    var legendRectSize = 50;
    var legendSpacing = 4;

    var legend = chart.selectAll('.legend')
      .data( pieData )
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = 6 * legendRectSize + 20;
        var vert = i * height - offset - 75;
        return 'translate(' + horz + ',' + vert + ')';
      })
      .style('float', 'right');


      legend.append('rect')                                     // NEW
        .attr('width', legendRectSize)                          // NEW
        .attr('height', legendRectSize)                         // NEW
        .style('fill', function(d, i) { return colors(i); })                                   // NEW
        .style('stroke', color);                               // NEW

      legend.append('text')                                     // NEW
        .attr('x', legendRectSize + legendSpacing)              // NEW
        .attr('y', legendRectSize - legendSpacing)              // NEW
        .text(function(d,i) { return d.race; })
        .attr("transform", "translate(" + 10 + "," + -15  + ")")
        .style("font", "18px Arial");

    }

makeSchizPie = function(data) {
  console.log(data);

  var totalRace = {
    API: 0,
    Hispanic: 0,
    Black: 0,
    White: 0,
    Other: 0
  };

  for(var i = 0; i < data.length; i++)
  {
    if(data[i].race == "API")
    {
      totalRace.API += data[i].total;
    }

    if(data[i].race == "Hispanic")
    {
      totalRace.Hispanic += data[i].total;
    }

    if(data[i].race == "Black")
    {
      totalRace.Black += data[i].total;
    }

    if(data[i].race == "White")
    {
      totalRace.White += data[i].total;
    }

    if(data[i].race == "Other")
    {
      totalRace.Other += data[i].total;
    }
  }

  console.log(totalRace);

  var pieData = [
    {
      race: "API",
      value: totalRace.API
    },

    {
      race: "Hispanic",
      value: totalRace.Hispanic
    },

    {
      race: "Black",
      value: totalRace.Black

    },

    {
      race: "White",
      value: totalRace.White
    },

    {
      race: "Other",
      value: totalRace.Other
    }
  ];

  console.log(pieData);

  var line1 = d3.select("#line1")
    .select("svg")
    .remove("svg");

  var w = 1000;
  var h = 300;

  var lsvg = d3.select("#line1")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("id", "theLine");

  var line1 = lsvg.append("line")
    .style("stroke", "steelblue")
    .attr("stroke-width", "5");

  line1
    .attr("x1", 500)
    .attr("y1", 0)
    .attr("x2", 500)
    .attr("y2", 300)
    .transition()
      .duration(3000)
      .ease("linear")
      .attr("stroke-dashoffset", 0);

  var chart = d3.select("#expandedChart")
    .select("svg")
    .remove("svg");

  var margin = {top: 0, right: 20, bottom: 0, left: 20},
  width = window.innerWidth - margin.left - margin.right,
  height = 1300 - margin.top - margin.bottom;

  var max = d3.max( data.map(function(d){ return parseInt(d.total); }) );
  var sum = d3.sum( data.map(function(d){ return parseInt(d.total); }) );

  var pie = d3.layout.pie()
    .value(function(d) {
      return d.value;
    });

  var arc = d3.svg.arc()
    .outerRadius(250);

  var colors = d3.scale.category20c();

  var chart = d3.select("#expandedChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + ", " + height / 4 + ")");

  var arc = d3.svg.arc()
    .outerRadius(250);

  var pie = d3.layout.pie()
    .value(function(d) {
      return d.value;
    });

  var arcs = chart.selectAll('g.slice').data(pie(pieData))
      .enter().append('g')
      .attr("class", "booty");

  arcs.append("path")
    .attr('d', arc)
    .style('fill', function(d, i){ return colors(i); })
      .on("click", function(d, i) { return expandRaceA(d) });



 //console.log(pieData[1].value);
 arcs.append("svg:text")
     .attr("transform", function(d) { //set the label's origin to the center of the arc
       d.outerRadius = radius - 50; // Set Outer Coordinate
       d.innerRadius = radius + 125; // Set Inner Coordinate
       return "translate(" + (arc.centroid(d)[0] + 10) + ", " + (arc.centroid(d)[1] + 20) + ")";
     })
     .attr("text-anchor", "middle") //center the text on it's origin
     .style("fill", "Black")
     .style("font", "bold 30px Arial")
     .text(function(d, i){
      return pieData[i].value; });



  // Computes the angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  var xCoor = -60;
  var yCoor = 20;

  var legendRectSize = 50;
  var legendSpacing = 4;

  var legend = chart.selectAll('.legend')
    .data( pieData )
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = 6 * legendRectSize + 20;
      var vert = i * height - offset - 75;
      return 'translate(' + horz + ',' + vert + ')';
    })
    .style('float', 'right');

  legend.append('rect')                                     // NEW
    .attr('width', legendRectSize)                          // NEW
    .attr('height', legendRectSize)                         // NEW
    .style('fill', function(d, i) { return colors(i); })                                   // NEW
    .style('stroke', color);                               // NEW

  legend.append('text')                                     // NEW
    .attr('x', legendRectSize + legendSpacing)              // NEW
    .attr('y', legendRectSize - legendSpacing)              // NEW
    .text(function(d,i) { return d.race; })
    .attr("transform", "translate(" + 10 + "," + -15  + ")")
    .style("font", "18px Arial");

}


  expand_makeRaceChart = function(d, i) {

    console.log(d.data.race);

    if(d.data.label == "")
    {
      d3.json("/mood/race/black", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/mood/race/white", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/mood/race/hispanic", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/anxiety/race/api", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/anxiety/race/other", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }


    if(d.data.label == "")
    {
      d3.json("/anxiety/race/black", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/anxiety/race/white", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/anxiety/race/hispanic", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/anxiety/race/api", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }

    if(d.data.label == "")
    {
      d3.json("/anxiety/race/other", function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        makeRaceChart(data);
      });
    }



  }
