import Core             from "./Core";
import Event from "./Events/Event";
import debugRoomFactory from "./Factory/debugRoomFactory";
import all from "./Roles/all";

// screeps entry point
export function loop()
{
    // init core systems
    Core.getInstance();

    // load in debug room
    debugRoomFactory(Game.rooms.sim);

    // emit flow control events
    new Event('init', {}).emit();
    new Event('tick', {}).emit();

    // run creep roles
    for (let name in Game.creeps)
    {
        const creep = Game.creeps[name];

        // run role function
        all[creep.memory['role']](creep);
    }

    // screeps does not always destroy static members of a class
    Core.clearInstance();
}