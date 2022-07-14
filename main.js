var margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;

var svg = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'graph')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var tooltip = d3
  .select('.main')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);


d3.json(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(function (data) {

        console.log(data);

        data.forEach(function(d){
            d.Place = +d.Place;
            var parsedTime = d.Time.split(':');
            d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        })

        var xMin = d3.min(data, (d) => d.Year)
        xMin -= 1;

        var xMax = d3.max(data, (d) => d.Year)
        xMax += 1;

        var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([0, width]);

        var yMin = d3.min(data, (d) => d.Time)
        var yMax = d3.max(data, (d) => d.Time)

        var yScale = d3
        .scaleTime()
        .domain([yMin, yMax])
        .range([height, 0]);

        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var points = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.Year))
        .attr("cy", (d) => yScale(d.Time))
        .attr("data-xvalue", (d) => d.Year)
        .attr("data-yvalue", (d) => d.Time.toISOString())
        .attr("r", (d) => 5)
        .attr("class", "dot")
        .style('fill', function (d) {
            return color(d.Doping !== '');
          })

        var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));

        svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

        var yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.timeFormat('%M:%S'));

        svg
        .append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .append('text')

        svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -160)
        .attr('y', -44)
        .style('font-size', 18)
        .text('Time in Minutes');

        points.on('mouseover', function (event, d) {
            tooltip.style('opacity', 0.9);
            tooltip.attr('data-year', d.Year);
            tooltip
              .html(
                d.Name +
                  ': ' +
                  d.Nationality +
                  '<br/>' +
                  'Year: ' +
                  d.Year +
                  ', Time: ' +
                  d3.timeFormat('%M:%S')(d.Time) +
                  (d.Doping ? '<br/><br/>' + d.Doping : '')
              )
              .style('left', event.pageX + 'px')
              .style('top', event.pageY - 28 + 'px');
          })
          .on('mouseout', function () {
            tooltip.style('opacity', 0);
          });

            // title
        svg
            .append('text')
            .attr('id', 'title')
            .attr('x', width / 2)
            .attr('y', 0 - margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '30px')
            .text('Doping in Professional Bicycle Racing');

        // subtitle
        svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', 0 - margin.top / 2 + 25)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .text("35 Fastest times up Alpe d'Huez");

        var legendContainer = svg.append('g').attr('id', 'legend');

        var legend = legendContainer
            .selectAll('#legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend-label')
            .attr('transform', function (d, i) {
            return 'translate(0,' + (height / 2 - i * 20) + ')';
            });
    
        legend
            .append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);
    
        legend
            .append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .text(function (d) {
            if (d) {
                return 'Riders with doping allegations';
            } else {
                return 'No doping allegations';
            }
            });

    }).catch(function(error){
        console.log(error);
    })

