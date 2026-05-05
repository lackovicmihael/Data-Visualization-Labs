const width = 900;
const height = 600;

const svg = d3.select("#map");

// pretvara geo. koordinate u piksele
const projection = d3.geoMercator()
    .center([16, 45])
    .scale(4000)
    .translate([width / 2, height / 2]);

// pretvara GeoJSON podatke u SVG putanje (<path>)
const path = d3.geoPath().projection(projection);


d3.json("../data/cro.json").then(data => {
    
    // pretvara TopoJSON u GeoJSON
    const geo = topojson.feature(data, data.objects.layer1);

    // prolazi kroz sve zupanije i kreira putanju (<path>)
    svg.selectAll("path")
        .data(geo.features)
        .enter()
        .append("path")
        .attr("d", path)

        .on("mousemove", (event, d) => {
            d3.select("#info")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px")
                .text(d.properties.name);
        });
});