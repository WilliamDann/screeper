import Node             from "./Node";
import SpawnNode        from "./SpawnNode";
import HarvestNode      from './HarvestNode';
import CollectJob       from "../Job/CollectJob";
import UpgradeJob       from "../Job/UpgradeJob";
import { SpawnRequest } from "../Requests";

export default class ControllerNode extends Node
{
    pull: Id<StructureContainer>;

    constructor(controller: Id<StructureController>)
    {
        super(controller);
    }

    get rank()
    {
        return Game.rooms[this.tag].controller.level;
    }

    findFullestContainer(): HarvestNode|null
    {
        let node = this.searchForNode("HarvestNode") as HarvestNode;
        if (!node)
            return null;
        let drop = Game.getObjectById(node.drop)

        if (drop && drop.store)
            return node;
        return null;
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