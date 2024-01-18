import styled from "styled-components";

import { edges, nodes } from "./data/miserable.json";
import { Graph } from "./Components/Graph";
import { GraphData } from "./type";
import { useState } from "react";
import { ImportFile } from "./Components/IportFile";

const App = () => {
	const [graphData, setGraphData] = useState<GraphData>({ nodes, edges });

	return (
		<>
			<Title>Force-directed graph</Title>
			<ImportFile setGraphData={setGraphData} />
			<SvgContainer>
				<Graph data={graphData} />
			</SvgContainer>
		</>
	);
};

export default App;

const SvgContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 80vh;
	width: 100vw;
	overflow: hidden;
`;

const Title = styled.h1`
	font-size: 3.2em;
	line-height: 1.1;
	padding-left: 1.5em;
`;
