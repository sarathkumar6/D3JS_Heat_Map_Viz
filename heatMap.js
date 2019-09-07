    let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
    let color = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"];
    let colors = color.reverse();
    let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


    d3.json(url, (dataset) => {

      let data = dataset.monthlyVariance;

      function monthName(month){
        let date = new Date(0);
        date.setUTCMonth(month);
        return d3.timeFormat("%B")(date);
      }

      let padding = {"top": 110, "bottom": 80, "left": 80, "right": 80},
        width = 4 * Math.ceil(dataset.monthlyVariance.length / 12),
        height = 33 * 12;

      const tooltip = d3.select("body")
          .append("div")
          .attr("id", "tooltip");

      const svg = d3.select("body")
        .append("svg")
        .attr("width", width + padding.left + padding.right)
        .attr("height", height + padding.top + padding.bottom);

      svg.append("text")
        .text("Monthly Global Land-Surface Temperature")
        .attr("id", "title")
        .attr("x", "50%")
        .attr("y", "40")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .style("font-size", 28)
        .style("font-family", "Times New Roman")
        .style("font-weight", "bold");

      svg.append("text")
        .text(
          d3.min(dataset.monthlyVariance, (d) => d.year) + " - " + d3.max(dataset.monthlyVariance, (d) => d.year) + ": base temperature " + dataset.baseTemperature + "℃")
        .attr("id", "description")
        .attr("x", "50%")
        .attr("y", "80")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .style("font-size", 20)
        .style("font-family", "Times New Roman");


      let colorScale = d3.scaleQuantile()
        .domain(d3.extent(data, (d) => d.variance + dataset.baseTemperature))
        .range(color);

      let cards = svg.selectAll("rect")
        .data(data, (d) => d.month+':'+d.year)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-month", (d) => d.month - 1)
        .attr("data-year", (d) => d.year)
        .attr("data-temp", (d) => d.variance + dataset.baseTemperature)
        .attr("x", (d, i) => (d.year - 1753) * 4 + padding.left)
        .attr("y", (d, i) =>  (d.month - 1) * 33 + padding.top)
        .attr("width", 5)
        .attr("height", 33)
        .style("fill", (d) => colorScale(d.variance + dataset.baseTemperature))

        .on("mouseover", (d) => tooltip.style("visibility", "visible")
              .attr("data-year", d.year)
              .html(d.year + ' - ' + monthName(d.month-1) + '<br />' + (d3.format(".2f")(d.variance + dataset.baseTemperature)) + '&#8451;<br />' + d3.format(".2f")(d.variance) + '&#8451;')
        )
        .on("mousemove", () => tooltip.style("top", (d3.event.pageY-20)+"px")
              .style("left", (d3.event.pageX+20)+"px")
        )
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

      cards.append("title")
        .text((d) => d.variance);


      let xscale = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.year))
        .range([0, width]);

      let x_axis = d3.axisBottom()
        .scale(xscale)
        .tickFormat(d3.format("d"));

      svg.append("g")
        .attr("transform", "translate(" + padding.left + ", " + (padding.top + months.length * 33) + ")")
        .attr("id", "x-axis")
        .call(x_axis)
        .append("text")
        .text("Years")
        .style("text-anchor", "middle")
        .style("font-size", 18)
        .attr("fill", "black")
        .style("font-family", "Times New Roman")
        .attr("transform", "translate(" + (width) / 2 + "," + (40) + ")");

      let yscale = d3.scaleBand()
        .domain(months)
        .rangeRound([0, height]);

      let y_axis = d3.axisLeft()
        .scale(yscale)
        .tickFormat((d) => monthName(d));

      svg.append("g")
        .attr("transform", "translate(" + padding.left + ", " + padding.top + ")")
        .attr("id", "y-axis")
        .call(y_axis)
        .append("text")
        .text("Months")
        .style("text-anchor", "middle")
        .style("font-size", 18)
        .attr("fill", "black")
        .style("font-family", "Times New Roman")
        .attr("transform", "translate(" + (-65) + "," + (months.length * 33 / 2) + ")" + "rotate(-90)");


      let colorScale1 = d3.scaleQuantile()
        .domain([0, 10])
        .range(colors);

      let svg1 = d3.select("body")
        .append("svg")
        .attr("width", 330)
        .attr("height", 50);

      svg1.append("g")
        .classed("legend", true)
        .attr("id", "legend")
        .selectAll("rect")
        .data( d3.range(color.length) )
        .enter()
        .append("rect")
        .attr("x", (d) => d * 30)
        .attr("y", 0)
        .attr("width", 30)
        .attr("height", 30)
        .style("fill", (d, i) => colorScale1(d));


      let min = d3.min(data, (d) => d.variance + dataset.baseTemperature),
          max = d3.max(data, (d) => d.variance + dataset.baseTemperature);
      let step = (max-min)/color.length;
      let base = min;
      let array = new Array(color.length);
      for(let i = 1 ; i < color.length ; i++){
        array.push(base + i*step);
      }

      let xscale1 = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.variance + dataset.baseTemperature))
        .range([0, 330]);

      let x_axis1 = d3.axisBottom()
        .scale(xscale1)
        .tickFormat(d3.format(".1f"))
        .tickValues(array);

      svg1.append("g")
        .attr("transform", "translate(0, " + 30 + ")")
        .call(x_axis1);

    });