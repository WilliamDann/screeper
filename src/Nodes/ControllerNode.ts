import CollectJob from "../Job/CollectJob";
import JobBuilder from "../Job/JobBuilder";
import UpgradeJob from "../Job/UpgradeJob";
import { typeNearRank } from "../Structures/Searches";
import { HarvestNode } from "./HarvestNode";
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
        if (this.creeps.count == 0)
        {
            let harvest = graph.rankBfs(this.tag, x => typeNearRank("HarvestNode", this, x));
            if (harvest)
            {
                let spawn = globalThis.graph.rankBfs(this.tag,x => typeNearRank("SpawnNode", this, x)) as SpawnNode;
                if (!spawn.requests[this.tag])
                    spawn.requests[this.tag] = 1;
            }
        }

        if (this.jobs.free.length == 0)
        {
            let harvest = graph.rankBfs(this.tag, x => typeNearRank("HarvestNode", this, x)) as HarvestNode;
            if (harvest)
                this.jobs.add(
                    new JobBuilder()
                        .add(new CollectJob(harvest.pull as any))
                        .add(new UpgradeJob(this.tag as any))
                        .build()
                );
        }

        super.tick();
    }
}