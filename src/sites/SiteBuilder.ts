import { Site }         from "./Site";
import SiteContents     from "./SiteContents";
import EnergyHandler    from "./funcs/energy/EnergyHandler";
import RoleHandler      from "./funcs/roles/RoleHandler";
import SpawnHandler     from "./funcs/spawn/SpawnHandler";
import creepTick        from "./funcs/tick/creepTick";

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
    }

    // handlers
    addHandler(type: string, handler: Function)
    {
        this.site[type].push(handler.bind(this.site));
        return this;
    }

    addEnergyHandler(handler: EnergyHandler)
    {
        this.addHandler('energyRequestHandlers', handler);
        return this;
    }

    addSpwanHandler(handler: SpawnHandler)
    {
        this.addHandler('spawnRequestHandlers', handler);
        return this;
    }

    setRoleHandler(handler: RoleHandler)
    {
        this.site.creepRoleHandler = handler.bind(this.site);
        return this;
    }

    addOnTick(func: Function, ...args)
    {
        if (!args)
            args = [];

        this.site.onTick.push(func.bind(this.site, ...args));
        return this;
    }

    // objects
    addObject(id: string, obj: _HasId|Id<_HasId>)
    {
        if (typeof(obj) != 'string')
            obj = (obj as _HasId).id;
        this.site.objects.addContentIfMissing(id, obj);
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
            this.addObject(res.type, obj);
        }

        return this;
    }
    //

    // creeps
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
    //

    build(): Site
    {
        return this.site;
    }
}