import Core             from "./Core";
import Event            from "./Events/Event";
import debugRoomFactory from "./Factory/debugRoomFactory";

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

    // screeps does not always destroy static members of a class
    Core.clearInstance();
}