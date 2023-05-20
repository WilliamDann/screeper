// Responsible for using creeps to harvest at a given source
import CreepMediator from "../mediators/CreepMediator";
import Site from "./Site";

export default class extends Site
{
    constructor(source : Id<Source>)
    {
        super();
        this.addContent("source", source);
    }

    findCreepRole(creep: Creep)
    {
        if (creep.store.getUsedCapacity("energy") == 0)
        {
            creep.memory['role']   = 'harvest';
            creep.memory['target'] = this.getContent("source")[0].id;
            return;
        }

        let sites = this.getContent('site') as ConstructionSite[];
        if (sites.length != 0)
        {
            creep.memory['role']   = 'build';
            creep.memory['target'] = sites[0].id;
            return;
        }

        let containers  = this.getContent('container') as StructureContainer[];
        containers      = containers.filter(x => x.store.getFreeCapacity(RESOURCE_ENERGY) != 0)
        if (containers.length != 0)
        {
            creep.memory['role']   = 'fill';
            creep.memory['target'] = containers[0].id;
            return;
        }

        creep.memory['role'] = 'idle';
    }

    resetCreepRole(creep: Creep)
    {
        delete creep.memory['role'];
        delete creep.memory['state'];
        delete creep.memory['target'];
    }

    findMiningSpots(): number
    {
        let source = this.getContent<Source>("source")[0]
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

    findContainers(range: number): StructureContainer[]
    {
        let source = this.getContent("source")[0] as Source;
        let area   = source.room.lookAtArea(
            source.pos.y - range,
            source.pos.x - range,
            source.pos.y + range,
            source.pos.x + range,
            true
        )

        let arr = []
        for (let result of area)
            if (result.structure && result.structure['store'])
                arr.push(result.structure)

        return arr;
    }

    findSites(range: number): ConstructionSite[]
    {
        let source = this.getContent("source")[0] as Source;
        let area   = source.room.lookAtArea(
            source.pos.y - range,
            source.pos.x - range,
            source.pos.y + range,
            source.pos.x + range,
            true
        )

        let arr = []
        for (let result of area)
            if (result.constructionSite)
                arr.push(result.constructionSite)

        return arr;
    }

    createContainerSite(range: number)
    {
        let source = this.getContent("source")[0] as Source;
        let minX = source.pos.x - range;
        let minY = source.pos.y - range;
        let maxX = source.pos.x + range;
        let maxY = source.pos.y + range;

        // TODO not random
        source.room.createConstructionSite(
            Math.random() * (maxX - minX) + minX,
            Math.random() * (maxY - minY) + minY,
            'container'
        )
    }

    poll()
    {
        let containerObjs = this.findContainers(5);
        let siteObjs      = this.findSites(5);

        if (containerObjs.length != 0)
            for (let container of containerObjs)
                this.addContentIfMissing('container', container.id);

        if (siteObjs.length != 0)
            for (let site of siteObjs)
                this.addContentIfMissing('site', site.id);
    }

    tick()
    {
        this.poll();

        let containers = this.getContent<StructureContainer>('container');
        let sites      = this.getContent<StructureSpawn>('site');
        let creeps     = this.getContent<Creep>('creep');

        if (creeps.length < this.findMiningSpots())
            CreepMediator.getInstance().request(
                [WORK, CARRY, MOVE],
                'harvestSite'+Game.time
            );

        if (containers.length == 0 && sites.length == 0)
            this.createContainerSite(5);

        for (let creep of this.getContent('creep') as Creep[])
            if (!creep.memory['role'])
                this.findCreepRole(creep);
            else if (!creep.memory['state'])
                this.resetCreepRole(creep);
    }
}