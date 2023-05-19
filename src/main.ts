// Concerns
// 1. Run creep roles
// 2. Run site tick funcs

import roles       from "./roles/all";
import HarvestSite from "./sites/HarvestSite";

export function loop()
{
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], ''+Game.time);

    let src = Game.spawns.Spawn1.room.find(FIND_SOURCES)[0].id;
    let hs  = new HarvestSite(src)
    for (let name in Game.creeps)
        if (!hs.contains(Game.creeps[name].id))
            hs.addContent("creep", Game.creeps[name].id);
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