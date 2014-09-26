var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 4000 - margin.top - margin.bottom;

var scaleWidth = 300;

var x = d3.scale.ordinal()
    .rangeBands([0, scaleWidth])
    .domain(['campsite', 'water', 'food', 'lodging', 'access']);

var y = d3.scale.linear()
    .range([height, 0])
    .domain([190, -5]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var xAxisTop = d3.svg.axis()
    .scale(x)
    .orient('top')
    .tickSize(-height);

var typeColor = d3.scale.category10()
    .domain(x.domain());

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(10);

var svg = d3.select('body').append('svg')
    .attr('id', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('campsites.csv', type('campsite'), function(error, campsites) {
  d3.csv('water.csv', type('water'), function(error, water) {
    d3.csv('food.csv', type('food'), function(error, food) {
      d3.csv('lodging.csv', type('lodging'), function(error, lodging) {
        d3.csv('access.csv', type('access'), function(error, access) {
          d3.csv('places.csv', type('places'), function(error, places) {
            render(campsites
              .concat(water)
              .concat(food)
              .concat(lodging)
              .concat(access), places);
          });
        });
      });
    });
  });
});

function render(data, places) {
  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,0)')
      .call(xAxisTop);

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Distance');

  var spots = svg.selectAll('.spot')
      .data(data)
    .enter().append('g')
      .attr('class', 'spot')
      .attr('transform', function(d) {
        return 'translate(' + [
          x(d.tag) + x.rangeBand() / 2,
          y(d.Mile)
        ] + ')'; })
      .on('click', function(d) {
        var h = d3.selectAll('#help')
          .html('');
        h.append('h3').text(d.Name);
        h.append('p').text(d.Info);
      });

   spots.append('circle')
      .attr('r', 10)
      .attr('fill', function(d) { return typeColor(d.tag); });

  spots
    .append('g')
    .attr('transform', 'translate(10,10)')
    .append('text')
    .text(function(d) { return(d.Name); });

  svg.selectAll('.place')
      .data(places)
    .enter().append('text')
      .attr('class', 'place')
      .text(function(d) { return d.Name; })
      .attr('transform', function(d) {
        return 'translate(' + [
          scaleWidth,
          y(d.Mile)
        ] + ')';
      });
}

function type(tag) {
  return function(d) {
    d.Mile = +d.Mile;
    d.tag = tag;
    return d;
  };
}
