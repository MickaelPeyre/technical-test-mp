import styled from "styled-components";
import Ajv from "ajv";

import { GraphData } from "../type";

const Input = styled.input`
	padding-left: 1.5em;
`;

export const ImportFile = ({ setGraphData }: { setGraphData: (data: GraphData) => void }) => {
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				let dataCandidate;
				try {
					dataCandidate = JSON.parse(e.target?.result as string);
				} catch (error) {
					console.error(error);
					alert("Invalid JSON format");
					dataCandidate = null;
				}

				// Define required schema
				const schema = {
					type: "object",
					properties: {
						nodes: {
							type: "array",
							items: {
								type: "object",
								properties: {
									label: { type: "string" },
									id: { type: "string" },
									attributes: { type: "object" },
									color: { type: "string" },
									size: { type: "number" },
								},
								required: ["label", "id"],
							},
						},
						edges: {
							type: "array",
							items: {
								type: "object",
								properties: {
									source: { type: "string" },
									target: { type: "string" },
									id: { type: "string" },
									attributes: {
										type: "object",
										properties: {
											label: { type: "string" },
										},
									},
									color: { type: "string" },
									size: { type: "number" },
								},
								required: ["source", "target", "id"],
							},
						},
					},
					required: ["nodes"],
				};

				if (!dataCandidate) return;

				// Validate data
				const ajv = new Ajv();
				const validate = ajv.compile(schema);
				const valid = validate(dataCandidate);

				if (!valid) {
					console.log(validate);
					alert(JSON.stringify(validate.errors, null, 2));
				} else {
					// If validation passed, we can safely cast
					const graphData: GraphData = dataCandidate as GraphData;
					setGraphData(graphData);
				}
			};
			reader.readAsText(file);
		}
	};
	return <Input type="file" accept=".json" onChange={handleFileUpload} />;
};
