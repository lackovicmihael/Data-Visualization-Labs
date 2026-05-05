const width = 900;
const height = 600;

const svg = d3.select("#map");
const g = svg.append("g");

const projection = d3.geoMercator()
    .center([16, 45])
    .scale(4000)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

svg.call(zoom);

d3.json("../data/cro.json").then(data => {

    const geo = topojson.feature(data, data.objects.layer1);

    const color = d3.scaleSequential()
        .domain([
            d3.min(geo.features, d => d.properties.population),
            d3.max(geo.features, d => d.properties.population)
        ])
        .interpolator(d3.interpolateReds);

    g.selectAll("path")
        .data(geo.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => color(d.properties.population))

        .on("click", (event, d) => {

            event.stopPropagation();

            const [[x0, y0], [x1, y1]] = path.bounds(d);

            svg.transition()
                .duration(750)
                .call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
                );

            d3.select("#info").html(`
                <b>${d.properties.name}</b><br>
                Populacija: ${d.properties.population}<br>
                Površina: ${d.properties.area} km²<br>
                Župan: ${d.properties.mayor}
            `);

            setTimeout(() => {
                svg.transition()
                    .duration(750)
                    .call(zoom.transform, d3.zoomIdentity);

                d3.select("#info").text("Klikni županiju");
            }, 10000);
        });
});

// klik na prazno resetira zoom
svg.on("click", () => {
    svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
});