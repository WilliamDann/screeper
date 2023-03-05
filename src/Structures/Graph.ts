import LL from "./LL";

export default class Graph<T>
{
    verts   : { [name: string]: T }
    edges   : { [name: string]: string[] }

    constructor()
    {
        this.verts = {};
        this.edges = {};
    }

    addVert(tag: string, vert: T)
    {
        this.verts[tag] = vert;
    }

    addEdge(tagA: string, tagB: string)
    {
        if (!this.edges[tagA])
            this.edges[tagA] = [];
        if (!this.edges[tagB])
            this.edges[tagB] = [];

        if (this.edges[tagA].indexOf(tagB) == -1)
            this.edges[tagA].push(tagB);
        if (this.edges[tagB].indexOf(tagA) == -1)
            this.edges[tagB].push(tagA);
    }

    *bfs(start: string)
    {
        const visited = new Set<string>();
        const visit   = new LL<string>();

        visit.add(start);

        while(visit.length != 0)
        {
            const tag   = visit.remove();
            const vert  = this.verts[tag];

            if (vert && !visited.has(tag))
            {
                yield vert;
                visited.add(tag);
                this.edges[tag].forEach(edge => visit.add(edge));
            }
        }
    }

    // TODO dfs, use stack instead of queue
}