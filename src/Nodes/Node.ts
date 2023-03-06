import Graph from "../Structures/Graph";

export default class Node
{
    tag    : string;
    creeps : string[];

    constructor(tag: string)
    {
        this.tag    = tag;
        this.creeps = [];
    }

    findNodeOfType(className: string)
    {
        let graph = globalThis.graph as Graph<Node>;
        for (let node of graph.bfs(this.tag))
            if (node.constructor.name == className)
                return node;
    }

    makeSpawnRequest()
    {
        let spawn = this.findNodeOfType("SpawnNode") as any;
        let request = {
            requester   : this.tag,
            body        : [WORK, CARRY, MOVE, MOVE],
            name        : `ControllerNode-${Game.time}`
        } as any;

        if (spawn.requestCreep(request))
            this.creeps.push(request.name);
    }

    tick() { }
}