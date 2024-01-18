export type Node = {
	label: string;
	id: string;
	attributes?: Object;
	color?: string;
	size?: number;
};

export type Edge = {
	source: string;
	target: string;
	id: string;
	attributes?: {
		label?: string;
	};
	color?: string;
	size?: number;
};

export type GraphData = {
	nodes: Node[];
	edges?: Edge[];
};
