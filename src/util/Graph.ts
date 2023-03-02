import { Queue } from "./Queue";

export class Node<T>
{
    val: T;
    adj: Node<T>[];
    constructor(val: T)
    {
        this.val = val;
        this.adj = [];
    }

    makeAdj(node: Node<T>)
    {
        this.adj.push(node);
    }

    makeNotAdj(node: Node<T>)
    {
        let i = this.adj.indexOf(node);
        if (i != -1)
            this.adj.splice(i, 1);
    }

    isAdj(node: Node<T>)
    {
        return this.adj.indexOf(node) != -1;
    }
}

export class Graph<T>
{
    directed: boolean;
    nodes   : Map<T, Node<T>>;
    constructor(directed=false)
    {
        this.nodes = new Map<T, Node<T>>;
        this.directed = directed;
    }

    *bfs(start: Node<T>)
    {
        const visited = new Set<Node<T>>();
        const visit   = new Queue<Node<T>>();

        visit.enqueue(start);

        while (!visit.isEmpty)
        {
            const node = visit.dequeue();
            if (node && !visited.has(node)) 
            {
                yield node;
                visited.add(node);
                node.adj.forEach(adj => visit.enqueue(adj));
            }
        }
    }

    addVertex(val: T): Node<T>
    {
        if (this.nodes.has(val))
            return this.nodes.get(val)

        const vert = new Node(val);
        this.nodes.set(val, vert);
        return vert;
    }

    removeVertex(val: T): boolean
    {
        const curr = this.nodes.get(val);
        if (curr)
            for (let node of this.nodes.values())
                node.makeNotAdj(curr);
        return this.nodes.delete(val);
    }

    addEdge(src: T, dest: T)
    {
        const srcNode   = this.addVertex(src);
        const destNode  = this.addVertex(dest);

        srcNode.makeAdj(destNode);
        if (!this.directed)
            destNode.makeAdj(srcNode);

        return {src: srcNode, dest: destNode};
    }

    removeEdge(src: T, dest: T)
    {
        const srcNode  = this.nodes.get(src);
        const destNode = this.nodes.get(dest);

        if (!srcNode || !destNode)
        return {src: srcNode, dest: destNode};

        srcNode.makeNotAdj(destNode);
        if (!this.directed)
            destNode.makeNotAdj(srcNode);

        return {src: srcNode, dest: destNode};
    }
}