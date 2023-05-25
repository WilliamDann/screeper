import SiteContents     from "./SiteContents";

import RoleHandler      from "./funcs/roles/RoleHandler";
import SpawnHandler     from "./funcs/spawn/SpawnHandler";
import EnergyHandler    from "./funcs/energy/EnergyHandler";

import harvestEnergyHandler   from "./funcs/energy/harvestEnergyHandler";
import containerEnergyHandler from "./funcs/energy/containerEnergyHandler";
import genericRoleHandler     from "./funcs/roles/genericRoleHandler";
import anySpawnHandler        from "./funcs/spawn/anySpawnHandler";

export interface Site
{
    identifier : string;
    objects    : SiteContents;

    // request handlers
    energyRequestHandlers : EnergyHandler[];
    spawnRequestHandlers  : SpawnHandler[];
    creepRoleHandler      : RoleHandler;
}

export class SiteBuilder
{
    site: Site;

    constructor(id: Id<_HasId>)
    {
        this.site = 
        {
            identifier : id,
            objects    : new SiteContents(),

            energyRequestHandlers : [],
            spawnRequestHandlers  : [],
            creepRoleHandler      : genericRoleHandler.bind(this.site)
        } as Site;
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

        let ignore = [ 'terrain', ]
        for (let obj of area)
        {
            if (ignore.indexOf(obj.type) != -1)
                continue;

            if (this[obj.type])
                this[`add_${obj.type}`](obj);
            else if (obj[obj.type]['id'])
                this.addObject(obj.type, obj[obj.type] as _HasId);
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
        return this;
    }

    build(): Site
    {
        return this.site;
    }
}