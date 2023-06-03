import { Site } from "../sites/Site";
import EnergyHandler from "../sites/funcs/energy/EnergyHandler";
import RoleHandler from "../sites/funcs/roles/RoleHandler";
import SpawnHandler from "../sites/funcs/spawn/SpawnHandler";

export default class Nest
{
    room : Room;
    sites : Site[];
    handlers : {
        spawn: SpawnHandler[],
        energy: EnergyHandler[],
    }

    constructor(room: Room)
    {
        this.room     = room
        this.sites    = []
        this.handlers = {
            spawn  : [],
            energy : [],
        }
    }

    addHandler(type: string, h: Function, site: Site, ...args)
    {
        if (!this.handlers[type])
            throw new Error('Invalid Handler Type');

        let handler = h.bind(site, ...args);
        this.handlers[type].push(handler);

        return this;
    }

    addSite(site: Site)
    {
        this.sites.push(site);
    }

    creepTick()
    {
        for (let site of this.sites)
            for (let creep of site.objects.getContent('creep') as Creep[])
                if (creep && !creep.memory['role'] || creep.memory['role'] == 'idle' || !creep.memory['state'])
                    site.roleHandler(creep);
    }

    tick()
    {
        this.creepTick();
        for (let site of this.sites)
            for (let f of site.onTick)
                f();
    }
}