import BuildJob from "../Job/BuildJob";
import CollectJob  from "../Job/CollectJob";
import TransferJob from "../Job/TransferJob";
import { JobBuilder } from "../Requests/JobBuilder";
import { RequestBuilder } from "../Requests/Request";
import { RequestPriority } from "../Requests/RequestPriority";
import { SpawnRequestBuilder } from "../Requests/SpawnRequest";
import Node        from "./Node";

export default class HarvestNode extends Node
{
    spots: number;
    drop : Id<StructureContainer>;

    constructor(source: Id<Source>)
    {
        super(source);
    }

    get rank()
    {
        let score   = 0;
        let collect = this.getCollectJob();
        let target  = Game.getObjectById(collect.target);

        if (target instanceof StructureContainer)
            score += 50 + (target.store.energy / 100);

        score += this.spots*10;

        score -= new RoomPosition(25, 25, target.room.name).getRangeTo(target);
        score -= this.runningJobs.length * 10;

        return score;
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

    getCollectJob(): CollectJob
    {
        let drop = Game.getObjectById(this.drop);
        if (drop && drop.store)
        {
            return new CollectJob(drop.id);
        }
        return new CollectJob(this.tag as Id<Source>);
    }

    tick()
    {
        if (!this.spots)
            this.spots = this.findSpots();

        if (!this.drop)
            this.resolveDropSite();

        if (this.creepPool.count() < this.spots)
            new RequestBuilder()
                .from(this.tag)
                .priority(RequestPriority.Normal)
                .spawnCreep(
                    new SpawnRequestBuilder()
                        .name(`HarvestNode-${Game.time}-${(Math.random()*1000).toFixed(0)}`)
                        .body([WORK, WORK, CARRY, MOVE])
                        .get()
                )
                .addTo(this.searchForNode("SpawnNode").tag);

        let job = new JobBuilder();
        job.add(new CollectJob(this.tag as Id<Source>))
        if (this.getCollectJob().target == this.tag)
            job.add(new BuildJob(this.drop as any));
        else
            job.add(new TransferJob(this.drop));

        new RequestBuilder()
            .from(this.tag)
            .priority(RequestPriority.Normal)
            .work(job.root, this.creepPool.count())
            .limit(1)
            .addTo(this.tag);

        super.tick();
    }
}