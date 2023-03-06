import Graph from "../Structures/Graph";
import Node         from "./Node";
import SpawnNode, { SpawnRequest }    from "./SpawnNode";
import HarvestNode from './HarvestNode';
import CollectJob from "../Job/CollectJob";
import UpgradeJob from "../Job/UpgradeJob";

export default class ControllerNode extends Node
{
    pull: Id<StructureContainer>;

    constructor(controller: Id<StructureController>)
    {
        super(controller);
    }

    findFullestContainer(): HarvestNode|null
    {
        let graph = globalThis.graph as Graph<Node>;

        let energyMax = -Infinity;
        let bestNode  = null;
        for (let node of graph.bfs(this.tag))
            if (node instanceof HarvestNode)
                {
                    let drop = Game.getObjectById(node.drop);
                    if (drop && drop.store && drop.store.energy > energyMax)
                    {
                        energyMax = drop.store.energy;
                        bestNode  = node;
                    }
                }

        return bestNode;
    }

    tick()
    {
        if (!this.pull)
        {
            let hn = this.findFullestContainer();
            if (hn)
                this.pull = hn.drop;
        }

        if (this.pull && this.creepPool.count() < 3)
        {
            let spawnNode = this.findNodeOfType("SpawnNode") as SpawnNode;
            let request   = {
                requester: this.tag,
                body: [ WORK, CARRY, MOVE, MOVE ],
                name: `ControllerNode-${Game.time}` 
            } as SpawnRequest;
            spawnNode.requestCreep(request);

        }

        if (this.pull && this.jobPool.free.length == 0)
        {
            let job = new CollectJob(this.tag, this.pull)
            job.next = new UpgradeJob(this.tag, this.tag as Id<StructureController>);
            this.jobPool.add(job);
        }

        super.tick();
    }
}