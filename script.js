fetch(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
)
    .then((response) => response.json())
    .then((data) => {
        const svg = d3.select("#canvas");
        const width = document.querySelector("#canvas").clientWidth;
        const height = document.querySelector("#canvas").clientHeight;

        // define hierarchy and treemap layout
        let root = d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value);
        const treemap = d3.treemap().size([width, height]).paddingInner(2);
        treemap(root);

        // add colors to groups
        root.children.forEach(
            (group) =>
                (group.fill = `hsl(${Math.floor(Math.random() * 360)}, 50%, 70%)`)
        );
        // form treemap graphical representation
        svg
            .selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr("x", (d) => d.x0)
            .attr("y", (d) => d.y0)
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("fill", (d) => d.ancestors()[1].fill)
            .attr("class", "tile")
            .attr("data-name", (d) => d.data.name)
            .attr("data-category", (d) => d.data.category)
            .attr("data-value", (d) => d.data.value)

            // show tooltip on tile:hover
            .on("mousemove", (event, d) => {
                const tooltip = d3.select("#tooltip");
                tooltip
                    .style("display", "block")
                    .style("left", event.clientX + 8 + "px")
                    .style("top", event.clientY + "px")
                    .html(`${d.data.name}<br>${d.data.category}<br>${d.data.value}`)
                    .attr("data-value", d.data.value);
            })
            .on("mouseout", (event, d) => {
                const tooltip = d3.select("#tooltip");
                tooltip.style("display", "none");
            });

        const tiles = svg
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")");

        tiles
            .append("text")
            .style("font-size", ".4rem")
            .style("cursor", "default")
            .selectAll("tspan")
            .data((d) => d.data.name.split(" ").slice(0, 3))
            .enter()
            .append("tspan")
            .attr("x", 4)
            .attr("y", (d, i) => 8 + i * 10)
            .text((d) => d);

        const legendSvg = d3.select("#legend");
        const legendWidth = document.querySelector("#legend").clientWidth;
        const legendHeight = document.querySelector("#legend").clientHeight;

        legendSvg
            .selectAll("rect")
            .data(root.children)
            .enter()
            .append("rect")
            .attr("x", (d, i) =>
                i < Math.ceil(root.children.length / 2)
                    ? legendWidth / 5
                    : (3 * legendWidth) / 5
            )
            .attr(
                "y",
                (d, i) =>
                    20 +
                    ((i % Math.ceil(root.children.length / 2)) * legendHeight) /
                    (Math.ceil(root.children.length / 2) + 1)
            )
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", (d) => d.fill)
            .attr("class", "legend-item");

        legendSvg
            .selectAll("text")
            .data(root.children)
            .enter()
            .append("text")
            .attr(
                "x",
                (d, i) =>
                    (i < Math.ceil(root.children.length / 2)
                        ? legendWidth / 5
                        : (3 * legendWidth) / 5) + 14
            )
            .attr(
                "y",
                (d, i) =>
                    30 +
                    ((i % Math.ceil(root.children.length / 2)) * legendHeight) /
                    (Math.ceil(root.children.length / 2) + 1)
            )
            .style("font-size", ".7rem")
            .text((d) => d.data.name);
    })
    .catch((error) => console.log(error));
