import Graph    from "../Structures/Graph";
import Node     from "../Nodes/Node";
import Request from "./Request"
import {RequestPriority} from "./RequestPriority";

export default class RequestBank
{
    requests: { [tag: string] : Request[] }

    constructor()
    {
        this.requests = {};
    }

    init(graph: Graph<Node>)
    {
        for (let tag in graph.verts)
            this.requests[tag] = [];
    }

    addTo(tag: string, request: Request): boolean
    {
        request.to   = tag;
        request.time = Game.time;
        if (!request.limit)
            request.limit = 1
        if (!request.priority)
            request.priority = RequestPriority.Low;
        if ([
            !request.priority != undefined,
            !request.from != undefined,
            graph.verts[tag].isValidRequest(request),
            this.getAssignedByFrom(request.from, tag).length <= request.limit
        ].indexOf(false) != -1)
            return false;

        this.requests[tag].push(request);
        return true;
    }

    getFrom(tag: string): Request
    {
        let bestpri = Infinity;
        let best    = null;

        for (let request of this.requests[tag])
            if (request.priority >= bestpri)
            {
                bestpri = request.priority;
                best    = request;
            }

        return best;
    }

    getAssignedByFrom(assigner: string, tag: string)
    {
        return this.requests[tag].filter(x => x.from == assigner);
    }

    removeFrom(tag: string, request: Request)
    {
        this.requests[tag] = this.requests[tag].filter(x => x != request);
    }
}