import Graph        from "../Structures/Graph";
import Node         from "./Node";
import SpawnNode, { SpawnRequest } from "./SpawnNode";

export default class ControllerNode
{
    creeps : string[];

    private controller  : Id<StructureController>;
    private rclGoal     : number;

    constructor(controller: Id<StructureController>, rclGoal=8)
    {
        this.controller = controller;
        this.rclGoal    = rclGoal;

        this.creeps = [];
    }

    private findSpawn(): SpawnNode
    {
        let graph = globalThis.graph as Graph<Node>;
        for (let node of graph.bfs(this.controller))
            if (node.constructor.name == "SpawnNode")
                return node as SpawnNode;
    }

    private requestCreep()
    {
        let spawn   = this.findSpawn();
        let request = {
            requester   : this.controller,
            body        : [WORK, CARRY, MOVE, MOVE],
            name        : `ControllerNode-${Game.time}`
        } as SpawnRequest;

        if (spawn.requestCreep(request))
            this.creeps.push(request.name);
    }

    tick()
    {
        if (this.creeps.length < 1)
            this.requestCreep();
    }
}