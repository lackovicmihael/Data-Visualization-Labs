const width = 900;
const height = 600;

const svg = d3.select("#map");
const g = svg.append("g");

const projection = d3.geoMercator()
    .center([16, 45])
    .scale(4000)
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

d3.json("../data/cro.json").then(data => {

    const geo = topojson.feature(data, data.objects.layer1);

    // skala boja, mapira populaciju u boju
    const color = d3.scaleSequential()
        .domain([
            d3.min(geo.features, d => d.properties.population),
            d3.max(geo.features, d => d.properties.population)
        ])
        .interpolator(d3.interpolateBlues);

    g.selectAll("path")
        .data(geo.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => color(d.properties.population)) // boja zupanije prema populaciji

        .on("click", (event, d) => {
            d3.select("#info").html(`
                <b>${d.properties.name}</b><br>
                Populacija: ${d.properties.population}<br>
                Površina: ${d.properties.area} km²<br>
                Župan: ${d.properties.mayor}
            `);
        });
});