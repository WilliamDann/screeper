// Concerns
// 1. Run creep roles
// 2. Run site tick funcs

import harvester   from "./roles/harvest";
import upgrader    from "./roles/upgrader";
import builder     from "./roles/builder";
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
        var creep = Game.creeps[name];
        if(creep.memory['role'] == 'harvest') {
            harvester(creep);
        }
        if(creep.memory['role'] == 'upgrad') {
            upgrader(creep);
        }
        if(creep.memory['role'] == 'build') {
            builder(creep);
        }
    }
}