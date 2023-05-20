// Concerns
// 1. Run creep roles
// 2. Run site tick funcs

import roles       from "./roles/all";
import HarvestSite from "./sites/HarvestSite";
import SpawnSite   from "./sites/SpawnSite";

export function loop()
{
    let ss  = new SpawnSite(Game.spawns.Spawn1.id);

    let src = Game.spawns.Spawn1.room.find(FIND_SOURCES)[0].id;
    let hs  = new HarvestSite(src)
    for (let name in Game.creeps)
        if (!hs.contains(Game.creeps[name].id))
            hs.addContent("creep", Game.creeps[name].id);

    ss.tick();
    hs.tick();

    for(var name in Game.creeps) {
        const creep = Game.creeps[name];
        const role  = creep.memory['role'];
    if (!role)
            continue;

        // run role
        roles[role](creep);
    }
}