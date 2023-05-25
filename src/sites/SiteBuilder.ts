import { Site } from "./Site";
import SiteContents from "./SiteContents";
import containerEnergyHandler from "./funcs/energy/containerEnergyHandler";
import harvestEnergyHandler from "./funcs/energy/harvestEnergyHandler";
import genericRoleHandler from "./funcs/roles/genericRoleHandler";
import anySpawnHandler from "./funcs/spawn/anySpawnHandler";
import creepTick from "./funcs/tick/creepTick";
import minPop from "./funcs/tick/minPop";

export class SiteBuilder
{
    site: Site;

    constructor(id: Id<_HasId>)
    {
        this.site = 
        {
            identifier : id,
            objects    : new SiteContents(),

            onTick                : [],
            energyRequestHandlers : [],
            spawnRequestHandlers  : [],
            creepRoleHandler      : null
        } as Site;
        this.site.creepRoleHandler = genericRoleHandler.bind(this.site);
    }

    findSourceSpots(source: Source): number
    {
        let area = source.room.lookForAtArea(
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

    addObject(id: string, obj: _HasId|Id<_HasId>)
    {
        if (typeof(obj) != 'string')
            obj = (obj as _HasId).id;
        this.site.objects.addContentIfMissing(id, obj);
        return this;
    }

    add_source(source: Source)
    {
        this.site.energyRequestHandlers.push(harvestEnergyHandler.bind(this.site));

        let spots = this.findSourceSpots(source);
        this.site.onTick.push(minPop.bind(this.site, spots));

        this.addObject('source', source);
        return this;
    }

    add_structure(structure: Structure)
    {
        if (structure['store'])
            this.addObject('container', structure);
        if (structure.structureType == 'spawn')
            this.add_spawn(structure as StructureSpawn);
        if (structure.structureType == 'controller' || structure.structureType == 'storage')
            this.add_container(structure as StructureContainer);

        this.addObject(structure.structureType, structure);
        return this;
    }

    add_spawn(spawn: StructureSpawn)
    {
        this.site.spawnRequestHandlers.push(anySpawnHandler.bind(this.site));
        this.addObject('spawn', spawn);
        this.addObject('container', spawn);
        return this;
    }

    add_creep(creep: Creep)
    {
        if (!creep.my)
            this.addObject('danger', creep);
        return this;
    }

    add_container(container: StructureContainer)
    {
        this.site.energyRequestHandlers.push(containerEnergyHandler.bind(this.site));
        this.addObject('conatiner', container.id);
        return this;
    }

    add_tombstone(tombstone: Tombstone)
    {
        this.addObject('danger', tombstone);
        return this;
    }

    addRoomArea(origin: RoomPosition, range: number)
    {
        let room   = Game.rooms[origin.roomName];
        let area   = room.lookAtArea(
            origin.y - Math.floor(range / 2),
            origin.x - Math.floor(range / 2),
            origin.y + Math.floor(range / 2),
            origin.x + Math.floor(range / 2),
            true
        )

        let ignore = [ 'terrain', 'creep' ]
        for (let res of area)
        {
            if (res[res.type]['my'] === false)
                this.addObject('danger', res[res.type] as _HasId);
            if (ignore.indexOf(res.type) != -1)
                continue;


            let obj = Game.getObjectById((res[res.type] as _HasId).id);
            if (this[`add_${res.type}`])
                this[`add_${res.type}`](obj);
            else if (obj[res.type]['id'])
                this.addObject(res.type, obj);
        }

        return this;
    }

    addCreeps()
    {
        for (let name in Game.creeps)
        {
            let creep = Game.creeps[name];
            if (creep.memory['owner'] == this.site.identifier)
                this.addObject('creep', creep);
        }
        this.site.onTick.push(creepTick.bind(this.site));
        return this;
    }

    build(): Site
    {
        return this.site;
    }
}