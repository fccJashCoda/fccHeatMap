(() => {
  window.addEventListener('DOMContentLoaded', async () => {
    // Constants
    const URL = 'http://localhost:5555/api';
    // const URL =
    //   'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    // const WIDTH = 860;
    const WIDTH = 1500;
    const HEIGHT = 560;
    const PADDING = 120;
    // const PADDING = 60;

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
            return '#ff0010';
          case temperature >= 11.7:
            return '#ff2900';
          case temperature >= 10.6:
            // return '#ff7900';
            return '#ff5300';
          case temperature >= 9.5:
            return '#ff7e00';
          // return '#ffa855';
          case temperature >= 8.3:
            // return '#ffba75';
            return '#ffa345';
          case temperature >= 7.2:
            return '#ffc486';
          // return '#ffe4cc';
          case temperature >= 6.1:
            // return '#fff0e8';
            return '#ffd7ae';
          case temperature >= 5.0:
            // return '#fff9ff';
            return '#dbe5ff';
          case temperature >= 3.9:
            return '#bed2ff';
          case temperature >= 2.8:
            return '#bacfff';
          default:
            return '#a1bfff';
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
      const minYear = new Date(String(d3.min(monthlyVariance, (d) => d.year)));
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
        .attr('width', `${Math.ceil(WIDTH / monthlyVariance.length) + 5}px`)
        .attr('height', `${Math.ceil(HEIGHT / monthNames.length) - 10}px`)
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
        .style('font', '14px arial')
        .call(xAxis);

      svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${PADDING}, 0)`)
        .style('font', '14px arial')
        .call(yAxis);

      svg
        .append('text')
        .attr('x', WIDTH / 2 - 30)
        .attr('y', HEIGHT - 60)
        .style('font', '20px arial')
        .text('Years');

      svg
        .append('text')
        .attr('x', -HEIGHT / 2 + 20)
        .attr('y', 25)
        .attr('transform', `rotate(-90)`)
        .style('font', '20px arial')
        .text('Months');

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
