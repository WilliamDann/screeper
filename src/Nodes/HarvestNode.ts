import BuildJob from "../Job/BuildJob";
import CollectJob from "../Job/CollectJob";
import TransferJob from "../Job/TransferJob";
import _HasStore from "../Misc";
import Node from "./Node";
import SpawnNode, { SpawnRequest } from "./SpawnNode";

export default class HarvestNode extends Node
{
    spots: number;
    drop : Id<StructureContainer>;

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

    findContainer(): boolean
    {
        let src  = Game.getObjectById(this.tag as Id<Source>);
        let area = src.room.lookForAtArea(
            LOOK_STRUCTURES,
            src.pos.y-2,
            src.pos.x-2,
            src.pos.y + 2,
            src.pos.x +2,
            true
        ); 

        for (let entry of area)
            if (entry.structure.structureType == STRUCTURE_CONTAINER)
            {
                this.drop = entry.structure.id as Id<StructureContainer>;
                return true;
            }

        return false;
    }

    findDropSpot(): RoomPosition
    {
        let src = Game.getObjectById(this.tag as Id<Source>);
        let spn = src.room.find(FIND_MY_SPAWNS)[0];

        let path = spn.pos.findPathTo(src, { ignoreCreeps: true })

        return new RoomPosition(path[path.length-3].x, path[path.length-3].y, src.room.name);
    }

    resolveDropSite()
    {
        if (!this.findContainer())
        {
            let room = Game.getObjectById(this.tag as Id<Source>).room;
            let spot = this.findDropSpot()
            room.createConstructionSite(spot, STRUCTURE_CONTAINER)
            this.drop = room.lookForAt(LOOK_CONSTRUCTION_SITES, spot)[0].id as any;
        }
    }

    spawnCreepsForSpots()
    {
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
    }

    makeJobs()
    {
        let drop = Game.getObjectById(this.drop);

        if (!drop)
        {
            delete this.drop;
            return;
        }

        if (drop instanceof ConstructionSite)
        {
            if (this.getJobsAssignedBy(this.tag).length == 0)
                for (let i = 0; i < this.creepPool.free.length; i++)
                {
                    let job = new CollectJob(this.tag, this.tag as Id<Source>);
                    job.next = new BuildJob(this.tag, drop.id as Id<ConstructionSite>);
                    this.jobPool.add(job);
                }
        }

        if (drop instanceof StructureContainer)
        {
            if (this.getJobsAssignedBy(this.tag).length == 0)
                for (let i = 0; i < this.creepPool.free.length; i++)
                {
                    let job     = new CollectJob(this.tag, this.tag as Id<Source>);
                    job.next    = new TransferJob(this.tag, drop.id as Id<StructureContainer>);
                    this.jobPool.add(job);
                }
        }

        if (this.jobPool.free.length == 0)
            this.jobPool.add(new CollectJob(this.tag, this.tag as Id<Source>))
    }

    tick()
    {
        if (!this.spots)
            this.spots = this.findSpots();

        if (!this.drop)
            this.resolveDropSite();

        this.spawnCreepsForSpots();
        this.makeJobs();

        super.tick();
    }
}