import roles from "./roles/all";
import { Site } from "./sites/Site";
import Basic from "./strats/Basic";

export function loop()
{
    // Run Strats
    for (let name in Game.rooms)
        Basic(Game.rooms[name]);

    // Run Creeps
    for(var name in Game.creeps) {
        const creep = Game.creeps[name];
        const role  = creep.memory['role'];
        if (!role)
            continue;

        roles[role](creep);
    }
}