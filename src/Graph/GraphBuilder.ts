import Graph from "./Graph";
import Node  from "../Node/Node";
import SourceNode from "../Node/SourceNode";

export default class GraphBuilder
{
    graph   : Graph;    // final graph
    onRoom ?: string;   // what room is currently being placed on

    constructor()
    {
        this.graph = new Graph();
    }

    room(room: Room): GraphBuilder
    {
        this.onRoom = this.graph.addNode(new Node<_HasId>(`room:${room.name}` as any));

        // parse room contents
        for (let obj of room.lookAtArea(0, 0, 49, 49, true))
        {
            if (obj.type == 'terrain')
                continue;

            for (let param of Object.keys(obj))
            {
                // skip things without ids, like walls
                if (!obj[param]['id'])
                    continue;

                // call builder func for object, or just the general builder func if none exists
                if (this[param])
                    this[param](obj[param])
                else
                    this.hasId(obj[param])
            }
        }

        return this;
    }

    hasId(obj: _HasId): GraphBuilder
    {
        const id = this.graph.addNode(new Node<_HasId>(obj.id));
        this.graph.addEdge(id, this.onRoom);
        return this;
    }

    source(obj: Source)
    {
        const id = this.graph.addNode(new SourceNode(obj.id));
        this.graph.addEdge(id, this.onRoom);
        return this;
    }

    build(): Graph
    {
        return this.graph;
    }
}