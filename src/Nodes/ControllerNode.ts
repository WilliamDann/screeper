import Node             from "./Node";
import HarvestNode      from './HarvestNode';
import UpgradeJob from "../Job/UpgradeJob";
import RequestBuilder from "../Requests/RequestBuilder";
import { RequestPriority } from "../Requests/RequestPriority";
import { SpawnRequestBuilder } from "../Requests/SpawnRequest";

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

    findContainerHarvester(): HarvestNode|null
    {
        let node = this.searchForNode("HarvestNode") as HarvestNode;
        if (!node)
            return null;
        let drop = Game.getObjectById(node.drop)

        if (drop && drop.store)
            return node;
        return null;
    }

    resolvePull()
    {
        let harv = this.findContainerHarvester();
        if (harv)
        {
            this.pull = harv.drop;
            return true;
        }
        return false;
    }

    spawnCreeps()
    {
        let creeps = this.creepPool.count();
        if (this.creepPool.count() < 3)
            new RequestBuilder()
                .from(this.tag)
                .priority(RequestPriority.Normal)
                .spawnCreep(
                    new SpawnRequestBuilder()
                        .name( `ControllerNode-${Game.time}-${Math.random().toFixed(4)}`)
                        .body([WORK, CARRY, MOVE, MOVE])
                        .get(), 3-creeps
                )
                .addTo(this.tag);
    }

    tick()
    {
        super.tick();
        if (!this.pull)
            if (!this.resolvePull())
                return;

        this.spawnCreeps();
        new RequestBuilder()
            .from(this.tag)
            .priority(RequestPriority.Normal)
            .work(new UpgradeJob(this.tag as Id<StructureController>))
            .addTo(this.tag);
    }
}