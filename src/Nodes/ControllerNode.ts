import { typeNearRank } from "../Structures/Searches";
import Node from "./Node";
import SpawnNode from "./SpawnNode";

export default class ControllerNode extends Node
{
    constructor(controller: Id<StructureController>)
    {
        super(controller);
    }

    tick()
    {
        if (this.creeps.length == 0)
        {
            let spawn = globalThis.graph.rankBfs(this.tag,x => typeNearRank("SpawnNode", this.tag as any, x.tag as any)) as SpawnNode;
            if (!spawn.requests[this.tag])
                spawn.requests[this.tag] = 1;
        }
    }
}