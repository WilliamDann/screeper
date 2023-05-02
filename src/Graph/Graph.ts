import Node from "./Node";

export default class Graph
{
    nodes : { [nodeName: string]: Node<_HasId>  }   // Collection of nodes in the graph
    edges : { [nodeName: string]: string[]      }   // Collection of edges between nodes in the graph

    constructor()
    {
        this.nodes = {}
        this.edges = {}
    }

    // Adds a node to the graph and returns a unique string id
    addNode(node: Node<_HasId>): string
    {
        const id        = Math.random().toString(16).slice(2);
        this.nodes[id]  = node;
        this.edges[id]  = [];
        return id;
    }

    // add an edge to the graph
    addEdge(from: string, to: string)
    {
        const frmNode = this.nodes[from];
        const toNode  = this.nodes[to];

        if (!frmNode || !toNode)
            throw new Error("Invalid node id");

        this.edges[from].push(to);
        this.edges[to].push(from);
    }
}