const width = 900;
const height = 600;

const svg = d3.select("#map");
const g = svg.append("g"); // svi elementi karte idu u g (group)

const projection = d3.geoMercator()
    .center([16, 45])
    .scale(4000)
    .translate([width / 2, height / 2]);

// pretvara GeoJSON u SVG
const path = d3.geoPath().projection(projection);

const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
        g.attr("transform", event.transform); // zoom se primjenjuje na g, ne na SVG
    });

svg.call(zoom);

d3.json("../data/cro.json").then(data => {

    // TopoJSON nije direktno crtez, pretara ga u GeoJSON kojeg d3 razumije
    const geo = topojson.feature(data, data.objects.layer1);

    g.selectAll("path")
        .data(geo.features) // sve zupanije
        .enter()
        .append("path")
        .attr("d", path);
});