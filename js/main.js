(() => {
  window.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const URL = 'http://localhost:5555/api';
    // const URL =
    //   'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    const WIDTH = 860;
    const HEIGHT = 500;
    const PADDING = 60;

    const plotColor1 = 'orange';
    const plotColor2 = 'steelblue';

    // Init
    renderData();

    async function renderData() {
      // Private Function Declarations
      async function _fetchData() {
        try {
          const response = await fetch(URL);
          const data = await response.json();
          console.log(data.data);
          return data.data;
        } catch (err) {
          return {};
        }
      }

      const _tooltipHTML = (d) => `
      ${d.Place} - ${d.Name}, ${d.Nationality} 
        <br>
        Year: ${d.Year} Time: ${d.Time}
        
        ${d.Doping ? `<br><span class='warning'>${d.Doping}</span>` : ''}

      `;

      // Populate Data
      const { baseTemperature, monthlyVariance } = await _fetchData();
      console.log(baseTemperature);
      console.log(monthlyVariance);

      // Scales
      const minYear = new Date(
        String(d3.min(monthlyVariance, (d) => d.year) - 1)
      );
      const maxYear = new Date(
        String(Number(d3.max(monthlyVariance, (d) => d.year)) + 1)
      );
      const x = d3
        .scaleTime()
        .domain([minYear, maxYear])
        .range([PADDING, WIDTH - 15]);

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const y = d3 // .scaleTime()
        .scaleBand()
        .domain(monthNames.reverse())
        .range([HEIGHT - PADDING, 10]);

      // Axis bars
      const xAxis = d3.axisBottom(x).ticks(20);
      const yAxis = d3.axisLeft(y);

      // Tooltip
      const tooltip = d3
        .select('article')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden');

      // Main SVG
      const svg = d3
        .select('article')
        .append('svg')
        .attr('id', 'title')
        .attr('width', WIDTH)
        .attr('height', HEIGHT)
        .attr('viewBox', '0 0 860 450');

      // svg
      //   .selectAll('circle')
      //   .data(dataset)
      //   .enter()
      //   .append('circle')
      //   .style('position', 'relative')
      //   .attr('class', 'dot')
      //   .attr('cx', (d, i) => x(new Date(String(d.Year))))
      //   .attr('cy', (d, i) => y(timeData[i]))
      //   .attr('r', 7)
      //   .attr('fill', (d) => (d.Doping ? plotColor1 : plotColor2))
      //   .attr('data-xvalue', (d) => new Date(String(d.Year)))
      //   .attr('data-yvalue', (d, i) => timeData[i]);

      // Tooltip animation
      // svg
      //   .selectAll('.dot')
      //   .on('mouseover', (d, i) => {
      //     tooltip
      //       .html(`${_tooltipHTML(d)}`)
      //       .attr('data-year', `${new Date(String(d.Year))}`)
      //       .style('visibility', 'visible')
      //       .style('top', `${y(timeData[i])}px`)
      //       .style('left', `${x(new Date(String(d.Year))) + 8}px`)
      //       .style('background', `${d.Doping ? plotColor1 : plotColor2}`);
      //   })
      //   .on('mouseout', () => {
      //     tooltip.style('visibility', 'hidden');
      //   });

      // Render Axiis bars
      svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${HEIGHT - PADDING})`)
        .call(xAxis);

      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${PADDING}, 0)`)
        .call(yAxis);

      svg
        .append('text')
        .attr('x', -HEIGHT / 2 - 30)
        .attr('y', 15)
        .attr('transform', `rotate(-90)`)
        .text('Ascent Time in Minutes');

      // Legend
      // const legend = svg
      //   .append('g')
      //   .attr('id', 'legend')
      //   .attr('transform', `translate(${WIDTH - 140}, ${50})`);

      // legend
      //   .append('rect')
      //   .attr('stroke', 'white')
      //   .attr('fill', 'transparent')
      //   .attr('width', 140)
      //   .attr('height', 50)
      //   .attr('x', -20)
      //   .attr('y', -20);
      // legend
      //   .append('rect')
      //   .attr('fill', plotColor1)
      //   .attr('width', 10)
      //   .attr('height', 10)
      //   .attr('x', -14)
      //   .attr('y', -10);
      // legend
      //   .append('rect')
      //   .attr('fill', plotColor2)
      //   .attr('width', 10)
      //   .attr('height', 10)
      //   .attr('x', -14)
      //   .attr('y', 10);
      // legend.append('text').text('= Doping allegation');
      // legend.append('text').text('= Clean').attr('y', 20);
    }
  });
})();
