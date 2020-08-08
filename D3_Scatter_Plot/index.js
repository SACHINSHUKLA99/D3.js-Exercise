import {
  select,
  csv,
  scaleLinear,
  extent,
  axisLeft,
  axisBottom,
  format
} from 'd3';




const titleText = 'ScatterPlot';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');
const circleradius=10;
const render = data => {
  const xAxisLabelText='horsepower';
  const yAxisLabelText='weight';

  const xValue = d => d.horsepower;
  const yValue = d => d.weight;

  const margin = { top: 50, right: 40, bottom: 97, left: 190 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const xScale = scaleLinear()
    .domain(extent(data,xValue))
    .range([0, innerWidth])
    .nice();
  
  const yScale = scaleLinear()
    .domain(extent(data,yValue))
    .range([0, innerHeight])
    .nice();
   
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xAxisTickFormat = number =>
    format('.3s')(number)
      .replace('G', 'B');
  
  const xAxis = axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight)
    .tickPadding(15);
    
  
  const yaxis=axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);
  const yaxisg = g.append('g')
    .call(yaxis);
  yaxisg
    .select('.domain')
      .remove(); 
  
  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);
  yaxisg.append('text')
      .attr('class', 'axis-label')
      .attr('y', -100)
      .attr('x', -innerHeight / 2)
      .attr('fill', 'black')
      .attr('text-anchor','middle')
      .text(yAxisLabelText)
       .attr('transform', 'rotate(-90)');
  xAxisG.select('.domain').remove();
  
  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('y', 75)
      .attr('x', innerWidth / 2)
      .attr('fill', 'black')
      .text(xAxisLabelText);
  
  g.selectAll('circle').data(data)
    .enter().append('circle')
      .attr('cy', d => yScale(yValue(d)))
      .attr('cx', d => xScale(xValue(d)))
      .attr('r', circleradius);
  
  g.append('text')
      .attr('class', 'title')
      .attr('y', -10)
      .attr('x',innerWidth/2)
      .text(titleText)
      .attr('text-anchor', 'middle');
};

// ///
// {
//     "mpg": "18",
//     "cylinders": "8",
//     "displacement": "307",
//     "horsepower": "130",
//     "weight": "3504",
//     "acceleration": "12",
//     "year": "1970",
//     "origin": "USA",
//     "name": "chevrolet chevelle malibu"
//   }


csv('https://vizhub.com/curran/datasets/auto-mpg.csv').then(data => {
  data.forEach(d => {
    d.mpg=+d.mpg;
    d.displacement = +d.displacement;
    d.horsepower = +d.horsepower;
    d.weight = +d.weight;
    d.acceleration = +d.acceleration;
    d.year=+d.year;
  });
  render(data);
});