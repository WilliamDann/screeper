import CollectJob from "../Job/CollectJob";
import _HasStore from "../Misc";
import Node from "./Node";
import SpawnNode, { SpawnRequest } from "./SpawnNode";

export default class HarvestNode extends Node
{
    spots: number;

    constructor(source: Id<Source>)
    {
        super(source);
    }

    findSpots(): number
    {
        let source = Game.getObjectById(this.tag as Id<Source>);
        let area   = source.room.lookForAtArea(
            LOOK_TERRAIN,
            source.pos.y - 1,
            source.pos.x - 1,
            source.pos.y + 1,
            source.pos.x + 1,
            true
        );
        area = area.filter(x => x.terrain != 'wall');
        return area.length;
    }

    tick()
    {
        if (!this.spots)
            this.spots = this.findSpots();

        if (this.creepPool.count() < this.spots)
        {
            let spawnNode = this.findNodeOfType("SpawnNode") as SpawnNode;
            let request   = {
                requester: this.tag,
                body: [ WORK, CARRY, MOVE, MOVE ],
                name: `HarvestNode-${Game.time}` 
            } as SpawnRequest;
            spawnNode.requestCreep(request);
        }

        if (this.jobPool.free.length == 0)
            this.jobPool.add(new CollectJob(this.tag, this.tag as Id<Source>))

        super.tick();
    }
}