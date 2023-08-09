import Processor      from "./Processor";
import commandFactory from "./commands/util/CommandFactory";

// screeps entry point
export function loop()
{
    const processor = Processor.getInstance();
    processor.init();


    // create commands
    for (let flag in Game.flags)
        processor.registerCommand(commandFactory(Game.flags[flag]));


    processor.run();

    // remove static members, screeps does not always
    Processor.clear();
}