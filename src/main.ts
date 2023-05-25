import roles from "./roles/all";
import { Site } from "./sites/Site";
import LowPopStrat from "./strats/LowPopStrat";

export function loop()
{
    // Build sites
    let sites = [] as Site[];
    for (let name in Game.rooms)
        sites = sites.concat(LowPopStrat(Game.rooms[name]));

    // Run tick funcs
    for (let site of sites)
        for (let tick of site.onTick)
            tick();

    // Run Creep funcs
    for(var name in Game.creeps) {
        const creep = Game.creeps[name];
        const role  = creep.memory['role'];
        if (!role)
            continue;

        roles[role](creep);
    }

    // Sim room does not always destroy object on script exit
    sites = [];
}