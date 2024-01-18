import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { GraphData } from "../type";

interface GraphProps {
	data: GraphData;
}

const width = 900;
const height = 900;

const colors = d3.schemeTableau10;

const clamp = (x: number, lo: number, hi: number) => {
	return x < lo ? lo : x > hi ? hi : x;
};

export const Graph: React.FC<GraphProps> = ({ data }) => {
	const svgRef = useRef<SVGSVGElement | null>(null);

	useEffect(() => {
		if (!svgRef.current) return;

		// Clear previous graph
		d3.select(svgRef.current).selectAll("*").remove();

		// Set up the d3 force simulation
		const simulation = d3
			.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
			.force(
				"link",
				d3.forceLink(data.edges).id((link: any) => link.id),
			)
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(width / 2, height / 2));

		// Create SVG elements
		const svg = d3.select(svgRef.current);
		svg.attr("viewBox", [0, 0, width, height])
			.attr("width", width)
			.attr("height", height)
			.attr("style", " max-width: 100vw; height: 80vh;");

		// Add edges
		svg.selectAll("line")
			.data(data.edges ?? [])
			.enter()
			.append("line")
			.style("stroke", "#ccc")
			.style("stroke-width", 1);

		// Add nodes
		const nodes = svg
			.selectAll("circle")
			.data(data.nodes)
			.enter()
			.append("circle")
			.attr("r", (node) => (node.size ? node.size / 2 : 1))
			.style("fill", (node) => (node.color ? node.color : colors[Number(node.id) % 10]));

		nodes
			.append("title")
			.text((node) => `${node.label}` + (node.attributes ? ` - ${JSON.stringify(node.attributes)}}` : ""));

		const edges = svg
			.selectAll("line")
			.data(data?.edges ?? [])
			.join("line")
			.attr("style", (link) => `stroke: ${link.color}; stroke-width: ${link.size ? link.size / 2 : 1};`);

		// Update simulation on each tick
		simulation.on("tick", () => {
			nodes.attr("cx", (link: any) => link.x).attr("cy", (link: any) => link.y);
			edges
				.attr("x1", (link: any) => link.source.x)
				.attr("y1", (link: any) => link.source.y)
				.attr("x2", (link: any) => link.target.x)
				.attr("y2", (link: any) => link.target.y);
		});

		// Zoom functionality
		const zoom = d3
			.zoom()
			.scaleExtent([0.5, 8])
			.translateExtent([
				[0, 0],
				[width, height],
			])
			.on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
				svg.attr("transform", `scale(${event.transform.k})`);
				simulation.alpha(1).restart();
			});

		const dragstart = () => {
			d3.select(svgRef.current).classed("fixed", true);
		};

		const dragend = (event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>, node: d3.SimulationNodeDatum) => {
			if (event.active) simulation.alphaTarget(0);
			node.fx = null;
			node.fy = null;
		};

		const dragged = (event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>, node: d3.SimulationNodeDatum) => {
			node.fx = clamp(event.x, 0, width);
			node.fy = clamp(event.y, 0, height);
			simulation.alpha(1).restart();
		};

		const drag = d3
			.drag<SVGSVGElement, d3.SimulationNodeDatum>()
			.on("start", dragstart)
			.on("drag", dragged)
			.on("end", dragend);

		// @ts-ignore  next-line
		svg.call(zoom);
		// @ts-ignore  next-line
		nodes.call(drag);

		return () => {
			simulation.stop();
			d3.select(svgRef.current).selectAll("*").remove();
		};
	}, [data]);

	return <svg ref={svgRef} width={width} height={height} />;
};
