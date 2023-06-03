import { Site }         from "./Site";
import SiteContents     from "./SiteContents";
import RoleHandler from "./funcs/roles/RoleHandler";

export class SiteBuilder
{
    site: Site;

    constructor(id: Id<_HasId>)
    {
        this.site = 
        {
            identifier  : id,
            objects     : new SiteContents(),
            onTick      : [],
            roleHandler : null
        } as Site;
    }

    // handlers
    addOnTick(func: Function, ...args)
    {
        if (!args)
            args = [];

        this.site.onTick.push(func.bind(this.site, ...args));
        return this;
    }

    setRoleHandler(h: RoleHandler)
    {
        this.site.roleHandler = h.bind(this.site);
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
            if (res.type == 'structure' && (obj['structureType'] == 'container' || obj['structureType'] == 'storage'))
                this.addObject('container', obj);

            if (res.type == 'structure')
                this.addObject((obj as Structure).structureType, obj);
            else
                this.addObject(res.type, obj);
        }

        let dropped = Game.rooms[origin.roomName].find(FIND_DROPPED_RESOURCES, {filter: x => origin.getRangeTo(x) >= range });
        for (let drop of dropped)
            this.addObject('energy', drop.id);

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
        return this;
    }
    //

    build(): Site
    {
        return this.site;
    }
}