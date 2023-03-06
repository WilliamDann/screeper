import Job      from "./Job/Job";
import Graph    from "./Structures/Graph";
import Node     from "./Nodes/Node";

export interface SpawnRequest
{
    requester   : string;
    body        : BodyPartConstant[];
    name        : string;
    opts       ?: SpawnOptions;
}

export interface Request
{
    from        : string;
    to          : string;
    time        : number;

    resource   ?:
    { 
        energy ?: number
    };

    spawnCreeps?: SpawnRequest[];
    creeps     ?: string[];

    work       ?: Job[];
}

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
}