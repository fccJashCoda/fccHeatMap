(() => {
  window.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const URL = 'http://localhost:5555/api';
    // const URL =
    //   'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    // const WIDTH = 860;
    const WIDTH = 1000;
    const HEIGHT = 500;
    const PADDING = 60;

    // Init
    const data = await fetchData();
    const processed = await processData(data);
    renderData(processed);

    async function fetchData() {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data.data);
        return data.data;
      } catch (err) {
        return {};
      }
    }

    function processData(rawData) {
      const { baseTemperature, monthlyVariance } = rawData;

      function _roundToTwo(n) {
        return +(Math.round(n + 'e+2') + 'e-2');
      }

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

      const newMonthlyVariance = [];
      for (let data of monthlyVariance) {
        const variance = _roundToTwo(data.variance);
        const temperature = _roundToTwo(baseTemperature + variance);
        const month = monthNames[data.month - 1];
        const year = data.year;

        newMonthlyVariance.push({ year, variance, temperature, month });
      }

      return {
        baseTemperature,
        monthlyVariance: newMonthlyVariance,
        monthNames,
      };
    }

    function renderData(dataset) {
      // Private Function Declarations
      function getTemperatureColor(temperature) {
        switch (true) {
          case temperature >= 12.8:
            return 'crimson';
          case temperature >= 11.7:
            return 'orange';
          case temperature >= 9.6:
            return 'orange';
          case temperature >= 8.5:
            return 'yellow';
          case temperature >= 7.4:
            return 'skyblue';
          case temperature >= 6.3:
            return 'skyblue';
          case temperature >= 5.2:
            return 'skyblue';
          case temperature >= 4.1:
            return 'skyblue';
          case temperature >= 3.0:
            return 'skyblue';
          case temperature >= 1.9:
            return 'skyblue';
          default:
            return 'blue';
        }
      }

      const _tooltipHTML = (d) => `
      ${d.Place} - ${d.Name}, ${d.Nationality} 
        <br>
        Year: ${d.Year} Time: ${d.Time}
        
        ${d.Doping ? `<br><span class='warning'>${d.Doping}</span>` : ''}

      `;

      //  Data
      const { baseTemperature, monthlyVariance, monthNames } = dataset;

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

      const y = d3
        .scaleBand()
        .domain(monthNames)
        .range([10, HEIGHT - PADDING]);

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
        .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);

      svg
        .selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', (d) => x(new Date(String(d.year))))
        .attr('y', (d) => y(d.month))
        .attr('fill', (d) => getTemperatureColor(d.temperature))
        .attr('width', `${Math.ceil(WIDTH / monthlyVariance.length) + 3}px`)
        .attr('height', `${Math.ceil(HEIGHT / monthNames.length) - 5}px`)
        .attr('data-month', (d) => d.month)
        .attr('data-year', (d) => d.year)
        .attr('data-temp', (d) => d.variance);

      // Tooltip animation
      svg
        .selectAll('.dot')
        .on('mouseover', (d, i) => {
          tooltip
            .html(`${_tooltipHTML(d)}`)
            .attr('data-year', `${new Date(String(d.year))}`)
            .style('visibility', 'visible')
            .style('top', `${y(monthNames[d.month - 1]) - 20}px`)
            .style('left', `${x(new Date(String(d.year)))}px`)
            .style('background', `#333`);
        })
        .on('mouseout', () => {
          tooltip.style('visibility', 'hidden');
        });

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
