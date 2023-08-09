import Colony from "./Colony";
import World from "./World";
import CommandFactory from "./commands/CommandFactory";

// screeps entry point
export function loop()
{
    const world = World.getInstance();

    // create colonies for rooms
    for (let name in Game.rooms)
        world.colonies[name] = new Colony(name);


    // create commands for rooms
    for (let flag in Game.flags)
        world.processor.registerCommand(CommandFactory(Game.flags[flag]));


    // run bot
    world.processor.init();
    world.processor.run();


    // remove static members, as screeps does not always
    World.clear();
}